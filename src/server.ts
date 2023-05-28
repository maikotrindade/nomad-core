#!/usr/bin/env ts-node
/* eslint-disable import/first */
require('dotenv').config();

const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const compression = require('compression');

const app = express();
app.use(helmet());
app.use(cors());
app.use(compression()); 
app.use(bodyParser.json());

// Connect to MongoDB Atlas
const mongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_URL!!)
    .then(() => {
      console.log('Connected to MongoDB Atlas');
    })
    .catch((error: any) => {
      console.error('Error connecting to MongoDB Atlas:', error);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
  }
}

// Define a schema for the User model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
});

// Define the User model
const User = mongoose.model('User', userSchema);

// Create a new user
app.post('/user', async (req, res) => {
  try {
    const { name, email, address } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      user.name = name;
      await user.save();
    } else {
      user = new User({ email, name: address});
      await user.save();
    }
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upsert user: ' + error });
  }
});

// Get all users
app.get('/user', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' + error});
  }
});

// Get a user by ID
app.get('/user/:email', async (req, res) => {
  try {
    const user = await User.findByEmail(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' + error});
  }
});

app.route('/')
.get(function (req, res) {
  res.sendFile(process.cwd() + '/index.html');
}); 

// Server Activation
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = mongoDB()