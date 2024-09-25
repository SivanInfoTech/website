import base64
import json
from io import BytesIO
from pydoc import html
import os
from flask import Flask, request, jsonify, Response, render_template, make_response, redirect
from flask_pymongo import PyMongo
import bcrypt
from functools import wraps
import jwt
from datetime import datetime, timedelta
from flask_cors import CORS, cross_origin
from mail import sendverificationmail, sendenquirymail, sendcertmail
from datetime import date
import random
import jinja2
import requests
import pytz
from xhtml2pdf import pisa             # import python module
import time
from phonepe.sdk.pg.payments.v1.payment_client import PhonePePaymentClient
from phonepe.sdk.pg.payments.v1.models.request.pg_pay_request import PgPayRequest
import uuid
from phonepe.sdk.pg.env import Env

frontendURL = "https://sitcloud.in"
backendURL = "https://sitcloud.in:8082"
# import ironpdf

tz_NY = pytz.timezone('Asia/Kolkata')

# Phonepe SDK Keys
merchant_id = "M22UNOC34DDKV"  
salt_key = "9517e9ee-c009-4aad-9400-dd693ccd0ac1"  
salt_index = 1 
env = Env.PROD # Change to Env.PROD when you go live
phonepe_client = PhonePePaymentClient(merchant_id=merchant_id, salt_key=salt_key, salt_index=salt_index, env=env)


# from weasyprint import HTML
import pdfkit
app = Flask(__name__)
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = "SIT_Secret_key"
app.config['VERIFICATION_SECRET_KEY'] = "VERIFICATION_Secret_KEY"
# app.config["MONGO_URI"] = "mongodb://situser:sitadmin@localhost:27017/admin"
app.config["MONGO_URI"] = "mongodb://situser:sitadmin@mongo:27017/admin"
# Set up MongoDB connection and collection
#client = MongoClient('mongodb://situser:sitadmin@localhost:27017/admin')
# Create database named demo if they don't exist already
#db = client['admin']
mongo = PyMongo(app)
cors = CORS(app)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # jwt is passed in the request header
        if 'Authorization' in request.headers:
            bearer = request.headers.get('Authorization')
            token = bearer.split()[1]
        # return 401 if token is not passed
        if not token:
            return Response(json.dumps({"Message": "Missing token !!!", "status": 400}), status=400)

        try:
            # decoding the payload to fetch the stored details
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            users = mongo.db.users
            current_user = users.find_one({'email': data['email']}, {'_id': False, 'password': False})
            if token == current_user["loginToken"]:
                current_user['currenttoken'] = token
                # print(current_user)
            else:
                return Response(json.dumps({"Message": "Authorization failed. Please, try to login again", "status": 401}), status=401)
        except Exception as e:
            print(e)
            return Response(json.dumps({"Message": "Authorization failed. Please, try to login again", "status": 401}), status=401)
        return f(current_user, *args, **kwargs)

    return decorated


@app.route("/signup", methods=['POST'])
@cross_origin()
def signup():
    print(request.json)
    users = mongo.db.users
    user = users.find_one({'email': request.json['email'].lower()})
    if user:
        return Response(json.dumps({"Message": "EmailID/User already exists, Please try to login", "status": 409}),
                        status=409)

    hashed = bcrypt.hashpw(request.json['password'].encode('utf8'), bcrypt.gensalt())
    sendverificationmail(request, app.config['VERIFICATION_SECRET_KEY'])
    users.insert_one({'firstName': request.json['firstName'],
                      'lastName': request.json['lastName'],
                      'password': hashed,
                      'email': request.json['email'],
                      'role': 'STUDENT',
                      'phone': request.json['phone'],
                      'verified': False,
                      'isFromCollege': request.json['isfromcollege'],
                      'collegeName': request.json['collagename'],
                      "registered_on": str(datetime.now(tz_NY))})

    return Response(json.dumps({"Message": "Please check your mail for Verification link", "status": 200}), status=200)


