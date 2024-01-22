// initialisation du server et des variables d'environnement 
const express = require("express");
const promoCodeRoutes = require("./Routes/promoCodeRoute");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

// import fichier .env
require("dotenv").config({path:"./Config/.env"});

const {mongoose} = require("./Config/db");

const app = express();


const corsOptions = {
  // cors policy from dev or prod 
    origin: process.env.CLIENT_URL,
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }

app.use(cors(corsOptions));

// handle folders  
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));



// routes 
app.use("/api/promo", promoCodeRoutes);


module.exports = app;