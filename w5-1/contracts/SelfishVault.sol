// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface TokenRecipient {
    function tokensReceived(address sender, uint amount) external returns (bool);
}

/*  
    This Contract has been modified which differs from the one in assignment of w3-1-1:
    1. The type of balance has been modified from mapping to uint. The balance is exactly the total deposited token in Vault contract instead of the balance of a specific depositor.
    2. Add owner of this Vault contract.
    Based on the modification, this contract can be invoked to transfer token to the owner by automation contract.
*/
contract SelfishVault is ReentrancyGuard {
    using SafeERC20 for ERC20;
    uint public balance;
    ERC20 public token;
    address public owner;

    constructor(address _tokenAddress) {
        token = ERC20(_tokenAddress);
        owner = msg.sender;
    }

    function getTokenSymbol() private view returns (string memory) {
        return token.symbol();
    }

    function deposit(uint256 amount) public {
        require(token.balanceOf(msg.sender) >= amount, "Insufficient token");
        bool success = token.transferFrom(msg.sender, address(this), amount);
        require(success, "token transfer is fail");
        balance += amount;
    }

    // ERC20-Permit(EIP2612): deposit with off-chain signiture
    function permitDeposit(uint256 amount, uint deadline, uint8 v, bytes32 r, bytes32 s) external {
        IERC20Permit(address(token)).permit(msg.sender, address(this), amount, deadline, v, r, s);
        deposit(amount);
    }

    function collect(uint256 amount) external nonReentrant {
        require(balance >= amount, "Insufficient balance in Vault");
        balance -= amount;
        token.safeTransfer(owner, amount);
    }

    function getBankBalance() external view returns (uint256) {
        return balance;
    }

    // callback function 
    function tokensReceived(address sender, uint amount) external returns (bool) {
        require(msg.sender == address(token), "invalid");
        balance += amount;
        return true;
    }

}