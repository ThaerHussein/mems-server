'use strict';

const express = require('express');

const cors = require('cors');

require('dotenv').config();

const axios = require('axios');

const pg = require('pg');
const jsonData = require('./data.json')

const app = express();

app.use(cors());

const DataBase= process.env.PG_DATABASE
const UserName= process.env.PG_USER
const password= process.env.PG_PASSWORD
const Host = process.env.PG_HOST
const Port= process.env.PG_PORT

const client = new pg.Client(`postgresql://${UserName}:${password}@${Host}:${Port}/${DataBase}`)


var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

app.get('/', helloWorldHandler);

app.post('/addFavMeme' ,jsonParser, addFavMemeHandler);

app.get('/allMemes', getAllMemesHandler);

app.get('/favMeme', getfavMemeHandler);

app.get('/favMeme/:id', getOneFavMemeHandler);

app.put('/updatefavMeme/:id', jsonParser,updatefavMemeHandler);

app.delete('/deleteFavMeme/:id', deleteFavMemeHandler);

app.use('*', notFoundHandler);

app.use(errorHandler)



function helloWorldHandler(req , res){
    return res.status(200).send("Hello World");
}

function getAllMemesHandler(req,res) {
    console.log("your req was sent !")
    res.send(jsonData);
}

function addFavMemeHandler(req, res){
    const meme = req.body;
    const sql = `INSERT INTO meme(image_path, meme_name, rank, tags, top_text) VALUES($1, $2, $3, $4, $5) RETURNING *;`

    const values = [meme.image_path, meme.meme_name, meme.rank, meme.tags, meme.top_text];
    client.query(sql,values).then((data) => {
        res.status(201).json(data.rows);
    })
    .catch(error => {
        console.log(error);
        errorHandler(error, req,res);
    });
};

function getfavMemeHandler(req, res){

    const sql = `SELECT * FROM meme`;

    client.query(sql).then(data => {
        return res.status(200).json(data.rows);
    })
    .catch(error => {
        errorHandler(error, req,res);
    });
};

function getOneFavMemeHandler(req,res){
    const id = req.params.id;

    const sql = `SELECT * FROM meme WHERE id = ${id}`;

    client.query(sql).then(data => {
        return res.status(200).json(data.rows);
    })
    .catch(error => {
        errorHandler(error, req,res);
    });
};

function updatefavMemeHandler(req, res){
    const id = req.params.id;
    const meme = req.body;

    const sql = `UPDATE meme SET image_path=$1, meme_name=$2, rank=$3, tags=$4, top_text=$5 WHERE id=${id} RETURNING *;`;
    const values = [meme.image_path, meme.meme_name, meme.rank, meme.tags, meme.top_text];

    client.query(sql, values).then(data => {
        return res.status(200).json(data.rows);
        // or you can send 204 status with no content
        // return res.status(200).json(data.rows);
    }).catch( err => {
        console.log(err);
        errorHandler(err,req,res);
    });

};

function deleteFavMemeHandler(req , res){
    const id = req.params.id;

    const sql = `DELETE FROM meme WHERE id=${id};`;

    client.query(sql).then(() => {
        return res.status(204).json({});
    })
    .catch(err => {
        errorHandler(err,req,res);
    })
};

function notFoundHandler(request,response) { 
    response.status(404).send('huh????');
}

function errorHandler(error,req,res){
    const err = {
        status: 500,
        message: error
    }
    res.status(500).send(err);
};

client.connect()
.then(()=>{
    app.listen(8081, () =>
    console.log(`listening on ${8081}`)
    );
})