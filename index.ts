#!/usr/bin/env ts-node
/* eslint-disable import/first */
require('dotenv').config();

const { Network, Alchemy, Wallet, Utils } = require("alchemy-sdk");
const { ALCHEMY_KEY, ACCOUNT_TEST_1_ADDRESS, ACCOUNT_TEST_1_PRIVATE_KEY, ACCOUNT_TEST_2_ADDRESS} = process.env;

const settings = {
    apiKey: ALCHEMY_KEY,
    network: Network.ETH_GOERLI,
};
const alchemy = new Alchemy(settings);
