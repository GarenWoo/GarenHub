// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    // const GTTContract = await hre.ethers.getContractFactory("ERC20TokenGTT")
    // const GTT = await GTTContract.deploy();
    // await GTT.deployed();
    // console.log("ERC20TokenGTT has been deployed at: " + GTT.address);

    const GTTAddr = "0xEA20f1e10167098746a168034E7E7094735DEcc2";

    const SelfishVault = await hre.ethers.getContractFactory("SelfishVault");
    const selfishVault = await SelfishVault.deploy(GTTAddr);

    await selfishVault.deployed();
    console.log("SelfishVault has been deployed at: " + selfishVault.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
