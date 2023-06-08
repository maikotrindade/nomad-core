// /* eslint-disable import/first */
require('dotenv').config();

const axios = require('axios');
const { Network, Alchemy, Wallet} = require("alchemy-sdk");
const express = require('express');

const { User } = require('./../models/User');
import { flightStatusToInt } from './../models/flightStatus';
import { connectRewardBadge } from './smartContractController';
const router = express.Router();

const { ALCHEMY_KEY, ADMIN_ACCOUNT_PRIVATE_KEY } = process.env;
const settings = {
    apiKey: ALCHEMY_KEY,
    network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(settings);

/**
* GET Flights from Aviation stack API
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
        await contract.updateFlightStatus(flightId, flightStatus, { gasPrice: 100000000, gasLimit: 1000000})
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

/**
* Update flight statuses based on API
*/
router.post('/admin/flights', async (req, res) => {
    try {
        const contract = await connectRewardBadge(new Wallet(ADMIN_ACCOUNT_PRIVATE_KEY, alchemy));
        const scheduledFlightsIds = await contract.getScheduledFlights()
        console.log(scheduledFlightsIds)
        
        for (const flightId of scheduledFlightsIds) {
            const aviationUrl = "http://api.aviationstack.com/v1/flights?" 
            + "access_key=" + process.env.AVIATIONSTACK_ACCESS_KEY!! 
            + "&flight_number=" + flightId
            + "&dep_iata=YYC&arr_iata=SEA"
            + "&limit=1"

            const aviationResponse = await axios.get(aviationUrl, {timeout: 30000})
            const flightStatusString = aviationResponse.data.data[0].flight_status.toUpperCase()

            const flightStatus: number = flightStatusToInt(flightStatusString);
            await contract.updateFlightStatus(flightId, flightStatus, { gasPrice: 100000000, gasLimit: 1000000})
            console.log("Flight updated - id: "+ flightId + " | status: " + flightStatusString);
        }
        res.status(200).json({ flightIds: scheduledFlightsIds.map(String) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update flight statuses based on API: ' + error});
    }
});

/**
* POST Force Update all SCHEDULED flights to ACTIVE - Admin/test function
*/
router.post('/admin/forcestatus', async (req, res) => {
    try {
        const contract = await connectRewardBadge(new Wallet(ADMIN_ACCOUNT_PRIVATE_KEY, alchemy));
        const scheduledFlightsIds = await contract.getScheduledFlights()
        console.log(scheduledFlightsIds)
        for (const flightId of scheduledFlightsIds) {
            const activeFlightStatus = 1
            await contract.updateFlightStatus(flightId, activeFlightStatus, { gasPrice: 100000000, gasLimit: 1000000})
            console.log("Flight updated - id: "+ flightId + " | status: " + activeFlightStatus);
        }
        res.status(200).json({ flightIds: scheduledFlightsIds.map(String) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to force update flight statuses: ' + error});
    }
});

module.exports = router 
export {};