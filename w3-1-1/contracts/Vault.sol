// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface TokenRecipient {
    function tokensReceived(address sender, uint amount) external returns (bool);
}

contract Vault {
    using SafeERC20 for ERC20;
    mapping(address => uint256) public balance;
    ERC20 public token;
    error NotSpecifiedToken();
    error TransactionFailed();

    constructor(address _tokenAddress) {
        token = ERC20(_tokenAddress);
    }

    function getTokenSymbol() private view returns (string memory) {
        return token.symbol();
    }

    function deposit(uint256 amount) public {
        require(token.balanceOf(msg.sender) >= amount, "Insufficient balance");
        bool success = token.transferFrom(msg.sender, address(this), amount);
        if (!success) revert TransactionFailed();
        balance[msg.sender] += amount;
    }

    // ERC20-Permit(EIP2612): deposit with off-chain signiture
    function permitDeposit(uint256 amount, uint deadline, uint8 v, bytes32 r, bytes32 s) external {
        IERC20Permit(address(token)).permit(msg.sender, address(this), amount, deadline, v, r, s);
        deposit(amount);
    }

    function withdraw(uint256 amount) external {
        require(balance[msg.sender] >= amount, "Insufficient balance");
        balance[msg.sender] -= amount;
        token.safeTransfer(msg.sender, amount);
    }

    function getBalance(address _account) external view returns (uint256) {
        return token.balanceOf(_account);
    }

    // callback function 
    function tokensReceived(address sender, uint amount) external returns (bool) {
        require(msg.sender == address(token), "invalid");
        balance[sender] += amount;
        return true;
    }

}