#!/usr/bin/env ts-node
/* eslint-disable import/first */
require('dotenv').config();

import cors from 'cors';
import helmet from 'helmet';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';


const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas
const urlConnection = process.env.MONGO_CONNECTION_URL;
mongoose.connect(urlConnection!!)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error: any) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

// Define a schema for the User model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  token: String,
});

// Define the User model
const User = mongoose.model('User', userSchema);

// Create a new user
app.post('/users', async (req, res) => {
  try {
    const { name, email, token } = req.body;
    const user = new User({ name, email, token });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get a user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello!!')
})

// Server Activation
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});