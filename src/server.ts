#!/usr/bin/env ts-node
/* eslint-disable import/first */
require('dotenv').config();

const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');

const userController = require('./controllers/userController.ts');
const rewardController = require('./controllers/rewardController.ts');
const flightController = require('./controllers/flightController.ts');

const app = express();
app.use(helmet());
app.use(cors());
app.use(compression()); 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(userController, rewardController, flightController)

app.route('/')
.get(function (req, res) {
  res.sendFile(process.cwd() + '/index.html');
}); 

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export {};