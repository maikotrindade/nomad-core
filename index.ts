#!/usr/bin/env ts-node
/* eslint-disable import/first */
require('dotenv').config();
const axios = require('axios');

const { Network, Alchemy, Wallet, Utils} = require("alchemy-sdk");
const { ethers } = require("ethers");
const { ALCHEMY_KEY, OWNER_ACCOUNT_PRIVATE_KEY, TEST_ACCOUNT_1, TEST_ACCOUNT_2, TEST_ACCOUNT_3 } = process.env;

const settings = {
    apiKey: ALCHEMY_KEY,
    network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(settings);

const signer = new Wallet(OWNER_ACCOUNT_PRIVATE_KEY, alchemy);

// TODO fetch data from other repo
const contractAddress = "https://raw.githubusercontent.com/maikotrindade/nomad-token/main/output/NomadBadgeAddress.json"
const contractABI = "https://raw.githubusercontent.com/maikotrindade/nomad-token/main/output/NomadBadgeAbi.json"

const erc20Address = "https://raw.githubusercontent.com/maikotrindade/nomad-token/main/output/NomadRewardTokenAddress.json"
const erc20Abi = "https://raw.githubusercontent.com/maikotrindade/nomad-token/main/output/NomadRewardTokenAbi.json"

async function main() {
    try {
        const addressResponse = await axios.get(contractAddress);
        const abiResponse = await axios.get(contractABI);
        const contract = new ethers.Contract(addressResponse.data.Contract, abiResponse.data.abi, signer);
        
        const erc20AddressResponse = await axios.get(erc20Address);
        const erc20AbiResponse = await axios.get(erc20Abi);
        const erc20Contract = new ethers.Contract(erc20AddressResponse.data.Contract, erc20AbiResponse.data.abi, signer);

        // const runRewardProcess1 = await contract.runRewardProcess(TEST_ACCOUNT_2)
        // console.log(runRewardProcess1);

        // const runRewardProcess2 = await contract.runRewardProcess(TEST_ACCOUNT_3)
        // console.log(runRewardProcess2);

        // const runRewardProcess3 = await contract.runRewardProcess(TEST_ACCOUNT_3)
        // console.log(runRewardProcess3);
        
        // const totalPointsDistributed = await contract.getTotalPointsDistributed();
        // console.log("total points: " + totalPointsDistributed);

        // const totalBadgesMinted = await contract.getTotalBadgesMinted();
        // console.log("total badges: " + totalBadgesMinted);

        // const totalSupply = await erc20Contract.totalSupply();
        // console.log("totalSupply: " + totalSupply);

        // const balanceOfOwner = await erc20Contract.balanceOf(signer.address)
        // console.log("balanceOf owner: " + balanceOfOwner);

        // const success = await erc20Contract.transfer(TEST_ACCOUNT_1, 666)
        // console.log("Success ? " + success.toString());
        
    } catch (error) {
        console.error(error);
    }
}

main();