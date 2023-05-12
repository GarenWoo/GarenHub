// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    
    const feeToSetter = "0xAcEc30255e729F00C68D902e3Ff9A59adAFe5FA0"
    const UniswapV2FactoryContract = await hre.ethers.getContractFactory("UniswapV2Factory")
    const UniswapV2Factory = await UniswapV2FactoryContract.deploy(feeToSetter);

    await UniswapV2Factory.deployed();

    console.log("UniswapV2Factory has been deployed at: " + UniswapV2Factory.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
