from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

db_config = {
    'user': 'maxscale_user',
    'password': '12345678',
    'host': 'localhost',
    'port': 4006,
    'database': 'hotels'

}


def get_db_connection():
    return mysql.connector.connect(**db_config)


@app.route('/hotels', methods=['GET'])
def get_hotels():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM hotels')
    hotels = cursor.fetchall()
    connection.close()
    return jsonify(hotels), 200


@app.route('/hotels', methods=['POST'])
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


if __name__ == '__main__':
    print(get_db_connection())
    app.run(debug=True)
