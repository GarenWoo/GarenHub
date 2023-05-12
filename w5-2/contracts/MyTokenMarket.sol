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