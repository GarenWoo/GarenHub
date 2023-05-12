# 第 5 周第 2 课作业
![w5-2](./IMG/Assignment_w5-2.png)
## 前置条件：部署 UniswapV2 基础合约

合约部署网络：Sepolia

1. UniswapV2Factory: <br>
https://sepolia.etherscan.io/address/0x12F335B9557D2750b970e6e385dE8a6fEfeEc82B#code<br>

2. WTH9:<br>
https://sepolia.etherscan.io/address/0x6315e37AaE5D61F5a2e0dAe3423B46BF1bE9677b#code<br>

3. UniswapV2Router01:<br>
https://sepolia.etherscan.io/address/0x74baE07F5257Df25D5D1959B12a305e9C8a80AB4#code<br>

4. TokenA(MTK):<br>
https://sepolia.etherscan.io/address/0x4BC1d57837bdb95196D76e3e00F7a5FB5824494b#code<br>

5. TokenB(GTT):<br>
https://sepolia.etherscan.io/address/0xA502Bb69b8dB87Ba09C71B323aa7b9d17F0966B5#code<br>

6. MyTokenMarket:<br>
https://sepolia.etherscan.io/address/0x1b8f9fc33A70c54613a72D35BAF9B30bCD6327EB#code<br>

## MyTokenMarket合约
```solidity
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Uniswap/interfaces/IUniswapV2Router01.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MyTokenMarket {
    using SafeERC20 for IERC20;

    address public router;
    address public weth;

    constructor(address _router, address _weth) {
        router = _router;
        weth = _weth;
    }

    // 添加流动性：token 与 ETH
    function AddLiquidityETH(address token, uint tokenAmount) public payable {
        IERC20(token).safeTransferFrom(msg.sender, address(this),tokenAmount);
        IERC20(token).safeApprove(router, tokenAmount);

        // ingnore slippage
        // (uint amountToken, uint amountETH, uint liquidity) = 
        IUniswapV2Router01(router).addLiquidityETH{value: msg.value}(token, tokenAmount, 0, 0, msg.sender, block.timestamp);

        //TODO: handle left
    }

    // 添加流动性: tokenA 与 tokenB
    function AddLiquidity(address tokenA, uint amountA, address tokenB, uint amountB) public {
        IERC20(tokenA).safeTransferFrom(msg.sender, address(this), amountA);
        IERC20(tokenA).safeApprove(router, amountA);

        IERC20(tokenB).safeTransferFrom(msg.sender, address(this), amountB);
        IERC20(tokenB).safeApprove(router, amountB);

        IUniswapV2Router01(router).addLiquidity(tokenA, tokenB, amountA, amountB, 0, 0, msg.sender, block.timestamp);

        //TODO: handle left
    }

    // 用 ETH 购买 token
    function buyTokenWithETH(address token, uint minTokenAmount) public payable {
        address[] memory path = new address[](2);
        path[0] = weth;
        path[1] = token;
        IUniswapV2Router01(router).swapExactETHForTokens{value : msg.value}(minTokenAmount, path, msg.sender, block.timestamp);
    }

   // 用 tokenA 购买 tokenB
    function buyToken(address tokenA, address tokenB, uint amountIn, uint minTokenAmount) public {
        address[] memory path = new address[](2);
        path[0] = tokenA;
        path[1] = tokenB;
        IERC20(tokenA).safeTransferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenA).safeApprove(router, amountIn);
        IUniswapV2Router01(router).swapExactTokensForTokens(amountIn, minTokenAmount, path, msg.sender, block.timestamp);
    }
}
````
## 部署脚本
```javascript
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
```

## 添加流动性与购买token
添加 tokenA-tokenB 流动性，使用 tokenA 购买 tokenB。
![w5-2](./IMG/addLiquidity&buyToken.png)



-----------------------------------------------------------  END  -----------------------------------------------------------

