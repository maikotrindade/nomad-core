require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('./../models/User');
const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');

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

router.post('/user', async (req, res) => {
    try {
        const { name, email, balance } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            user.name = name;
            await user.save();
        } else {
            const wallet = await ethers.Wallet.createRandom();
            user = new User({ 
                name: name, 
                email: email, 
                address: wallet.address, 
                privateKey: wallet.privateKey,
                balance: balance
            });
            await user.save();
        }
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to upsert user: ' + error });
    }
});

router.get('/user', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' + error});
    }
});


router.get('/user/:email', async (req, res) => {
    try {
        const user = await User.findByEmail(req.params.email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' + error});
    }
});

module.exports = router, mongoDB() 
export {};