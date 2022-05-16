'use strict'

require('dotenv').config();

// Declare Variables:

const express = require('express');
// const movieData = require('./Movie_data/data.json');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios').default;
const apiKey = process.env.API_KEY;
// const pass = process.env.PASS;
const url = `postgres://tasneem:12345@localhost:5432/movies`;

const { Client } = require('pg')
// const client = new Client(url)
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Create app:

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const PORT = process.env.PORT || 5000;

// Raouts:

app.put("/UPDATE/:updateName", handleUpdate);
app.delete("/DELETE", handleDelete);
app.post("/addMovie", handleAdd);
app.get("/getMovies", handleGet);
app.get("/getMoviesById", handleGetById);
// app.use(handleError);
// app.get('/', handleData);
// app.get('/favorite', handleFavorite);
app.get('/', hundleHomePage);
app.get('/trending', hundleTrending);
app.get('/search', hundleSearch);
app.get('/id', hundleSearchId);
app.get('/image', hundleImage);
app.get('/topRated', hundleTopRated);
// app.get('/error', (req, res) => res.send(error()));



// Function: 

// for database: 
function handleUpdate(req, res) {
  const { name, time, summary, image } = req.body;
  const { updateName } = req.params;
  let sql = `UPDATE movie SET name=$1, time=$2, summary=$3, image=$4 WHERE id = $5 RETURNING *;`  // sql query
  let values = [name, time, summary, image, updateName];
  client.query(sql, values).then((result) => {
    // console.log(result.rows);
    return res.status(200).json(result.rows);
  }).catch()
}
function handleDelete(req, res) {
  const movieId = req.query.id
  let sql = 'DELETE FROM movie WHERE id=$1;'
  let value = [movieId];
  client.query(sql, value).then(result => {
    console.log(result);
    res.status(204).send("deleted");
  }
  ).catch()
}
function handleAdd(req, res) {
  const { name, time, summary, image, comment } = req.body;

  let sql = 'INSERT INTO movie(name,time,summary,image,comment) VALUES($1, $2, $3, $4, $5) RETURNING *;' // sql query
  let values = [name, time, summary, image, comment];
  client.query(sql, values).then((result) => {
    // console.log(result.rows);
    return res.status(201).json(result.rows);
  }).catch()
}
function handleGet(req, res) {

  let sql = 'SELECT * from movie;'
  client.query(sql).then((result) => {
    // console.log(result.rows);
    res.json(result.rows);
  }).catch();
}
function handleGetById(req, res) {

  const { id } = req.query;
  let sql = 'SELECT * from movie WHERE id=$1;'
  let value = [id];
  client.query(sql, value).then((result) => {
    // console.log(result);
    res.json(result.rows);
  }).catch();
}
// function handleError(error, req, res) {
//   res.status(500).send(error)
// }

// for local data
// function handleData(req, res) {
//   let result = [];
//   let newMovie = new Movie(movieData.title, movieData.poster_path, movieData.overview)
//   result.push(newMovie);
//   res.json(result);
// }
// function handleFavorite(req, res) {
//   res.send('Welcome to Favorite Page');
// }

