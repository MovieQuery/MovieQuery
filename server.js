'use strict';

const pg = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const PORT = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;
const conString = process.env.DATABASE_URL;

const client = new pg.Client(conString);
client.connect();
client.on('error', err => console.error(err));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));


app.listen(PORT, function() {
  console.log(`Server started on ${PORT}`);
});

function loadDB() {
  client.query(`
    CREATE TABLE IF NOT EXISTS
    movies (
      movie_id SERIAL PRIMARY KEY,
      title VARCHAR(255) UNIQUE NOT NULL,
      release_date DATE,
      synopsis TEXT NOT NULL,
      poster_url VARCHAR(255)
    );`
  )
  .then(loadMovies)
  .catch(console.error);

  client.query(`
    CREATE TABLE IF NOT EXISTS
    users (
      user_id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      movie_id INTEGER NOT NULL REFERENCES movies(movie_id)
    );`
  )
  .then(loadMovies)
  .catch(console.error);
}
