'use strict';

const express = require('express');
const dataJson = require("./data.json");
const cors = require('cors');
const axios = require('axios').default;
require('dotenv').config();
const apiKey = process.env.API_KEY;

const app = express();
app.use(cors());
const port = 3000;



app.get("/", handleHomePage);
app.get("/favorite", handleFavoritePage);
app.get("/trending", handleTrending);
app.get("/search", handleSearch);

function handleHomePage(req, res) {
    let newMovie = new Movie(dataJson.title, dataJson.poster_path, dataJson.overview);
    res.json(newMovie);
}


function handleFavoritePage(req, res) {
    res.send("Welcome to Favorite Page");
}

function hendleTrendMovie(req, res) {
    let url = `https://api.themoviedb.org/3/movie/550?apiKey=6f7fea2a73b77fb5ffeb104ba61d85d9&language=en-US?api_key=${apiKey}`;
    axios.get(url)
        .then(result => {
            console.log(result.data.results);
            let Movies = result.data.results.map(movie => {
                return new Movie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview);
            });
            res.json(Movies);
        })
        .catch((error) => {
            console.log(error);
            res.send("Inside catch")
        });
}



function handleSearch(req, res) {
    let movieName = req.query.movieName;
    let url = `https://api.themoviedb.org/3/movie/550?query=${movieName}&language=en-US?api_key=${apiKey}=6f7fea2a73b77fb5ffeb104ba61d85d9`;

    axios.get(url)
        .then(result => {
            res.json(result.data.results);
        })
        .catch((error) => {
            console.log(error);


        })

    let movieName2 = req.query.movieName2;
    let url2 = `https://api.themoviedb.org/3/movie/550?query=${movieName2}&language=en-US?api_key=${apiKey}=6f7fea2a73b77fb5ffeb104ba61d85d9`;
    axios.get(url2)
        .then(result => {
            res.json(result.data.results);
        })
        .catch((error) => {
                console.log(error);
            }


            app.get('/', (req, res) => res.send('500 error'))

            app.use(function (err, req, res, text) {
                res.type('text/plain')
                res.status(500)
                res.send('internal server error 500')

            });


            app.use(function (req, res, text) {
                res.type('text/plain')
                res.status(404)
                res.send('not found')

            });



            app.listen(port, handleListen)

            function handleListen() {
                console.log(`Example app listening on port ${port}`)
            }

            // constrructor for handelhomepage
            function Select(title, poster_path, overview) {
                this.title = title,
                    this.poster_path = poster_path,
                    this.overview = overview
            }


            // constructor for trending
            function Movie(id, title, release_date, poster_path, overview) {
                this.id = id;
                this.title = title;
                this.release_date = release_date;
                this.poster_path = poster_path;
                this.overview = overview;
            }