// for 3rd API:
async function hundleHomePage(req, res) {
  const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`;
  await axios.get(url)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.log(error);
    })
}
function hundleTrending(req, res) {
  const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`;
  // axios.get().then().catch() 
  axios.get(url)
    .then(result => {
      // console.log(result);
      // console.log(result.data.results);
      let trender = result.data.results.map(trend => {
        return new Trend(trend.id, trend.title, trend.release_date, trend.poster_path, trend.overview);
      })
      res.json(trender);
    })
    .catch((error) => {
      console.log(error);
      res.send("Inside catch");
    })
}
function hundleSearch(req, res) {
  let movieName = req.query.movieName;
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieName}&page=2`;
  // axios.get().then().catch() 
  axios.get(url)
    .then(result => {
      // console.log(result.data.results);
      res.json(result.data.results)
    })
    .catch((error) => {
      console.log(error);
      res.send("Searching for data")
    })
}
function hundleTopRated(req, res) {
  let url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&page=1`;
  // axios.get().then().catch() 
  axios.get(url)
    .then(result => {
      // console.log(result.data.results);
      res.json(result.data.results)
    })
    .catch((error) => {
      console.log(error);
      res.send("Searching for data")
    })
}
function hundleSearchId(req, res) {
  let movieId = req.query.movieId;
  let url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&page=2`;
  // axios.get().then().catch() 
  axios.get(url)
    .then(result => {
      // console.log(result.data);
      res.json(result.data)
    })
    .catch((error) => {
      console.log(error);
      res.send("Searching for data")
    })
}
function hundleImage(req, res) {
  let movieId = req.query.movieId;
  let url = `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${apiKey}`;
  // axios.get().then().catch() 
  axios.get(url)
    .then(result => {
      // console.log(result.data);
      res.json(result.data)
    })
    .catch((error) => {
      console.log(error);
      res.send("Searching for data")
    })
}


// CREATE LISTENER:

// app.listen(PORT, handleListen)
// function handleListen() {
//   console.log(`I'm alive on PORT ${PORT}`)
// }
client.connect().then(() => {

  app.listen(PORT, () => {
    console.log(`Server is listening ${PORT}`);
  });
})

// Constructor:

// function Movie(title, poster_path, overview) {
//   this.title = title
//   this.poster_path = poster_path
//   this.overview = overview
// }

function Trend(id, title, release_date, poster_path, overview) {
  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;
}



// 'use strict';
// require('dotenv').config();
// const PORT = process.env.PORT;
// const dataJson = require("./data.json");
// const express = require('express');
// const cors = require('cors');
// const axios = require('axios').default;
// const bodyParser = require('body-parser');
// const url = "postgres://tasneem:12345@localhost:5432/movies";
// const {
//     Client
// } = require('pg');
// // const client = new Client(URL);
// const pg = require('pg');
// const client = new Client({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });

// //const pg=require('pg');
// //const client=new pg.Client(URL);
// const apiKey = process.env.API_KEY;
// const app = express();
// app.use(cors());
// app.use(bodyParser.urlencoded({
//     extended: false
// }));


// app.use(bodyParser.json());
// app.get("/", handleHomePage);
// app.get("/favorite", handleFavorite);
// app.get("/trending", handleTrending);
// app.get("/search", handleSearch);
// app.post("/addMovie", handleAddMovies);
// app.get("/getMovies", handleGetMovies);
// app.get("/getMovie/:id", handleGetMovieByID);
// app.put("/UPDATE/:id", handleUpdateMovie);
// app.delete("/DELETE/:id", handleDeleteMovie)
// // app.use("*", handleNotFound);
// // app.use(handleError);

// function handleHomePage(req, res) {
//     let newMovie = new Movie(dataJson.title, dataJson.poster_path, dataJson.overview, dataJson.comment);
//     res.json(newMovie);
// }

// function handleFavorite(req, res) {
//     res.send("Welcome to Favorite Page");
// }

// function handleTrending(req, res) {
//     let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`;
//     axios.get(url)
//         .then(result => {
//             console.log(result.data.results);
//             let Movies = result.data.results.map(movie => {
//                 return new Movie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview);
//             });
//             res.json(Movies);
//         })
//         .catch();
// }


// function handleSearch(req, res) {
//     let movieName = req.query.movieName;
//     let url = `https://api.themoviedb.org/3/search/movie?query=${movieName}&api_key=${apiKey}`;
//     axios.get(url)
//         .then(result => {
//             res.json(result.data.results);
//         })
//         .catch()

// }


// // function handleNotFound(req, res) {
// //     res.send("Page not found");
// // }

// // function handleError(err, req, res) {
// //     res.status(500).send(err);
// // }


// function handleAddMovies(req,res){
//     const{title,release_date,poster_path,overview,comment}=req.body;

//     let sql=`INSERT INTO movie(title,release_date,poster_path,overview,comment) VALUES($1, $2, $3, $4,$5) RETURNING *;`
//     let values=[title,release_date,poster_path,overview,comment];
//     client.query(sql,values).then((result)=>{
//         console.log(result.rows);
//         return res.status(201).json(result.rows[0]);
//     }).catch();
//     }

// function handleGetMovies(req, res) {

//     let sql = 'SELECT * from movie;'
//     client.query(sql).then((result) => {
//         console.log(result);
//         res.json(result.rows);
//     }).catch();
// }

// // function handleError(error, req, res) {
// //     res.status(500).send(error)
// // }

// function handleUpdateMovie(req, res) {
//     const id = req.params;
//     const {
//         title,
//         release_date,
//         poster_path,
//         overview
//     } = req.body;

//     let sql = `UPDATE movie SET  title = $1, release_date= $2, poster_path = $3,overview=$4 WHERE id =$5 RETURNING *;`
//     let values = [title, release_date, poster_path, overview];
//     client.query(sql, values).then(data => {
//         return res.status(200).json(data.rows);
//     }).catch()
// }


// function handleDeleteMovie(req, res) {
//     const newID = req.query.id;
//     let value = [newID];

//     const sql = `DELETE FROM movie WHERE id = $1;`
//     client.query(sql, value)
//         .then(() => {
//             return res.status(204).json([]);
//         })
//         .catch()

// }

// function handleGetMovieByID(req, res) {
//     const {
//         id
//     } = req.query;

//     const sql = 'SELECT * from movie WHERE id =$1 ;'
//     let value = [id];
//     client.query(sql, value).then(result => {
//         res.status(200).json(result.rows);

//     }).catch()
// }



// client.connect().then(() => {
//     app.listen(PORT, () => {
//         console.log(`Server is listening ${PORT}`);
//     });
// })






// // constrructor for handelhomepage
// function Slecet(title, poster_path, overview) {
//     this.title = title,
//         this.poster_path = poster_path,
//         this.overview = overview
// }


// // constructor for trending
// function Movie(id, title, release_date, poster_path, overview) {
//     this.id = id;
//     this.title = title;
//     this.release_date = release_date;
//     this.poster_path = poster_path;
//     this.overview = overview
// }