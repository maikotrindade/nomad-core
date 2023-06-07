// #!/usr/bin/env ts-node
import { Signer } from "ethers";

// /* eslint-disable import/first */
require('dotenv').config();

const axios = require('axios');
const { Network, Alchemy, Wallet} = require("alchemy-sdk");
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

/**
* GET Flights tokens
*/
router.get('/flights', async (req, res) => {
    try {
        const aviationUrl = "http://api.aviationstack.com/v1/flights?access_key=" + process.env.AVIATIONSTACK_ACCESS_KEY!! + "&dep_iata=YYC&arr_iata=SEA"
        const aviationResponse = await axios.get(aviationUrl, {timeout: 30000})
        res.status(201).json(aviationResponse.data.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch flights' + error});
    }
});

/**
* POST Add flight
*/
router.post('/reward/flight', async (req, res) => {
    const { flightId, email } = req.body
    try {
        const user = await User.findOne({ email: email }).exec();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const contract = await connectRewardBadge(new Wallet(user.privateKey, alchemy));
        const addFlightMethod = await contract.addFlight(flightId, { gasPrice: 100000000, gasLimit: 1000000})
        console.log(addFlightMethod)
        res.status(201).json({ message: 'Flight ticket added' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add flight ticket: ' + error});
    }
});

/**
* POST Update flight status
*/
router.post('/reward/flightstatus', async (req, res) => {
    const { flightId, flightStatus } = req.body
    try {
        const contract = await connectRewardBadge(new Wallet(ADMIN_ACCOUNT_PRIVATE_KEY, alchemy));
        const updateFlightStatusMethod = await contract.updateFlightStatus(flightId, flightStatus, { gasPrice: 100000000, gasLimit: 1000000})
        console.log(updateFlightStatusMethod)
        res.status(201).json({ message: 'Flight status updated'});
    } catch (error) {
        res.status(500).json({ error: 'Failed to update flight status: ' + error});
    }
});

/**
* POST Run reward process
*/
router.post('/reward', async (req, res) => {
    try {
        const contract = await connectRewardBadge(new Wallet(ADMIN_ACCOUNT_PRIVATE_KEY, alchemy));
        const runRewardProcessMethod = await contract.runRewardProcess({ gasPrice: 100000000, gasLimit: 1000000})
        console.log(runRewardProcessMethod)
        res.status(201).json({ message: 'Reward processing started'});
    } catch (error) {
        res.status(500).json({ error: 'Failed to run Reward process: ' + error});
    }
});

/**
* GET Reward points
*/
router.get('/reward/points', async (req, res) => {
    try {
        const email = req.query.email as string;
        const user = await User.findOne({ email: email }).exec();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const contract = await connectRewardBadge(new Wallet(ADMIN_ACCOUNT_PRIVATE_KEY, alchemy));
        const points = await contract.getPoints(user.address)
        res.status(200).json({ points: points });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get rewards points: ' + error});
    }
});

/**
* GET Reward tokens
*/
router.get('/reward/tokens', async (req, res) => {
    try {
        const email = req.query.email as string;
        const user = await User.findOne({ email: email }).exec();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const contract = await connectRewardBadge(new Wallet(ADMIN_ACCOUNT_PRIVATE_KEY, alchemy));
        const erc20tokens = await contract.getTokensRewards(user.address)
        res.status(200).json({ erc20tokens: erc20tokens });
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