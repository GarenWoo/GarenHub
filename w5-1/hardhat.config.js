require("@nomicfoundation/hardhat-toolbox");
require('hardhat-abi-exporter');
require('dotenv').config();

let dotenv = require('dotenv')
dotenv.config({ path: "./.env" }) 

const { ProxyAgent, setGlobalDispatcher} = require("undici")

const proxyAgent = new ProxyAgent("http://127.0.0.1:7890")
setGlobalDispatcher(proxyAgent)

/** @type import('hardhat/config').HardhatUserConfig */
// const mnemonic = process.env.MNEMONIC
const scankeyEther = process.env.MUMBAI_ETHERSCAN_API_KEY
const privateKey = process.env.PRIVATEKEY
module.exports = {
  solidity: "0.8.17",

networks: {

  goerli: {
    url: `https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`,
    accounts: [privateKey],       // use private key to connect to the net.(It ought to be replaced by a true private key when deploy)
    chainId: 5,
  },

  mumbai: {
    url: "https://endpoints.omniatech.io/v1/matic/mumbai/public",
    accounts: [privateKey],
    chainId: 80001,
    },

  sepolia:{
    url: "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
    accounts: [privateKey],
    chainId: 11155111,
    },
  
  },

  localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
      // See its defaults
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
    polygonMumbai: scankeyEther,
  }

},

};
