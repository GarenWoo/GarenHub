// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract ERC20Token is ERC20Upgradeable {

    function initialize() public initializer {
        __ERC20_init("ERC20UpgradeableToken", "EUGT");
        _mint(msg.sender, 200000 * (10 ** uint256(decimals())));
    }

    function version() public pure returns (string memory) {
        return "v1.0";
    }
}
