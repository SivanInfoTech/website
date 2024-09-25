from email.encoders import encode_base64
from email.mime.application import MIMEApplication
from email.mime.base import MIMEBase

from flask_mail import Mail, Message
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from datetime import datetime, timedelta
import jwt
from email.message import EmailMessage
from email import encoders


def sendverificationmail(request, VERIFICATION_SECRET_KEY):
    server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    server.ehlo()
    server.login("testsitcloud@gmail.com", "psjycqeeepiefyda")

    sender_email = "testsitcloud@gmail.com"
    receiver_email = request.json["firstName"]
    message = MIMEMultipart()
    message["Subject"] = "Test SIT Registration verification link"
    message["From"] = sender_email
    message["To"] = receiver_email
    token = jwt.encode({
        'email': request.json["email"],
        'exp': datetime.utcnow() + timedelta(minutes=30)
    }, VERIFICATION_SECRET_KEY)
    # convert both parts to MIMEText objects and add them to the MIMEMultipart message
    confirm_url = "https://service.sitcloud.in/verify?token=" + token
    body = """\
            <html>
              <head></head>
              <body>
            Hi """ + request.json['firstName'] + """ """ + request.json['lastName'] + """.<br>
            <p>Welcome! Thanks for signing up.</p>
            <p>Please follow this link to activate your account:</p>
            <p><a href=""" + confirm_url + """ > """ + confirm_url + """</a></p><br><p>Cheers!</p>
              </body>
            </html>
            """
    message.attach(MIMEText(body, 'html'))
    text = message.as_string()
    server.sendmail("testsitcloud@gmail.com", request.json['email'], text)
    server.close()


def sendenquirymail(request):
    server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    server.ehlo()
    server.login("testsitcloud@gmail.com", "psjycqeeepiefyda")

    sender_email = "testsitcloud@gmail.com"
    receiver_email = "testsitcloud@gmail.com"
    message = MIMEMultipart()
    message["Subject"] = "Enquiry request from " + request.json['name']
    message["From"] = sender_email
    message["To"] = receiver_email
    body = """\
                <html>
                  <head></head>
                  <body>
                Hi SitTeam.<br>
                <p>You received an enquiry from """ + request.json['name'] + """.</p>
                <p>Here are the details:</p>
                <b>Name:</b> """ + request.json['name'] + """<br>
                <b>Email:</b> """ + request.json['email'] + """<br>
                <b>Phone:</b> """ + request.json['phone'] + """<br>
                <b>Course:</b> """ + request.json['course'] + """<br>
                <b>Batch:</b> """ + request.json['batch'] + """<br>
                <b>Enquiry:</b> """ + request.json['enquiry'] + """<br>
                  </body>
                </html>
                """
    message.attach(MIMEText(body, 'html'))
    text = message.as_string()
    server.sendmail("testsitcloud@gmail.com", receiver_email, text)
    server.close()


def sendcertmail(request):
    message = MIMEMultipart()
    message['Subject'] = "Attachment Test"
    message['From'] = 'testsitcloud@gmail.com'
    message['To'] = 'avmounika2410@gmail.com'

    text = MIMEText("Message Body")
    message.attach(text)

    directory = "templates/test.pdf"
    with open(directory, "rb") as opened:
        openedfile = opened.read()
    attachedfile = MIMEApplication(openedfile, _subtype = "pdf", _encoder = encode_base64)
    attachedfile.add_header('content-disposition', 'attachment', filename = "ExamplePDF.pdf")
    message.attach(attachedfile)

    server = smtplib.SMTP("smtp.gmail.com:587")
    server.ehlo()
    server.starttls()
    server.login("testsitcloud@gmail.com", "psjycqeeepiefyda")
    server.sendmail(message['From'], message['To'], message.as_string())
    server.quit()