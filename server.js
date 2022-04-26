'use strict';

const express = require('express');
const res = require('express/lib/response');
const app = express()
const port = 3000
const dataJson = require("./data.json")


app.get("/", handleHomePage)

app.get("/favorite", handleFavoritePage)

function handleHomePage(req, res) {
    let newRecipe = new Recipe(dataJson.title, dataJson.poster_path, dataJson.overview);
        res.json(newRecipe);
}

function handleFavoritePage(req, res) {
    res.send("Welcome to Favorite Page");
}

app.get('/',(req,res)=>res.send('500 error'))

app.use(function(err,req,res,text){
    res.type('text/plain')
    res.status(500)
    res.send('internal server error 500')

});


app.use(function(req,res,text){
    res.type('text/plain')
    res.status(404)
    res.send('not found')

});



app.listen(port, handleListen)

function handleListen(){
    console.log(`Example app listening on port ${port}`)
  }


function Recipe(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}