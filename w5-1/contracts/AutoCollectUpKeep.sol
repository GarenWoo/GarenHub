pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./automation/AutomationCompatible.sol";


interface IVault {
    function collect(uint256 amount) external;
}

contract AutoCollectUpKeep is AutomationCompatible {
  address public immutable token;
  address public immutable vault;

  constructor(address _token, address _vault) {
        token = _token;
        vault = _vault;

  }

  function checkUpkeep(bytes calldata checkData) external view override returns (bool upkeepNeeded, bytes memory performData) {
    // upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
    
    if(IERC20(token).balanceOf(vault) > 100e18) {
      upkeepNeeded = true;
    }

    // performData = abi.decode();
  }


  function performUpkeep(bytes calldata performData) external override {
    if(IERC20(token).balanceOf(vault) > 100e18) {
      IVault(vault).collect((IERC20(token).balanceOf(vault) - (IERC20(token).balanceOf(vault) % 2)) / 2);
    }
  }

}