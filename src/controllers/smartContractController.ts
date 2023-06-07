// #!/usr/bin/env ts-node
import { Signer } from "ethers";

const axios = require('axios');
const { ethers } = require("ethers");

async function connectRewardBadge(signer: Signer) {
    const contractBadgeAddress = "https://raw.githubusercontent.com/maikotrindade/nomad-token/main/output/NomadBadgeAddress.json"
    const contractBagdeABI = "https://raw.githubusercontent.com/maikotrindade/nomad-token/main/output/NomadBadgeAbi.json"
    
    const addressResponse = await axios.get(contractBadgeAddress);
    const abiResponse = await axios.get(contractBagdeABI);
    return await new ethers.Contract(addressResponse.data.Contract, abiResponse.data.abi, signer);
}

export { connectRewardBadge };