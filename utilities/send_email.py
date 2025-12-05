import os

from dotenv import load_dotenv
load_dotenv("../")
import smtplib

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

email_sender = os.getenv("EMAIL_SENDER")
email_password = os.getenv("APP_PASSWORD")
from datetime import datetime
def format_email_message(code):
    year = datetime.now().year
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style type="text/css">
        body {{
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 20px;
          background-color: #f7f7f7;
        }}
        .container {{
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }}
        .header {{
          text-align: center;
          margin-bottom: 30px;
        }}
        .logo {{
          max-width: 150px;
        }}
        .code-box {{
          background: #f5f5f5;
          border: 2px dashed #cccccc;
          padding: 15px;
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 3px;
          color: #333333;
          margin: 20px 0;
          border-radius: 5px;
        }}
        .footer {{
          margin-top: 30px;
          font-size: 12px;
          color: #999999;
          text-align: center;
        }}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://yourwebsite.com/logo.png" alt="Your App Logo" class="logo">
          <h1>Verify Your Email Address</h1>
        </div>
        
        <p>Hello,</p>
        
        <p>Thank you for registering with us. Please use the following verification code to complete your registration:</p>
        
        <div class="code-box">{code}</div>
        
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        
        <div class="footer">
          <p>© {year} Your Company Name. All rights reserved.</p>
          <p>
            <a href="https://yourwebsite.com" style="color: #999999;">Our Website</a> | 
            <a href="https://yourwebsite.com/privacy" style="color: #999999;">Privacy Policy</a>
          </p>
        </div>
      </div>
    </body>
    </html>
    """

# noinspection DuplicatedCode
def verify_email(email_receiver, code):
    subject = "Email Verification"
    body = format_email_message(code)
    message = MIMEMultipart()
    message['From'] = email_sender
    message['To'] = email_receiver
    message['Subject'] = subject
    message.attach(MIMEText(body, 'html'))
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(email_sender, email_password)
            server.sendmail(email_sender, email_receiver, message.as_string())
    except Exception as e:
        print(f"An error occurred while sending the email: {e}")


