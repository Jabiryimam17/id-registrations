import os
from datetime import datetime, timedelta

import shortuuid
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_mysqldb import MySQL
from nanoid import generate

from merkletreeids.RegisterCitizens import VoterRegister
from utilities.send_email import verify_email as verify_user

app = Flask(__name__)
CORS(app)
app.config['MYSQL_HOST'] = os.getenv("DB_HOST")

app.config['MYSQL_PORT'] = int(os.getenv("DB_PORT") or "3306")
app.config['MYSQL_USER'] = os.getenv("DB_USER")
app.config['MYSQL_PASSWORD'] = os.getenv("DB_PASSWORD")
app.config['MYSQL_DB'] = os.getenv("DB_NAME")
MERKLE_PATH = os.getenv("MERKLE_PATH")

mysql = MySQL(app)



@app.route("/register", methods=["POST"])
def register():
    user = request.get_json()
    user_email = user["email"]
    user_phone_number = user["phone_number"]
    cur = mysql.connection.cursor()
    read_query = "SELECT * FROM users WHERE email = %s AND phone_number = %s"
    cur.execute(read_query, (user_email, user_phone_number))

    row = cur.fetchone()
    if row:
        return jsonify({"message": "Email already exists"}), 400
    user_id = generate("123456789", 12)
    email_verification_code = str(shortuuid.random(length=6))
    expiry_time = datetime.now() + timedelta(minutes=5)
    insert_query = "INSERT INTO users (name,phone_number,email,birth_place,age,sex, ID, email_verification_code, email_code_expire) VALUES (%s, %s, %s, %s,%s, %s,%s,%s,%s)"
    values = (user["name"], user_phone_number, user_email, user["birth_place"], user["age"], user["sex"], user_id,
              email_verification_code, expiry_time)
    try:
        cur.execute(insert_query, values)
        mysql.connection.commit()
        verify_user(user_email, email_verification_code)
        return jsonify({"message": "User registered successfully And Verify Your Email", "user": user}), 201
    except Exception as e:
        print(e)
        mysql.connection.rollback()
        return jsonify({"message": "An error occurred while registering the user"}), 500
    finally:
        cur.close()


@app.route("/verify_email", methods=["POST"])
def verify_email():
    data = request.get_json()
    code = data["code"]
    email = data["email"]
    cur = mysql.connection.cursor()
    read_query = "SELECT * FROM users WHERE email = %s AND email_verification_code = %s AND email_code_expire > NOW()"
    cur.execute(read_query, (email, code))
    row = cur.fetchone()
    if row:
        official_id = row[0]
        person_data = add_id_tree(int(official_id))
        update_query = "UPDATE users SET verified = %s WHERE email = %s"
        values = (True, email)
        cur.execute(update_query, values)
        mysql.connection.commit()
        cur.close()
        person_data["sid"] = str(person_data["sid"])
        person_data["nullifier"] = str(person_data["nullifier"])
        return jsonify({"message": "Email verified successfully", "verified": True, "secrets": person_data,
                        "official_id": official_id}), 200
    cur.close()
    return jsonify({"message": "Invalid verification code", "verified": False}), 400

def add_id_tree(official_id):
    id_tree = VoterRegister(MERKLE_PATH)
    data = id_tree.register_voter(official_id)
    id_tree.merkle_tree.close()
    return data


@app.route("/save_secrets", methods=["POST"])
def save_secrets():
    data = request.get_json()
    official_id = data["official_id"]
    encrypted_data = data["encrypted_data"]
    iv = data["iv"]
    salt = data["salt"]
    cur = mysql.connection.cursor()
    read_query = "SELECT * FROM secrets WHERE id = %s"
    cur.execute(read_query, (official_id,))
    row = cur.fetchone()
    if not row:
        update_query = "INSERT INTO secrets (id, secret, iv, salt) VALUES (%s, %s, %s, %s)"
        values = (official_id, encrypted_data, iv, salt)
        cur.execute(update_query, values)
        mysql.connection.commit()
        cur.close()
        return jsonify({"message": "Secrets saved successfully"}), 201
    else:
        return jsonify({"message": "Secrets already exist for this ID"}), 400


