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
    band_genre VARCHAR(100),
    music_link VARCHAR(100),
    apple_music_url VARCHAR(100),
    spotify_url VARCHAR(100),
    facebook_url VARCHAR(200),
    instagram_url VARCHAR(200),
    twitter_url VARCHAR(200),
	youtube_url VARCHAR(200),
    photo_url VARCHAR(200),
	band_email VARCHAR(100),
    management_email VARCHAR(100),
    booking_email VARCHAR(100),
    pr_email VARCHAR(100),
    members VARCHAR(500),
    band_description VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE artists (
    artist_id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    first_name VARCHAR(25),
    last_name VARCHAR(35),
    email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE band_members (
    band_id INT(11) REFERENCES bands (band_id),
    artist_id INT(11) REFERENCES artists (artist_id)
)
