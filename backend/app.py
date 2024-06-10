from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from keycloak import KeycloakOpenID, KeycloakGetError
from functools import wraps
import os

app = Flask(__name__)
CORS(app)

db_config = {
    'user': os.getenv('DB_USER', 'maxscale_user'),
    'password': os.getenv('DB_PASSWORD', '12345678'),
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '4006'),
    'database': os.getenv('DB_NAME', 'hotels')
}

keycloak_openid = KeycloakOpenID(
    server_url=os.getenv('KEYCLOAK_SERVER_URL', "http://localhost:8080/"),
    client_id=os.getenv('KEYCLOAK_CLIENT_ID', "app-client"),
    realm_name=os.getenv('KEYCLOAK_REALM_NAME', "vot"),
)

print(keycloak_openid)
print(keycloak_openid.well_known())


def get_db_connection():
    return mysql.connector.connect(**db_config)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'Authorization' not in request.headers:
            return jsonify({'message': 'Token is missing!'}), 401
        token = request.headers['Authorization'].split()[1]
        print(token)
        try:
            keycloak_openid.userinfo(token)
        except KeycloakGetError as e:
            if e.response_code == 401:
                if 'refresh_token' in request.headers:
                    refresh_token = request.headers['refresh_token']
                    try:
                        new_token = keycloak_openid.refresh_token(
                            refresh_token)
                        token = new_token['access_token']
                        request.headers['Authorization'] = f'Bearer {token}'
                        request.headers['refresh_token'] = new_token['refresh_token']
                        keycloak_openid.userinfo(token)
                    except Exception as refresh_e:
                        print(refresh_e)
                        return jsonify({'message': 'Token refresh failed!'}), 401
                else:
                    return jsonify({'message': 'Refresh token is missing!'}), 401
            else:
                print(e)
                return jsonify({'message': 'Token is invalid!'}), 401
        return f(*args, **kwargs)
    return decorated


@app.route('/hotels', methods=['GET'])
@token_required
def get_hotels():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM hotels')
    hotels = cursor.fetchall()
    connection.close()
    return jsonify(hotels), 200


@app.route('/hotels', methods=['POST'])
@token_required
def add_hotel():
    new_hotel = request.json
    name = new_hotel['name']
    location = new_hotel['location']

    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(
        'INSERT INTO hotels (name, location) VALUES (%s, %s)', (name, location))
    connection.commit()
    connection.close()

    return jsonify({'message': 'Hotel added successfully!'}), 201


@app.route('/', methods=['GET'])
def home():
    print(keycloak_openid)
    return jsonify({'message': 'Hello World!'}), 200


if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_ENV') == 'development')