@app.route('/signin', methods=['POST'])
@cross_origin()
def signin():
    print(request.json)
    users = mongo.db.users
    signin_user = users.find_one({'email': request.json['email'].lower()}, {'_id': False})
    if not signin_user:
        return Response(json.dumps(
            {"Message": "Please Signup to login", "status": 401}),
                        status=401)
    if signin_user:
        if not signin_user['verified']:
            return Response(json.dumps({"Message": "User not yet verified, Please check your mail for verification link", "status": 401}), status=401)
        if bcrypt.checkpw(request.json['password'].encode('utf8'), signin_user["password"]):
            token = jwt.encode({
                'email': signin_user["email"],
                'firstName': signin_user["firstName"],
                'lastName': signin_user["lastName"],
                'exp': datetime.utcnow() + timedelta(minutes=30),
                'role': signin_user["role"],
                'verified': signin_user['verified']
            }, app.config['SECRET_KEY'])

            users.update_one({'email': signin_user['email']},  {"$set": {'loginToken': token}})
            return Response(json.dumps({"Message": "Logged in successfully", "token": token, "status": 200}),
                            status=200)

        return Response(json.dumps({"Message": "Password is wrong, Please try again", "status": 400}), status=400)
    return Response(json.dumps({"Message": "User not exits", "status": 400}), status=400)


@app.route('/studentsList', methods=['GET'])
@cross_origin()
@token_required
def studentsList(currentuser):
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "User is not Authorized to get this data", "status": 401}), status=401)

    users = mongo.db.users
    users = users.find({'role': 'STUDENT'}, {'_id': False, 'password': False, 'registered_on': False})
    res = list(users)
    return Response(json.dumps({"Message": "Users fetched", 'user': res, "status": 200}), status=200)


@app.route('/verify', methods=['GET'])
@cross_origin()
def verify_email():
    print(request.args["token"])
    data = jwt.decode(request.args["token"], app.config["VERIFICATION_SECRET_KEY"], algorithms=['HS256'])

    users = mongo.db.users
    user = users.find_one({'email': data["email"]}, {'_id': False})
    if not user:
        return Response(json.dumps({"Message": "User not exits", "status": 400}), status=400)
    print(user)
    user = users.update_one({'email': data["email"]}, {"$set": {"verified": True}})
    return Response("Verified, Please try to login", status=200)


@app.route('/getToken', methods=['GET'])
@cross_origin()
@token_required
def getToken(currentuser):
    users = mongo.db.users
    signin_user = users.find_one({'email': currentuser['email']}, {'_id': False, 'password': False})
    print(signin_user)
    if signin_user:
        if currentuser['currenttoken'] == signin_user["loginToken"]:
            newtoken = jwt.encode({
                'email': signin_user["email"],
                'firstName': signin_user["firstName"],
                'lastName': signin_user["lastName"],
                'exp': datetime.utcnow() + timedelta(minutes=30),
                'role': signin_user["role"],
                'verified': signin_user['verified']
            }, app.config['SECRET_KEY'])
            users.update_one({'email': signin_user['email']},  {"$set": {'loginToken': newtoken}})
            res = {"Message": "token generated in successfully", "token": newtoken,  "status": 200}
            print(res)
            return Response(json.dumps(res),
                            status=200)

        return Response(json.dumps({"Message": "Authorization failed. Please, try to login again", "status": 400}), status=400)
    return Response(json.dumps({"Message": "User not exits", "status": 400}), status=400)


@app.route('/logOut', methods=['GET'])
@cross_origin()
@token_required
def logout(currentuser):
    users = mongo.db.users
    signin_user = users.find_one({'email': currentuser['email']}, {'_id': False, 'password': False})
    users.update_one({'email': signin_user['email']}, {"$set": {'loginToken': ''}})
    return Response(json.dumps({"Message": "Logged out successfully", "status": 200}), status=200)


