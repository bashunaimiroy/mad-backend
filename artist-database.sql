DROP DATABASE IF EXISTS mtl_artist_database;
CREATE DATABASE mtl_artist_database;
USE mtl_artist_database;

CREATE TABLE admin (
    admin_id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    first_name VARCHAR(25),
    last_name VARCHAR(35),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE bands (
    band_id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    band_name VARCHAR(100) NOT NULL,
    band_description VARCHAR(1000),
    band_email VARCHAR(100),
    youtube_url VARCHAR(200),
    soundcloud_url VARCHAR(200),
    instagram_url VARCHAR(200),
    bandcamp_url VARCHAR(200),
    facebook_url VARCHAR(200),
    website_url VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE artists (
    artist_id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    first_name VARCHAR(25),
    last_name VARCHAR(35),
    email VARCHAR(100) NOT NULL UNIQUE,
)

CREATE TABLE band_members (
    band_id INT(11) REFERENCES bands (band_id),
    artist_id INT(11) REFERENCES artists (artist_id)
)
