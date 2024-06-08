GRANT ALL PRIVILEGES ON *.* TO 'maxscale_user'@'%';
FLUSH PRIVILEGES;

CREATE DATABASE hotels;
USE hotels;

CREATE TABLE hotels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL
);

INSERT INTO hotels (name, location) VALUES ('Hilton', 'New York');
INSERT INTO hotels (name, location) VALUES ('Marriott', 'San Francisco');
INSERT INTO hotels (name, location) VALUES ('Sheraton', 'Chicago');