@app.route('/enroll', methods=['POST'])
@cross_origin()
@token_required
def enroll(currentuser):
    courseid = request.json['courseid']
    courseshortform = request.json['courseshortform']
    coursetitle = request.json['coursetitle']
    batchdetails = request.json['batchtoenroll']
    uid = ''.join(random.choice('0123456789ABCDEF') for i in range(5))
    enrollmentID = 'EID' + date.today().strftime('%Y%m%d')+uid
    enrollment = {
        'enrollmentID': enrollmentID,
        'courseID': courseid,
        'courseShortForm': courseshortform,
        'courseTitle': coursetitle,
        'enrolledDate': str(datetime.utcnow()),
        'enrollmentStatus': 'Waiting for Approval',
        'certificationID': None,
        'batchDetails': batchdetails
    }
    users = mongo.db.users
    signin_user = users.find_one({'email': currentuser['email']}, {'_id': False, 'password': False})
    users.update_one({'email': signin_user['email']}, {'$push': {'enrollments': enrollment}})
    return Response(json.dumps({"Message": "Enrolled successfully", 'EnrollmentID': enrollmentID, "status": 200}), status=200)


@app.route('/enrollmentsList', methods=['GET'])
@cross_origin()
@token_required
def enrollments(currentuser):
    userid = request.args.get('userid')
    if not userid:
        userid = currentuser['email']
    if userid != currentuser['email'] and currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "You are not authorized to get this data", "status": 401}),
                        status=401)
    users = mongo.db.users
    userdata = users.find_one({'email': userid}, {'_id': False, 'password': False})
    return Response(json.dumps({"Message": "Fetched enrollments successfully", 'user': userdata, "status": 200}), status=200)


@app.route('/updateEnrollment', methods=['POST'])
@cross_origin()
@token_required
def updateEnrollment(currentuser):
    enrollmentID = request.json['enrollmentID']

    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "You are not authorized to get this data", "status": 401}),
                        status=401)
    users = mongo.db.users
    if request.json['status'] == 'Certified':
        courseShortForm = request.json['courseShortForm']
        uid = ''.join(random.choice('0123456789ABCDEF') for i in range(5))
        certificationID = 'SIT' + date.today().strftime('%Y%m%d') + uid + courseShortForm
        update = {'$set': {"enrollments.$.enrollmentStatus": request.json['status'],
                           "enrollments.$.certificationID": certificationID,
                           "enrollments.$.certifiedOn": str(datetime.now(tz_NY))}}
    else:
        update = {'$set': {"enrollments.$.enrollmentStatus": request.json['status']}}
    userdata = users.update_one({
        'email': request.json['userid'],
        'enrollments': {
            '$elemMatch': {
                'enrollmentID': enrollmentID
            }
        }}, update)
    return Response(json.dumps({"Message": "Enrollment updated successfully", "status": 200}), status=200)


@app.route('/enquiry', methods=['POST'])
@cross_origin()
def submitEnquiry():
    print(request.json)
    sendenquirymail(request)
    return Response(json.dumps({"Message": "Enquiry submitted, Team will contact you soon", "status": 200}), status=200)


@app.route('/courseDetails', methods=['GET'])
@cross_origin()
def getCourseContent():
    courses = mongo.db.courses
    courseContent = courses.find_one({'courseid': request.args.get('courseid')}, {'_id': False})
    return Response(json.dumps({"Message": "Fetched content", "details": courseContent, "status": 200}), status=200)


@app.route('/courselist', methods=['GET'])
@cross_origin()
@token_required
def getCourseList(currentuser):
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "You are not authorized to get this data", "status": 401}),
                        status=401)
    courses = mongo.db.courses
    courselist = courses.find({}, {'_id': False})
    res = list(courselist)
    return Response(json.dumps({"Message": "Fetched content", "courses": res, "status": 200}), status=200)


