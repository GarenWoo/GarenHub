// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    const currentTimestampInSeconds = Math.round(Date.now() / 1000);
    const unlockTime = currentTimestampInSeconds + 60;

    // const Contracts = await hre.ethers.getContractFactory("TokenERC20");
    // const contracts = await Contracts.deploy();
    //
    // await contracts.deployed();
    // console.log("token deployed finish address " + contracts.address)
    const GTTContract = await hre.ethers.getContractFactory("ERC20TokenGTT")
    const GTT = await GTTContract.deploy();

    await GTT.deployed();

    console.log("ERC20TokenGTT has been deployed at: " + GTT.address);

    const Vault = await hre.ethers.getContractFactory("Vault");
    const vault = await Vault.deploy(GTT.address);

    await vault.deployed();
    console.log("vault has been deployed at: " + vault.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
