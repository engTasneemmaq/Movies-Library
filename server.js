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

function handleTrending(req,res){
    axios.get("https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US")
        .then(result =>{
            console.log(result.data.results);
            let Movies=result.data.results.map(Movie=>{
                return new Movie(Movie.id,Movie.title,Movie.release_date,Movie.poster_path,Movie.overview);
            })
            res.json(Movies);
        })
        .catch((error)=>{
            console.log(error);
        })
    }


    function handleSearch(req,res){
        let movieName=req.query.movieName;
        let url=`https://api.themoviedb.org/3/trending/movie?query=${movieName}&api_key=37ddc7081e348bf246a42f3be2b3dfd0`;
    axios.get(url)
        .then(result=>{
            res.json(result.data.results);
        })
        .catch((error)=>{
            console.log(error);
           
        })

        let movieName2=req.query.movieName2;
    let url2=`https://api.themoviedb.org/3/trending/movie?query=${movieName2}&api_key=37ddc7081e348bf246a42f3be2b3dfd0`;
axios.get(url2)
    .then(result=>{
        res.json(result.data.results);
    })
    .catch((error)=>{
        console.log(error);
    })

    let movieName3=req.query.recipeName3;
    let url3=`https://api.themoviedb.org/3/trending/movie?query=${movieName3}&api_key=37ddc7081e348bf246a42f3be2b3dfd0`;
axios.get(url3)
    .then(result=>{
        res.json(result.data.results);
    })
    .catch((error)=>{
        console.log(error);
    
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



app.listen(port, handleListen)

function handleListen() {
    console.log(`Example app listening on port ${port}`)
}


function Movie(id,title,release_date, poster_path, overview) {
    this.id=id;
    this.title = title;
    this.release_date=release_date;
    this.poster_path=poster_path;
    this.overview=overview;
}