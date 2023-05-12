//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Uniswap/interfaces/IUniswapV2Router01.sol";
import "./IMasterChef.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MyTokenMarket {
    using SafeERC20 for IERC20;

    address public router;
    address public weth;
    address public sushi;
    address public masterchef;
    uint public depsited;

    constructor(address _router, address _weth, address _sushi, address _masterchef) {
        router = _router;
        weth = _weth;
        sushi = _sushi;
        masterchef = _masterchef;
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
        IUniswapV2Router01(router).swapExactETHForTokens{value : msg.value}(minTokenAmount, path, address(this), block.timestamp);
        uint amount = IERC20(token).balanceOf(address(this));

        IERC20(token).safeApprove(masterchef, amount);
        IMasterChef(masterchef).deposit(0, amount);
        depsited += amount;
    }

   // 用 tokenA 购买 tokenB
    function buyToken(address tokenA, address tokenB, uint amountIn, uint minTokenAmount) public {
        address[] memory path = new address[](2);
        path[0] = tokenA;
        path[1] = tokenB;
        IERC20(tokenA).safeTransferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenA).safeApprove(router, amountIn);
        IUniswapV2Router01(router).swapExactTokensForTokens(amountIn, minTokenAmount, path, address(this), block.timestamp);
        uint amount = IERC20(tokenB).balanceOf(address(this));

        IERC20(tokenB).safeApprove(masterchef, amount);
        IMasterChef(masterchef).deposit(0, amount);
        depsited += amount;
    }

    function withdraw(address token) public {
        IMasterChef(masterchef).withdraw(0, depsited);
        IERC20(token).safeTransfer(msg.sender, depsited);

        uint amount = IERC20(sushi).balanceOf(address(this));
        IERC20(sushi).safeTransfer(msg.sender, amount);

    }
}