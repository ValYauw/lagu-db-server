require('dotenv').config();

const express = require("express");
const cors = require('cors');
const router = require("./routes/index");

const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());  // CORS
app.use(express.json());
app.use(express.urlencoded({extended:false})); // Body parser
app.use(router);
app.use(errorHandler);

module.exports = app;