@app.route('/getcourseDoc', methods=['GET'])
@cross_origin()
@token_required
def getCourseDocument(currentuser):
    studentdownload = False
    print(request.args)
    courseid = request.args.get('courseid')
    for enroll in currentuser['enrollments']:
        if enroll['courseID'] == courseid and enroll['enrollmentStatus'] == "Approved" or enroll['enrollmentStatus'] == "Certified":
            studentdownload = True
        else:
            studentdownload = False
    if currentuser['role'] != 'ADMIN' and not studentdownload:
        return Response(json.dumps({"Message": "You are not authorized to get this data", "status": 401}),
                        status=401)

    coursedoc = mongo.db.coursedoc
    courseContent = coursedoc.find_one({'courseid': request.args.get('courseid')}, {'_id': False})
    print(type(courseContent['syllabus']))
    image = base64.b64encode(courseContent['syllabus'])
    return Response(json.dumps({
        "Message": "Fetched course document",
        "details": image.decode(),
        "courseid": courseContent['courseid'],
        "status": 200}), status=200)


@app.route('/uploadcourseDoc', methods=['POST'])
@cross_origin()
@token_required
def uploadCourseDocument(currentuser):
    coursedoc = mongo.db.coursedoc
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "You are not authorized to get this data", "status": 401}),
                        status=401)
    input_file = request.files["syllabus"].read()

    course = coursedoc.find_one({'courseid': request.form['courseid']}, {'_id': False, 'syllabus': False})
    if course:
        coursedoc.update_one({
            'courseid': request.form['courseid']},
            {"$set": {'syllabus': input_file, "uploaded_on": str(datetime.now(tz_NY))}}
        )
    else:
        coursedoc.insert_one({"courseid": request.form['courseid'], 'syllabus': input_file, "uploaded_on": str(datetime.now(tz_NY))})
    return Response(json.dumps({"Message": "Course document Uploaded", "status": 200}), status=200)


@app.route('/saveads', methods=['POST'])
@cross_origin()
@token_required
def saveFlashAds(currentuser):
    ads = mongo.db.ads
    if currentuser['role'] != 'ADMIN':
        return Response(json.dumps({"Message": "You are not authorized to get this data", "status": 401}),
                        status=401)
    obj = {"flashadslist": request.json['flashadslist'],
                    "adsType": request.json['adsType'],  # Banner or Flash add
                    "uploaded_on": str(datetime.now(tz_NY))}
    dbflashad = ads.find_one({"adsType": "flashadd"}, {})
    if not dbflashad:
        ads.insert_one(obj)
    else:
        ads.update_one({"adsType": "flashadd"}, {"$set": obj})
    return Response(json.dumps({"Message": "Ads Saved Successfully", "status": 200}), status=200)


@app.route('/getflashads', methods=['GET'])
@cross_origin()
def getFlashAds():
    ads = mongo.db.ads
    data = ads.find({"adsType": "flashadd"}, {'_id': False})
    res = list(data)
    return Response(json.dumps({"Message": "Fetched content", "details": res[0], "status": 200}), status=200)


@app.route('/verifyCert', methods=['POST'])
@cross_origin()
def verifyCert():
    print(request)
    users = mongo.db.users
    userdata = users.find_one({
        'enrollments': {
            '$elemMatch': {
                'enrollmentID': request.json['enrollmentID'],
                'certificationID': request.json['certificateID']
            }
        }})
    enrollData = None
    if userdata and userdata['enrollments']:
        for enrollment in userdata['enrollments']:
            if enrollment['enrollmentID'] == request.json['enrollmentID'] and\
                    enrollment['certificationID'] == request.json['certificateID']:
                enrollData = enrollment

    if enrollData:
        res = {
            "Message": "Verification Successful", "status": 200,
            'userName': userdata['firstName'] + userdata['lastName'],
            'enrollmentDetails': enrollData
        }
    else:
        res = {
            "Message": "Verification Failed !!! Please recheck the Enrollment & Certificate details", "status": 400,
        }
    return Response(json.dumps(res), status=res['status'])


