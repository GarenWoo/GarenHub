// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    // set price (how much COPT per ETH):
    const price = 4000;

    // deploy USDC contract
    const USDCContract = await hre.ethers.getContractFactory("USDC");
    const USDC = await USDCContract.deploy();

    await USDC.deployed();

    console.log("USDC has been deployed to:" + USDC.address);

    // deploy CallOptToken contract
    const CallOptTokenContract = await hre.ethers.getContractFactory("CallOptToken");
    const CallOptToken = await CallOptTokenContract.deploy(USDC.address, price);

    await CallOptToken.deployed();

    console.log("CallOptToken has been deployed to:" + CallOptToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});