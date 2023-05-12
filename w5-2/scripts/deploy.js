// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
let { ethers } = require("hardhat");

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
    
    // The following constants are the addresses of the contracts that have already been deployed.
    const routerAddr = "0x74baE07F5257Df25D5D1959B12a305e9C8a80AB4";
    const wth9Addr = "0x6315e37AaE5D61F5a2e0dAe3423B46BF1bE9677b";

    // tokenA: MyToken(MTK)
    const MyTokenContract = await hre.ethers.getContractFactory("MyToken")
    const tokenA = await MyTokenContract.deploy();
    await tokenA.deployed();
    const tokenAAddr = tokenA.address;
    console.log("MyToken has been deployed to: " + tokenAAddr);

    // tokenB: GTT
    const GTTContract = await hre.ethers.getContractFactory("ERC20TokenGTT")
    const tokenB = await GTTContract.deploy();
    await tokenB.deployed();
    const tokenBAddr = tokenB.address;
    console.log("ERC20TokenGTT has been deployed to: " + tokenBAddr);

    let [owner] = await ethers.getSigners();       

    const MyTokenMarketContract = await ethers.getContractFactory("MyTokenMarket");
    const MyTokenMarket = await MyTokenMarketContract.deploy(routerAddr, wth9Addr);
    await MyTokenMarket.deployed();
    console.log("MyTokenMarket has been deployed at: " + MyTokenMarket.address);

    // approve MyTokenMarket (ERC20)
    await tokenA.approve(MyTokenMarket.address, ethers.utils.parseUnits("50000",18));
    await tokenB.approve(MyTokenMarket.address, ethers.utils.parseUnits("50000",18));

    // wait for the process of blockchain.
    await wait(20000);

    // add liquidity with tokenA-tokenB pair.
    let amountA = ethers.utils.parseUnits("100", 18);
    let amountB = ethers.utils.parseUnits("200", 18);
    console.log(`Add liquidity of tokenA-tokenB pair : [${amountA} tokenA and ${amountB} tokenB]`);
    await MyTokenMarket.AddLiquidity(tokenAAddr, amountA, tokenBAddr, amountB);
    
    // wait for the process of blockchain.
    await wait(20000);

    // buy tokenB with tokenA.
    let amountIn = ethers.utils.parseUnits("50",18);
    let minTokenAmount = ethers.utils.parseUnits("10",18);
    let balancetokenA = await tokenA.balanceOf(owner.address);
    let balancetokenB = await tokenB.balanceOf(owner.address);
    console.log("Owner's balance of tokenA: " + ethers.utils.formatUnits(balancetokenA, 18));
    console.log("Owner's balance of tokenB: " + ethers.utils.formatUnits(balancetokenB, 18));
    console.log("AmountIn of tokenA: " + ethers.utils.formatUnits(amountIn, 18));
    console.log("MinTokenAmount of tokenB: " + ethers.utils.formatUnits(minTokenAmount, 18));
    await MyTokenMarket.buyToken(tokenAAddr, tokenBAddr, amountIn, minTokenAmount);

    // wait for the process of blockchain.
    await wait(20000);

    let newBalanceTokenB = await tokenB.balanceOf(owner.address);
    let tokenBBought = ethers.utils.formatUnits(newBalanceTokenB, 18)-ethers.utils.formatUnits(balancetokenB, 18);
    console.log(`Owner has bought ${tokenBBought} tokenB`)
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