@app.route("/send_verification_code", methods=["POST"])
def send_verification_code():
    code = shortuuid.random(length=6)
    data = request.get_json()
    email = data["email"]
    cur = mysql.connection.cursor()
    read_query = "SELECT * FROM users WHERE email = %s"
    cur.execute(read_query, (email,))
    user_row = cur.fetchone()
    if not user_row: return jsonify({"message": "Invalid email"}), 400
    verify_user(email, code)
    expiry_time = datetime.now() + timedelta(minutes=5)
    update_query = "UPDATE users SET email_verification_code = %s, email_code_expire = %s WHERE email = %s"
    cur.execute(update_query, (code, expiry_time, email))
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "Verification code sent successfully"}), 200


@app.route("/verify_match", methods=["POST"])
def verify_match():
    data = request.get_json()
    user_email = data["email"]
    user_national_id = data["national_id"]
    cur = mysql.connection.cursor()
    read_query = "SELECT * FROM users WHERE email = %s AND ID = %s AND verified = %s"
    values = (user_email, user_national_id, True)
    cur.execute(read_query, values)
    row = cur.fetchone()
    cur.close()
    if row:
        return jsonify({"message": "User verified successfully", "are_matched": True}), 200
    else:
        return jsonify({"message": "User not verified", "are_matched": False}), 400


@app.route("/voter_info", methods=["GET"])
def voter_info():
    national_id = request.args.get("id")
    cur = mysql.connection.cursor()

    # secrets
    read_query = "SELECT * FROM secrets WHERE id = %s"
    cur.execute(read_query, (national_id,))
    secrets = cur.fetchone()
    cur.close()
    if not secrets: return {"message": "Your ID hasn't been found!"}, 400

    # merkle path
    id_tree = VoterRegister(MERKLE_PATH)
    merkle_path = id_tree.generate_path(int(national_id))
    id_tree.merkle_tree.close()
    return {"merkle_path":merkle_path, "secret":secrets}, 200



@app.route("/merkle_root", methods=["GET"])
def merkle_root():
    id_tree = VoterRegister(MERKLE_PATH)
    return {"merkle_root":id_tree.merkle_tree.db.get(b'root').hex()}, 200

@app.route("/add_party", methods=["POST"])
def add_party():
    party = request.get_json()
    party_name = party["party_name"]
    party_short_name = party["party_short_name"]
    party_leader_email = party["email"]
    party_leader_id = party['national_id']
    party_id = generate("123456789abcdefghijklmnopqrstuvwxyz", 26)
    cur = mysql.connection.cursor()
    create_query = "INSERT INTO parties (ID, party_name, leader_email, leader_ID, short_name) VALUES (%s, %s, %s, %s, %s)"
    cur.execute(create_query, (party_id, party_name, party_leader_email, party_leader_id, party_short_name))
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "Party added successfully"}), 201


@app.route("/is_party_exist", methods=["GET"])
def is_party_exist():
    party_id = request.args.get("party_id")
    cur = mysql.connection.cursor()
    read_query = "SELECT * FROM parties WHERE ID = %s"
    values = (party_id,)
    cur.execute(read_query, values)
    row = cur.fetchone()
    if row:
        return jsonify({"message": "Party is found", "party_exist": True}), 200
    return jsonify({"message": "Party is not found", "party_exist": False}), 400


@app.route("/verify_party", methods=["POST"])
def verify_party():
    party = request.get_json()
    party_name = party["party_name"]
    party_leader_email = party["email"]
    party_leader_id = party["national_id"]

    cur = mysql.connection.cursor()
    read_query = "SELECT * FROM parties WHERE party_name = %s AND leader_email = %s AND leader_ID = %s"
    values = (party_name, party_leader_email, party_leader_id)
    cur.execute(read_query, values)
    row = cur.fetchone()
    cur.close()
    if row:
        return jsonify({"message": "Party is found", "party_exist": True, "id": row[0], "SN": row[4]}), 200
    return jsonify({"message": "Party is not found", "party_exist": False}), 400


if __name__ == "__main__":
    app.run(debug=True, port=5000)
    mysql.connection.close()
