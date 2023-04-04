// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/utils/Address.sol";


interface TokenRecipient {
    function tokensReceived(address sender, uint amount) external returns (bool);
}

contract ReentrancyGuard {

    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        _status = _ENTERED;
    }

    function _nonReentrantAfter() private {
        _status = _NOT_ENTERED;
    }
}

contract ERC20TokenV2 is ERC20Upgradeable, ReentrancyGuardUpgradeable {
    using Address for address;

    function initialize() public initializer {
        __ERC20_init("ERC20UpgradeableToken", "EUGT");
        _mint(msg.sender, 200000 * (10 ** uint256(decimals())));
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

    function version() public pure returns (string memory) {
        return "v2.0";
    }
}

