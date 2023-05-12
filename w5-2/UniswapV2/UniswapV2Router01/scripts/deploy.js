// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    
    const UniswapV2Factory = "0x12F335B9557D2750b970e6e385dE8a6fEfeEc82B";
    const WTH9 = "0x6315e37AaE5D61F5a2e0dAe3423B46BF1bE9677b";
    const UniswapV2Router01Contract = await hre.ethers.getContractFactory("UniswapV2Router01");
    const UniswapV2Router01 = await UniswapV2Router01Contract.deploy(UniswapV2Factory, WTH9);

    await UniswapV2Router01.deployed();

    console.log("UniswapV2Router01 has been deployed at: " + UniswapV2Router01.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
