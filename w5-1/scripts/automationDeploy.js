// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    const GTTAddr = "0xEA20f1e10167098746a168034E7E7094735DEcc2";
    const SelfishVaultAddr = "0x6381e570debF4FFFA3d52F53cde20074b3dFfa94";

    const AutoCollectUpKeepContract = await hre.ethers.getContractFactory("AutoCollectUpKeep");
    const AutoCollectUpKeep = await AutoCollectUpKeepContract.deploy(GTTAddr, SelfishVaultAddr);

    await AutoCollectUpKeep.deployed();
    console.log("AutoCollectUpKeep has been deployed at: " + AutoCollectUpKeep.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
