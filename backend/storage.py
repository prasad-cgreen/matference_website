"""Where uploaded photos live.

Local disk is the default because it needs no credentials. The public surface
here is deliberately small - ``save``, ``delete``, ``url_for`` - so switching to
S3 later means writing one more backend class and changing a setting, not
touching the gallery routes.

Uploads must NOT be written into frontend/public: that directory is baked into
the Docker image at build time, so anything written there at runtime disappears
on the next deploy.
"""
import logging
import os
import re
import secrets
from pathlib import Path
from typing import Protocol

logger = logging.getLogger(__name__)

# Magic-byte signatures. The browser-supplied content type is a hint, not
# evidence, so the file's own header decides what it is.
_SIGNATURES: tuple[tuple[bytes, str, str], ...] = (
    (b'\xff\xd8\xff', 'image/jpeg', '.jpg'),
    (b'\x89PNG\r\n\x1a\n', 'image/png', '.png'),
    (b'GIF87a', 'image/gif', '.gif'),
    (b'GIF89a', 'image/gif', '.gif'),
)

MAX_UPLOAD_BYTES = int(os.environ.get('MAX_UPLOAD_BYTES', str(8 * 1024 * 1024)))
UPLOAD_DIR = Path(os.environ.get('UPLOAD_DIR', Path(__file__).parent / 'uploads')).resolve()
# Public path prefix the app serves uploaded files from.
UPLOAD_URL_PREFIX = os.environ.get('UPLOAD_URL_PREFIX', '/uploads')


class UnsupportedImage(ValueError):
    """The bytes offered are not an image format we accept."""


def sniff_image(data: bytes) -> tuple[str, str]:
    """Identify an image from its own bytes. Returns (content_type, extension)."""
    for signature, content_type, extension in _SIGNATURES:
        if data.startswith(signature):
            return content_type, extension
    # WEBP is RIFF-framed: "RIFF" then a 4-byte size then "WEBP".
    if len(data) >= 12 and data[:4] == b'RIFF' and data[8:12] == b'WEBP':
        return 'image/webp', '.webp'
    raise UnsupportedImage("Only JPEG, PNG, GIF and WEBP images are accepted.")


def safe_stem(original_name: str) -> str:
    """Readable, collision-free basename derived from - but not trusting - the upload."""
    stem = Path(original_name or '').stem
    stem = re.sub(r'[^A-Za-z0-9._-]+', '-', stem).strip('-.')[:48]
    return stem.lower() or 'photo'


class Storage(Protocol):
    def save(self, data: bytes, original_name: str) -> tuple[str, str, int]: ...
    def delete(self, key: str) -> None: ...
    def url_for(self, key: str) -> str: ...


class LocalStorage:
    """Writes to a directory on disk, served by the app at UPLOAD_URL_PREFIX."""

    def __init__(self, directory: Path = UPLOAD_DIR, url_prefix: str = UPLOAD_URL_PREFIX):
        self.directory = Path(directory).resolve()
        self.url_prefix = url_prefix.rstrip('/')
        self.directory.mkdir(parents=True, exist_ok=True)

    def save(self, data: bytes, original_name: str) -> tuple[str, str, int]:
        """Persist bytes. Returns (key, content_type, size)."""
        if not data:
            raise UnsupportedImage("The uploaded file is empty.")
        if len(data) > MAX_UPLOAD_BYTES:
            raise UnsupportedImage(
                f"Image is larger than {MAX_UPLOAD_BYTES // (1024 * 1024)}MB."
            )
        content_type, extension = sniff_image(data)
        # The stored name is generated, never the client's: that removes path
        # traversal and overwrite-by-collision in one step.
        key = f"{safe_stem(original_name)}-{secrets.token_hex(8)}{extension}"
        destination = (self.directory / key).resolve()
        destination.relative_to(self.directory)  # defence in depth
        destination.write_bytes(data)
        return key, content_type, len(data)

    def delete(self, key: str) -> None:
        if not key:
            return
        try:
            target = (self.directory / key).resolve()
            target.relative_to(self.directory)
        except ValueError:
            logger.warning("Refusing to delete a key outside the upload directory: %r", key)
            return
        try:
            target.unlink()
        except FileNotFoundError:
            # Already gone. The database row is still worth removing.
            pass
        except OSError as e:
            logger.error("Could not delete upload %s: %s", key, e)

    def url_for(self, key: str) -> str:
        return f"{self.url_prefix}/{key}"


def get_storage() -> Storage:
    backend = os.environ.get('STORAGE_BACKEND', 'local').strip().lower()
    if backend != 'local':
        # Intentionally loud: silently falling back to local disk in production
        # would look like it worked until the next deploy wiped the uploads.
        raise RuntimeError(
            f"STORAGE_BACKEND={backend!r} is not implemented. Only 'local' is "
            "available today; add an S3 backend here when a bucket exists."
        )
    return LocalStorage()
