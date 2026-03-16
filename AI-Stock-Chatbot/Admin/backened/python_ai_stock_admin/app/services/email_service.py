import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings
import logging

logger = logging.getLogger(__name__)


def send_email(to: str, subject: str, html_body: str) -> bool:
    """Send an email via SMTP. Returns True on success."""
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.EMAIL_FROM
        msg["To"] = to
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.EMAIL_FROM, to, msg.as_string())
        return True
    except Exception as e:
        logger.error(f"Email send failed to {to}: {e}")
        return False


def send_verification_email(to: str, username: str, token: str) -> bool:
    verify_url = f"http://localhost:3000/verify-email?token={token}"
    html = f"""
    <div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2 style="color:#00c896">Verify your email</h2>
      <p>Hi <strong>{username}</strong>,</p>
      <p>Click the button below to verify your email address.</p>
      <a href="{verify_url}" style="background:#00c896;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;margin:16px 0">
        Verify Email
      </a>
      <p style="color:#888;font-size:12px">This link expires in 24 hours.</p>
    </div>
    """
    return send_email(to, "Verify your EnsWealth account", html)


def send_password_reset_email(to: str, username: str, token: str) -> bool:
    reset_url = f"http://localhost:3000/reset-password?token={token}"
    html = f"""
    <div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2 style="color:#00c896">Reset your password</h2>
      <p>Hi <strong>{username}</strong>,</p>
      <p>You requested a password reset. Click below to set a new password.</p>
      <a href="{reset_url}" style="background:#ff4d6d;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;margin:16px 0">
        Reset Password
      </a>
      <p style="color:#888;font-size:12px">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
    </div>
    """
    return send_email(to, "Reset your EnsWealth password", html)
