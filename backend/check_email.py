"""Check the contact-form email settings without running the web app.

    python check_email.py           # connect and log in only
    python check_email.py --send    # also send a real test email to NOTIFY_EMAIL

Run it from the backend/ directory. It reads backend/.env, exactly like server.py.
"""
import os
import smtplib
import ssl
import socket
import sys
from email.message import EmailMessage
from email.utils import formataddr, formatdate, make_msgid
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / '.env')

HOST = os.environ.get('SMTP_HOST', '').strip()
PORT = int(os.environ.get('SMTP_PORT', '465'))
USER = os.environ.get('SMTP_USER', '').strip()
PASSWORD = os.environ.get('SMTP_PASSWORD', '')
USE_SSL = os.environ.get('SMTP_USE_SSL', '').strip().lower() in ('1', 'true', 'yes') or PORT == 465
SENDER = os.environ.get('SENDER_EMAIL', '').strip() or USER
SENDER_NAME = os.environ.get('SENDER_NAME', 'CGreen Website')
NOTIFY_LIST = [e.strip() for e in os.environ.get('NOTIFY_EMAIL', 'info@cgreen.in').split(',') if e.strip()]
NOTIFY = ', '.join(NOTIFY_LIST)


def fail(message, hint=None):
    print(f"\nFAILED: {message}")
    if hint:
        print(f"\n{hint}")
    sys.exit(1)


def main():
    send = '--send' in sys.argv

    print("Settings read from backend/.env")
    print(f"  SMTP_HOST     {HOST or '(not set)'}")
    print(f"  SMTP_PORT     {PORT}  ({'implicit TLS' if USE_SSL else 'STARTTLS'})")
    print(f"  SMTP_USER     {USER or '(not set)'}")
    print(f"  SMTP_PASSWORD {'set, ' + str(len(PASSWORD)) + ' characters' if PASSWORD else '(not set)'}")
    print(f"  SENDER_EMAIL  {SENDER or '(not set)'}")
    print(f"  NOTIFY_EMAIL  {NOTIFY}")
    print()

    missing = [n for n, v in (('SMTP_HOST', HOST), ('SMTP_USER', USER), ('SMTP_PASSWORD', PASSWORD)) if not v]
    if missing:
        fail(
            f"{', '.join(missing)} not set in backend/.env",
            "Generate an app-specific password in Zoho Mail:\n"
            "  My Account > Security > App Passwords > Generate New Password\n"
            "then put it in backend/.env as SMTP_PASSWORD.",
        )

    context = ssl.create_default_context()
    try:
        print(f"Connecting to {HOST}:{PORT} ...")
        if USE_SSL:
            smtp = smtplib.SMTP_SSL(HOST, PORT, context=context, timeout=20)
        else:
            smtp = smtplib.SMTP(HOST, PORT, timeout=20)
            smtp.ehlo()
            smtp.starttls(context=context)
            smtp.ehlo()
        print("Connected.")
    except socket.gaierror:
        fail(
            f"Could not resolve host '{HOST}'.",
            "Check SMTP_HOST. Use smtp.zoho.in for an India-region Zoho account\n"
            "(your cgreen.in MX records point at zoho.in), or smtp.zoho.com otherwise.",
        )
    except (socket.timeout, TimeoutError, OSError) as e:
        fail(
            f"Could not connect to {HOST}:{PORT} ({e.__class__.__name__}: {e}).",
            "Most likely the port is blocked by a firewall or the wrong port is set.\n"
            "Use 465 for implicit TLS, or 587 with SMTP_USE_SSL=false for STARTTLS.",
        )
    except ssl.SSLError as e:
        fail(
            f"TLS handshake failed ({e}).",
            "The port and TLS mode do not match. Port 465 needs implicit TLS;\n"
            "port 587 needs SMTP_USE_SSL=false so STARTTLS is used instead.",
        )

    with smtp:
        try:
            print(f"Authenticating as {USER} ...")
            smtp.login(USER, PASSWORD)
            print("Authentication succeeded.")
        except smtplib.SMTPAuthenticationError as e:
            fail(
                f"Zoho rejected the credentials ({e.smtp_code} {e.smtp_error}).",
                "SMTP needs an app-specific password, not the normal login password:\n"
                "  Zoho Mail > My Account > Security > App Passwords > Generate New Password\n"
                "Also confirm SMTP_USER is the full address, including @cgreen.in.",
            )

        if not send:
            print("\nOK. Credentials work. Re-run with --send to deliver a test email.")
            return

        msg = EmailMessage()
        msg["Subject"] = "CGreen contact form - test email"
        msg["From"] = formataddr((SENDER_NAME, SENDER))
        msg["To"] = NOTIFY
        msg["Date"] = formatdate(localtime=True)
        msg["Message-ID"] = make_msgid(domain=SENDER.split("@")[-1] or None)
        msg.set_content(
            "This is a test from backend/check_email.py.\n\n"
            "If you are reading this in the info@cgreen.in inbox, the contact form's\n"
            "email delivery is configured correctly.\n"
        )

        try:
            print(f"Sending a test email to {NOTIFY} ...")
            smtp.send_message(msg)
        except smtplib.SMTPSenderRefused as e:
            fail(
                f"Zoho refused the From address '{SENDER}' ({e.smtp_code} {e.smtp_error}).",
                "Zoho only allows sending as an address the authenticated user owns.\n"
                "Set SENDER_EMAIL to SMTP_USER, or add it as a verified alias in Zoho.",
            )
        except smtplib.SMTPException as e:
            fail(f"Send failed ({e.__class__.__name__}: {e}).")

        print(f"\nOK. Test email sent. Check the {NOTIFY} inbox (and its spam folder).")


if __name__ == '__main__':
    main()
