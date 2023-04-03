// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    // ERC20TokenGTT has already been deployed on Goerli at 0xf29Da8b25afA9dB70542416E948597A0be57eC23
    const ERC20TokenAddr = "0xf29Da8b25afA9dB70542416E948597A0be57eC23"

    const ERC721TokenContract = await hre.ethers.getContractFactory("ERC721Token")
    const ERC721Token = await ERC721TokenContract.deploy();
    await ERC721Token.deployed();

    console.log("ERC721Token has been deployed at: " + ERC721Token.address);

    const NFTMarketContract = await hre.ethers.getContractFactory("NFTMarket")
    const NFTMarket = await NFTMarketContract.deploy(ERC20TokenAddr, ERC721Token.address);
    await NFTMarket.deployed();

    console.log("NFTMarket has been deployed at: " + NFTMarket.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
