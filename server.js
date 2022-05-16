'use strict';
require('dotenv').config();
const url = "postgres://tasneem:12345@localhost:5432/movies";
const PORT = process.env.PORT;
const dataJson = require("./data.json");
const express = require('express');
const cors = require('cors');
const axios = require('axios').default;
const bodyParser = require('body-parser');
const {
    Client
} = require('pg');
// const client = new Client(URL);
const pg = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

//const pg=require('pg');
//const client=new pg.Client(URL);
const apiKey = process.env.API_KEY;
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.get("/", handleHomePage);
app.get("/favorite", handleFavorite);
app.get("/trending", handleTrending);
app.get("/search", handleSearch);
app.post("/addMovie", handleAddMovies);
app.get("/getMovies", handleGetMovies);
app.get("/getMovie/:id", handleGetMovieByID);
app.put("/UPDATE/:id", handleUpdateMovie);
app.delete("/DELETE/:id", handleDeleteMovie)
app.use("*", handleNotFound);
app.use(handleError);

function handleHomePage(req, res) {
    let newMovie = new Movie(dataJson.title, dataJson.poster_path, dataJson.overview, dataJson.comment);
    res.json(newMovie);
}

function handleFavorite(req, res) {
    res.send("Welcome to Favorite Page");
}

function handleTrending(req, res) {
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


function handleNotFound(req, res) {
    res.send("Page not found");
}

function handleError(err, req, res) {
    res.status(500).send(err);
}


function handleAddMovies(req,res){
    const{title,release_date,poster_path,overview,comment}=req.body;

    let sql=`INSERT INTO movie(title,release_date,poster_path,overview,comment) VALUES($1, $2, $3, $4,$5) RETURNING *;`
    let values=[title,release_date,poster_path,overview,comment];
    client.query(sql,values).then((result)=>{
        console.log(result.rows);
        return res.status(201).json(result.rows[0]);
    }).catch((err) => {
        handleError(err, req, res);
    });
    }

function handleGetMovies(req, res) {

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

function handleUpdateMovie(req, res) {
    const id = req.params;
    const {
        title,
        release_date,
        poster_path,
        overview
    } = req.body;

    let sql = `UPDATE movie SET  title = $1, release_date= $2, poster_path = $3,overview=$4 WHERE id =$5 RETURNING *;`
    let values = [title, release_date, poster_path, overview];
    client.query(sql, values).then(data => {
        return res.status(200).json(data.rows);
    }).catch(error => {
        handleError(error, req, res);
    })
}


function handleDeleteMovie(req, res) {
    const newID = req.query.id;
    let value = [newID];

    const sql = `DELETE FROM movie WHERE id = $1;`
    client.query(sql, value)
        .then(() => {
            return res.status(204).json([]);
        })
        .catch(error => {
            handleError(error, req, res);
        })

}

function handleGetMovieByID(req, res) {
    const {
        id
    } = req.query;

    const sql = 'SELECT * from movie WHERE id =$1 ;'
    let value = [id];
    client.query(sql, value).then(result => {
        res.status(200).json(result.rows);

    }).catch(error => {
        console.log(error);
        handleError(error, req, res);
    })
}



client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening ${PORT}`);
    });
})






// constrructor for handelhomepage
function Slecet(title, poster_path, overview) {
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
    this.overview = overview
}