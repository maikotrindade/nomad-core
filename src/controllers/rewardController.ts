// #!/usr/bin/env ts-node

import { Signer } from "ethers";

// /* eslint-disable import/first */
require('dotenv').config();

const axios = require('axios');
const { Network, Alchemy, Wallet, Utils} = require("alchemy-sdk");
const { ethers } = require("ethers");
const { User } = require('./../models/User');
const express = require('express');
const router = express.Router();

const { ALCHEMY_KEY, ADMIN_ACCOUNT_PRIVATE_KEY } = process.env;

const settings = {
    apiKey: ALCHEMY_KEY,
    network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(settings);
//const signer = new Wallet(ADMIN_ACCOUNT_PRIVATE_KEY, alchemy);

router.post('/reward/flight', async (req, res) => {
    const { flightId, email } = req.body
    try {
        const user = await User.findOne({ email: email }).exec();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const contract = await connectRewardBadge(new Wallet(user.privateKey, alchemy));
        const addFlightMethod = await contract.addFlight(flightId, user.address, { gasPrice: 100000000, gasLimit: 1000000})
        console.log(addFlightMethod)
        res.status(201).json({ message: 'Flight ticket added' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add flight ticket: ' + error});
    }
});

router.get('/reward/points', async (req, res) => {
    try {
        const email = req.query.email as string;
        const user = await User.findOne({ email: email }).exec();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const contract = await connectRewardBadge(new Wallet(user.privateKey, alchemy));
        const points = await contract.getPoints()
        res.status(200).json({ points: points });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get rewards points: ' + error});
    }
});

router.get('/reward/tokens', async (req, res) => {
    try {
        const email = req.query.email as string;
        const user = await User.findOne({ email: email }).exec();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const contract = await connectRewardBadge(new Wallet(user.privateKey, alchemy));
        const points = await contract.getTokensRewards()
        res.status(200).json({ points: points });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get rewards tokens: ' + error});
    }
});

const connectRewardBadge = async (signer: Signer) => {
    const contractBadgeAddress = "https://raw.githubusercontent.com/maikotrindade/nomad-token/main/output/NomadBadgeAddress.json"
    const contractBagdeABI = "https://raw.githubusercontent.com/maikotrindade/nomad-token/main/output/NomadBadgeAbi.json"
    
    const addressResponse = await axios.get(contractBadgeAddress);
    const abiResponse = await axios.get(contractBagdeABI);
    return await new ethers.Contract(addressResponse.data.Contract, abiResponse.data.abi, signer);
}

module.exports = router 
export {};