from flask import Flask, request
from flask_mail import Mail, Message
import os

app = Flask(__name__)

# تنظیمات Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # سرور SMTP (برای جیمیل)
app.config['MAIL_PORT'] = 587  # پورت SMTP
app.config['MAIL_USE_TLS'] = True  # استفاده از TLS
app.config['MAIL_USERNAME'] = "arashmg1382@gmail.com"  # ایمیل فرستنده
app.config['MAIL_PASSWORD'] = "09169640564"  # رمز عبور ایمیل فرستنده

mail = Mail(app)

def send_mail(subject: str, sender: str, receivers: list, body: str) -> str:
    """
    این تابع یک ایمیل ارسال می‌کند.
    
    :param subject: موضوع ایمیل
    :param sender: آدرس ایمیل فرستنده
    :param receivers: لیست آدرس‌های ایمیل گیرندگان
    :param body: متن ایمیل
    :return: نتیجه ارسال ایمیل
    """
    try:
        msg = Message(
            subject=subject,
            sender=sender,
            recipients=receivers
        )
        msg.body = body
        mail.send(msg)
        return 'Email sent successfully!'
    except Exception as e:
        return f'Failed to send email: {str(e)}'

@app.route('/send-email', methods=['GET'])
def send_email():
    # دریافت پارامترهای مورد نیاز از URL
    subject = request.args.get('subject', 'Test Email')  # موضوع ایمیل (پیش‌فرض: Test Email)
    sender = request.args.get('sender', 'arashmg1382@gmail.com')  # فرستنده (پیش‌فرض: ایمیل شما)
    receiver = request.args.get('receiver')  # گیرنده (اجباری)
    body = request.args.get('body', 'This is a test email sent from Flask.')  # متن ایمیل (پیش‌فرض: متن تست)

    # بررسی اینکه گیرنده مشخص شده است
    if not receiver:
        return 'Error: Receiver email is required.', 400

    # ارسال ایمیل
    result = send_mail(subject, sender, [receiver], body)
    return result

if __name__ == '__main__':
    app.run(debug=True)