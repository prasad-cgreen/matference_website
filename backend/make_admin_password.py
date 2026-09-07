"""Generate the bcrypt hash for the admin password.

    python make_admin_password.py

Prompts without echoing, then prints the two lines to paste into backend/.env.
The plaintext password is never written to disk or to your shell history.
"""
import getpass
import sys

from security import MAX_PASSWORD_BYTES, hash_password


def main():
    print("Create the admin password for the CGreen admin panel.\n")
    password = getpass.getpass("Password: ")
    if not password:
        sys.exit("Cancelled: no password entered.")
    if len(password) < 12:
        print("\nRefusing: use at least 12 characters. This is the only account,")
        print("it is reachable from the internet, and there is no second factor.")
        sys.exit(1)
    if len(password.encode('utf-8')) > MAX_PASSWORD_BYTES:
        sys.exit(f"Too long: at most {MAX_PASSWORD_BYTES} bytes.")
    if password != getpass.getpass("Confirm: "):
        sys.exit("Cancelled: the passwords did not match.")

    print("\nAdd these to backend/.env (keep ADMIN_PASSWORD_HASH secret):\n")
    print(f"ADMIN_PASSWORD_HASH={hash_password(password)}")
    print("\nAlso set ADMIN_EMAIL to the address you will sign in with, and")
    print("ADMIN_JWT_SECRET to a long random string, for example:")
    print("  python -c \"import secrets; print(secrets.token_urlsafe(48))\"")


if __name__ == '__main__':
    main()