@app.route('/downloadCertificate', methods=['GET'])
@cross_origin()
# @token_required
def downloadCertificate():
    print(f"Download Cert triggered")

    print(request)
    certificationID = request.args["certificationID"]
    email = request.args["userid"]
    certdata = None
    users = mongo.db.users
    userdata = users.find_one({'email': email}, {'_id': False})

    for enrollment in userdata['enrollments']:
        print(enrollment['certificationID'])
        if enrollment['certificationID'] == certificationID:
            certdata = enrollment
    cr_year = certdata['certifiedOn'][0:4]
    cr_month = certdata['certifiedOn'][5:7]
    cr_date = certdata['certifiedOn'][8:10]
    certdate = str(cr_month) + '/' + str(cr_date) + '/'+str(cr_year)
    print(certdate)
    cert_duration_startdate = certdata['batchDetails']['startdate']
    cert_duration_enddate = certdata['batchDetails']['enddate']
    template_loader = jinja2.FileSystemLoader(searchpath="./templates")
    template_env = jinja2.Environment(loader=template_loader)
    template_file = ''
    collegeName = ''
    if userdata['isFromCollege'] is True or userdata['isFromCollege'] == "true":
        print(f"User is from College")
        template_file = "CollegeCert.html"
        collegeName = userdata['collegeName']
    elif userdata['isFromCollege'] is False or userdata['isFromCollege'] == 'false':
        print(f"User is an Intern")
        template_file = "InternCert.html"
    template = template_env.get_template(template_file)
    output_text = template.render(
        name=userdata['firstName']+userdata['lastName'],
        date=certdate,
        certificationID=certificationID,
        courseTitle=certdata['courseTitle'],
        enrollmentID=certdata['enrollmentID'],
        isFromCollege=userdata['isFromCollege'],
        collegeName=collegeName,
        durationStartdate=cert_duration_startdate,
        durationEnddate=cert_duration_enddate
    )

    html_path = f'templates/finalCert.html'
    html_file = open(html_path, 'w')
    html_file.write(output_text)
    html_file.close()
    print(f"Now converting index2 ... ")
    return render_template("finalCert.html")


@app.route('/emailCert', methods=['POST'])
@cross_origin()
def emailCert():
    certificationID = request.json["certificationID"]
    email = request.json["userid"]
    # response = requests.get("http://127.0.0.1:5000/downloadCertificate", params={
    #     'userid': email, 'certificationID': certificationID
    # })
    # time.sleep(5)
    output_filename = 'templates/test.pdf'
    # with open('templates/finalCert.html', 'r', encoding='utf-8') as file:
    #     fdata = file.readlines()
    # cssd = open("static/styles/CollegeCert.css", 'r')
    # data = cssd.read()
    # cssd.close()
    #
    # fdata[3] = '<style type="text/css">' + data + "</style>"
    #
    # with open('templates/tempCert.html', 'w', encoding='utf-8') as file:
    #     file.writelines(fdata)
    # time.sleep(5)
    # result_file = open(output_filename, "w+b")
    # emailcert = open("templates/tempCert.html", 'r')
    # emailcertdata = emailcert.read()
    # emailcert.close()
    # time.sleep(5)
    # pisa_status = pisa.CreatePDF(
    #     emailcertdata,  # the HTML to convert
    #     dest=result_file)  # file handle to recieve result
    #
    # # close output file
    # result_file.close()  # close output file
    # pdf = pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")), result)
    #config = pdfkit.configuration(wkhtmltopdf="/usr/bin/wkhtmltopdf")
    #print(email,certificationID)
    # pdfkit.from_url("https://service.sitcloud.in/downloadCertificate?userid=" + email + "&certificationID=" + certificationID, 'templates/test.pdf', configuration=config)
    config = pdfkit.configuration(wkhtmltopdf="/usr/bin/wkhtmltopdf") 
    response = requests.get("https://service.sitcloud.in/downloadCertificate", params={'userid': email, 'certificationID': certificationID})
    html_path = f'templates/tempCert.html'
    html_file = open(html_path, 'w')
    html_file.write(response.text)
    html_file.close()
    cssd = open("static/styles/CollegeCert.css", 'r')
    cssdata = cssd.read()
    cssd.close()
    time.sleep(5)
    with open('templates/tempCert.html', 'r', encoding='utf-8') as file:
        certemaildata = file.readlines()
    certemaildata[3] = '<style type="text/css">' + cssdata + "</style>"
    with open('templates/tempCert.html', 'w', encoding='utf-8') as file:
        file.writelines(certemaildata)
    emailcert = open("templates/tempCert.html", 'r')
    emailcertdata = emailcert.read()
    pdfkit.from_string(emailcertdata, 'templates/test.pdf', configuration=config)
    #sendcertmail(request)
    time.sleep(5)
    sendcertmail(request)
    return "AB"


