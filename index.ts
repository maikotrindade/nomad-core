#!/usr/bin/env ts-node
/* eslint-disable import/first */
require('dotenv').config();
const axios = require('axios');

const { Network, Alchemy, Wallet, Utils} = require("alchemy-sdk");
const { ethers } = require("ethers");
const { ALCHEMY_KEY, OWNER_ACCOUNT_PRIVATE_KEY, TEST_ADDRESS_TO } = process.env;

const settings = {
    apiKey: ALCHEMY_KEY,
    network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(settings);

const signer = new Wallet(OWNER_ACCOUNT_PRIVATE_KEY, alchemy);

// TODO fetch data from other repo
const contractAddress = "https://raw.githubusercontent.com/maikotrindade/nomad-token/main/contract/NomadBadgeAddress.json"
const contractABI = "https://raw.githubusercontent.com/maikotrindade/nomad-token/main/contract/NomadBadge.json"

async function main() {
    try {
        const addressResponse = await axios.get(contractAddress);
        const abiResponse = await axios.get(contractABI);
        
        const contract = new ethers.Contract(addressResponse.data.Contract, abiResponse.data.abi, signer);

        const run = await contract.getPoints(0);

        // const points = await contract.getPoints(0);
        // console.log(points);

        // const runRewardProcess = await contract.runRewardProcess(TEST_ADDRESS_TO)
        // console.log(runRewardProcess);

        } catch (error) {
            console.error(error);
        }
    }
    
    main();