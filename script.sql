CREATE DATABASE trabalho_marlene;

USE trabalho_marlene;

CREATE TABLE user(
    id_user INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(150) NOT NULL,
    xp INT DEFAULT 0,
);

CREATE TABLE quest(
    id_quest INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    texto TEXT NOT NULL,
    image TEXT,
    answer JSON NOT NULL,
    peso INT NOT NULL
);

CREATE TABLE mode_default(
    id_race INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    questions_answered INT DEFAULT 0,
    score INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES User(id)
)

CREATE TABLE Race (
    id_race INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    questions_answered INT DEFAULT 0,
    score INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES User(id)
);