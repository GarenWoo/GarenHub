// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
let { ethers } = require("hardhat");
let { writeAddr } = require('./artifact_log.js');
const delay = require('./delay.js');

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function deploysushi() {
    let SushiToken = await ethers.getContractFactory("SushiToken");
    sushi = await SushiToken.deploy();
    await sushi.deployed();
  
    console.log("sushi has been deployed to:" + sushi.address);
  }
  
  async function deployMasterChef() {
    let MasterChefContract = await ethers.getContractFactory("MasterChef");
    let award = ethers.utils.parseUnits("40", 18);
  
    MasterChef = await MasterChefContract.deploy(sushi.address, award, 10);
    await MasterChef.deployed();
  
    console.log("MasterChef has been deployed to:" + MasterChef.address);
  }

async function main() {
    let [owner] = await ethers.getSigners();  

    await deploysushi();
    
    await wait(15000);
  
    await deployMasterChef();
  
    await wait(15000);
  
    let tx = await sushi.transferOwnership(MasterChef.address);
    await tx.wait();
    
    
    // The following constants are the addresses of the contracts that have already been deployed.
    const routerAddr = "0x74baE07F5257Df25D5D1959B12a305e9C8a80AB4";
    const wth9Addr = "0x6315e37AaE5D61F5a2e0dAe3423B46BF1bE9677b";

    // tokenA: MyToken(MTK)
    const MyTokenContract = await ethers.getContractFactory("MyToken")
    const tokenA = await MyTokenContract.deploy();
    await tokenA.deployed();
    const tokenAAddr = tokenA.address;
    console.log("MyToken has been deployed to: " + tokenAAddr);

    // tokenB: GTT
    const GTTContract = await ethers.getContractFactory("ERC20TokenGTT")
    const tokenB = await GTTContract.deploy();
    await tokenB.deployed();
    const tokenBAddr = tokenB.address;
    console.log("ERC20TokenGTT has been deployed to: " + tokenBAddr);     
    
    tx = await MasterChef.add(100, tokenBAddr, true);
    await tx.wait();

    const MyTokenMarketContract = await ethers.getContractFactory("MyTokenMarket");
    const MyTokenMarket = await MyTokenMarketContract.deploy(routerAddr, wth9Addr, sushi.address, MasterChef.address);
    await MyTokenMarket.deployed();
    console.log("MyTokenMarket has been deployed to: " + MyTokenMarket.address);

    // approve MyTokenMarket (ERC20)
    await tokenA.approve(MyTokenMarket.address, ethers.utils.parseUnits("50000",18));
    await tokenB.approve(MyTokenMarket.address, ethers.utils.parseUnits("50000",18));

    // add liquidity with tokenA-tokenB pair.
    let amountA = ethers.utils.parseUnits("100", 18);
    let amountB = ethers.utils.parseUnits("200", 18);
    console.log(`Add liquidity of tokenA-tokenB pair : [${amountA} tokenA and ${amountB} tokenB]`);
    await MyTokenMarket.AddLiquidity(tokenAAddr, amountA, tokenBAddr, amountB);
    
    // wait for the process of blockchain.
    await wait(15000);

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
    await wait(15000);

    let depositedAmount = await tokenB.balanceOf(MasterChef.address);
    console.log(`Deposited amount of tokenB: ${ethers.utils.formatUnits(depositedAmount, 18)}`);
    
    await wait(20000);

    let pending = await MasterChef.pendingSushi(0, MyTokenMarket.address);
    console.log("get profits:" + ethers.utils.formatUnits(pending, 18));

    txWithdraw = await MyTokenMarket.withdraw(tokenBAddr);
    await txWithdraw.wait();

    sushiBalance = await sushi.balanceOf(owner.address);
    console.log("get sushi:" + ethers.utils.formatUnits(sushiBalance, 18));
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
