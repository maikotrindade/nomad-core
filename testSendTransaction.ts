// #!/usr/bin/env ts-node
// /* eslint-disable import/first */
// require('dotenv').config();

// const { Network, Alchemy, Wallet, Utils } = require("alchemy-sdk");
// const { ALCHEMY_KEY, ACCOUNT_TEST_1_ADDRESS, ACCOUNT_TEST_1_PRIVATE_KEY, ACCOUNT_TEST_2_ADDRESS} = process.env;

// const settings = {
//     apiKey: ALCHEMY_KEY,
//     network: Network.ETH_GOERLI,
// };
// const alchemy = new Alchemy(settings);

// async function getGasPrice() {
//   const gasPrice = await alchemy.core.getGasPrice();
//   console.log(`Current gas price: ${Utils.formatEther(gasPrice)} ETH`);
// }
// getGasPrice();

// async function getBalance() { 
//   try {
//   const balance = await alchemy.core.getBalance("0xAA65C14ADDDc3B408a41d76E6E24365Fa32DE6e8", 'latest')
//   console.log(`Balance is ${Utils.formatEther(balance)} ETH`);
//   } catch(err) {
//     console.log(err);
//   }
// }  
// getBalance();

// async function sendTestTransaction() { 
//   const wallet = new Wallet(ACCOUNT_TEST_1_PRIVATE_KEY);

//   const transaction = {
//     to: ACCOUNT_TEST_2_ADDRESS,
//     value: Utils.parseEther("0.00001"),
//     gasLimit: "22000",
//     maxPriorityFeePerGas: Utils.parseUnits("5", "gwei"),
//     maxFeePerGas: Utils.parseUnits("20", "gwei"),
//     nonce: await alchemy.core.getTransactionCount(wallet.getAddress()),
//     type: 2,
//     chainId: 5, // ETH_GOERLI
//   };

//     try {
//       const rawTransaction = await wallet.signTransaction(transaction);
//       await alchemy.transact.sendTransaction(rawTransaction);
//     } catch (err) {
//       console.log(err);
//     }
// }
// sendTestTransaction();