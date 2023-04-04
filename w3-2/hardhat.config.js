require("@nomicfoundation/hardhat-toolbox");
require('hardhat-abi-exporter');
require('dotenv').config();
require("@openzeppelin/hardhat-upgrades");



let dotenv = require('dotenv')
dotenv.config({ path: "./.env" }) 

const { ProxyAgent, setGlobalDispatcher} = require("undici")

const proxyAgent = new ProxyAgent("http://127.0.0.1:7890")
setGlobalDispatcher(proxyAgent)

/** @type import('hardhat/config').HardhatUserConfig */
const mnemonic = process.env.MNEMONIC
const scankeyEther = process.env.ETHERSCAN_API_KEY
// const scankeyMumbai = process.env.POLYGONSCAN_API_KEY
const privateKey = process.env.PRIVATEKEY
module.exports = {
  solidity: "0.8.17",

networks: {

  goerli: {
    url: `https://endpoints.omniatech.io/v1/eth/goerli/public`,
    accounts: [privateKey],       // use private key to connect to the net.(It ought to be replaced by a true private key when deploy)
    chainId: 5,
  },

  hardhat: {        
    chainId: 31337,
    gas: 12000000,
    accounts: {
      mnemonic: mnemonic,        // use mnemonic to connect to the net. (It ought to be replaced by a true mnemonic when deploy)
      },
    },

  mumbai: {
    url: "https://endpoints.omniatech.io/v1/matic/mumbai/public",
    accounts: {
      mnemonic: mnemonic,
      },
    chainId: 80001,
    },

  sepolia:{
    url: "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
    accounts: [privateKey], 
    chainId: 11155111,
    },
  
  },

  abiExporter: {
    path: './deployments/abi',
    clear: true,
    flat: true,
    only: [],
    spacing: 2,
    pretty: true,
},


etherscan: {
  apiKey: {
    sepolia: scankeyEther,
  }

},


};