@app.route('/getCourseAndBatchDetails', methods=['GET'])
@cross_origin()
def getCourseAndBatchDetails():
    courses = mongo.db.courses
    data = courses.find({}, {'_id': False, 'courseid': True, 'batches': True})
    res = list(data)
    return Response(json.dumps({"Message": "Data fetched", 'details': res, "status": 200}), status=200)


# Phonepe Payment Intergration

@app.route('/initiate-payment', methods=['POST'])
@cross_origin()
def initiate_payment_get():
    unique_transaction_id = str(uuid.uuid4())[:-2]
    ui_redirect_url = f"https://${backendURL}/frontendredirect/{unique_transaction_id}"  
    s2s_callback_url = f"https://${frontendURL}/paymentstatus"
    amount = request.json.get('amount')  
    user_id = request.json.get('user_id')

    pay_page_request = PgPayRequest.pay_page_pay_request_builder(
        merchant_transaction_id=unique_transaction_id, 
        amount=amount*100,
        merchant_user_id=user_id,
        callback_url=s2s_callback_url,
        redirect_url=ui_redirect_url
        )  
    
    pay_page_response = phonepe_client.pay(pay_page_request)  
    pay_page_url = pay_page_response.data.instrument_response.redirect_info.url 
    

    return jsonify({'pay_page_url': pay_page_url}), 200

    
@app.route('/callback/<transaction_id>', methods=['GET'])
@cross_origin()
def check_payment_status(transaction_id):
    # frontend_url = f'http://localhost:4200/callback/{transaction_id}'
    
    pay_page_response = phonepe_client.check_status(transaction_id)
    print(pay_page_response)
    print("Success:", pay_page_response.success)
    print("Code:", pay_page_response.code)
    print("Message:", pay_page_response.message)
    print("Merchant ID:", pay_page_response.data.merchant_id)
    print("Merchant Transaction ID:", pay_page_response.data.merchant_transaction_id)
    print("Transaction ID:", pay_page_response.data.transaction_id)
    print("Amount:", pay_page_response.data.amount / 100)
    print("Response Code:", pay_page_response.data.response_code)
    print("State:", pay_page_response.data.state)
    print("Payment Instrument Type:", pay_page_response.data.payment_instrument.type)
    print("PG Transaction ID:", pay_page_response.data.payment_instrument.pg_transaction_id)
    print("PG Service Transaction ID:", pay_page_response.data.payment_instrument.pg_service_transaction_id)
    print("Bank Transaction ID:", pay_page_response.data.payment_instrument.bank_transaction_id)
    print("Bank ID:", pay_page_response.data.payment_instrument.bank_id)

    # return redirect(frontend_url)
    return jsonify(pay_page_response)

@app.route('/frontendredirect/<transaction_id>', methods=['GET'])
@cross_origin()
def redirecturl(transaction_id):
    # frontend_url = f'http://localhost:4200/paymentstatus/{transaction_id}'
    frontend_url = f'${frontendURL}/paymentstatus/{transaction_id}'
    return redirect(frontend_url)


if __name__ == '__main__':
    app.run(host='0.0.0.0')
