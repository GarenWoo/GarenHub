// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

interface TokenRecipient {
    function tokensReceived(address sender, uint amount) external returns (bool);
}

contract ERC20TokenGTT is ERC20, ERC20Permit, ReentrancyGuard {
    using Address for address;
    address private owner;
    error NotOwner();

    constructor() ERC20("Garen Test Token", "GTT") ERC20Permit("Garen Test Token") {    // Token name is related to my alias —— Garen.
        owner = msg.sender;
        /// @dev totalsupply is 100,000
        _mint(msg.sender, 100000 * (10 ** uint256(decimals())));
    }

    // to realize callback function in ERC20 Token
    function transferWithCallback(address recipient, uint256 amount) external nonReentrant returns (bool) {
        _transfer(msg.sender, recipient, amount);    
        if (recipient.isContract()) {                                                  
            bool success = TokenRecipient(recipient).tokensReceived(msg.sender, amount);
            require(success, "No tokensReceived");
        }
        return true;
    }
}