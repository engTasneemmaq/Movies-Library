'use strict';

const url = "postgres://tasneem:12345@localhost:5432/movies";
const PORT = 3000;
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
require('dotenv').config();
const apiKey = process.env.API_KEY;

const {
    Client
} = require('pg');
const client = new Client(url);
const app= express();

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.get("/", handleHomePage);
app.get("/favorite", handleFavoritePage);
app.get("/trending", hendleTrendMovie);
app.get("/search", handleSearch);
app.post("/addMovie",handleAddMovies);
app.get("/getMovies",handleGetMovies);
app.use(handleError);

function handleHomePage(req, res) {
    let newMovie = new Movie(dataJson.title, dataJson.poster_path, dataJson.overview);
    res.json(newMovie);
}


function handleFavoritePage(req, res) {
    res.send("Welcome to Favorite Page");
}

function hendleTrendMovie(req, res) {
    let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`;
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
    let url = `https://api.themoviedb.org/3/search/movie?query=${movieName}&api_key=${apiKey}`;
    axios.get(url)
        .then(result => {
            res.json(result.data.results);
        })
        .catch((error) => {
            console.log(error.message);


        })

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
        

            function handleAddMovies(req,res){
                const{title,release_date,poster_path,overview}=req.body;

                let sql=`INSERT INTO movie(title,release_date,poster_path,overview) VALUES($1, $2, $3, $4) RETURNING *;`
                let values=[title,release_date,poster_path,overview];
                client.query(sql,values).then((result)=>{
                    console.log(result.rows);
                    return res.status(201).json(result.rows[0]);
                }).catch((err) => {
                    
                });
                }

                function handleGetMovies(req,res){

                    let sql = 'SELECT * from movie;'
                 client.query(sql).then((result) => {
                     console.log(result);
                     res.json(result.rows);
                 }).catch((err) => {
                     handleError(err, req, res);
                 });
             }

             function handleError(error, req, res) {
                res.status(500).send(error)
            }

            client.connect()
            .then(() => {

                app.listen(PORT, () => {
                    console.log(`Server is listening ${PORT}`);
                });
            })
             

                

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


