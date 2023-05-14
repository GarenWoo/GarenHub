# 第 7 周第 2 课作业
![w7-2](./IMG/Assignment_w7-2.png)
## 合约代码
说明：原题目的通缩周期为 1 年，时间较久，本合约将通缩周期缩减为 1 秒。

部署网络：Sepolia 测试网络

合约地址：0x41770e3b29a6273da2Df8Cd54a7c662549b030ED

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// ETH Call Option
contract DeflationToken is ERC20 {

  uint public ONE = 1e18;
  uint private factor = ONE;

  uint private lastRebaseTs;

  constructor( ) ERC20("DeflationToken", "DT") {
      _mint(msg.sender, 100000 * ONE);
      lastRebaseTs = block.timestamp;
  }

  function totalSupply() public override view returns (uint256) {
      return super.totalSupply() * factor /  ONE;
  } 

  function balanceOf(address account) public override view returns (uint256) {
    return super.balanceOf(account) * factor /  ONE;
  }

  function underBalance(uint256 amount) public view returns (uint256 b) {
      b = amount * ONE / factor;
  }

  function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override virtual {
        uint under = underBalance(amount);
        super._transfer(from, to , under);
    }


  function rebase() external {
    // set the duration of every rebase 
    if (block.timestamp - lastRebaseTs >= 1) {
      factor = factor * 99 / 100;
      lastRebaseTs = block.timestamp;
    }
  }
}
```
## 演示合约：通缩以及余额变化
1. 通缩前 token 的数量。

![w7-2](./IMG/1_beforeRebase.png)

2. 执行第一次通缩。
![w7-2](./IMG/2_rebase.png)

tx URL: https://sepolia.etherscan.io/tx/0x8945c77fc3c2a86d3d32d572ff8c69f5c8aedbb2ab08f9597699f8ace172fbdf


3. 通缩之后查询 token 数量。
![w7-2](./IMG/3_afterRebase.png)

4. 给某一个地址（地址A）转账，用于后续查看通缩对该用户持有的该 token 的数量影响。
![w7-2](./IMG/4_transfer.png)

tx URL: https://sepolia.etherscan.io/tx/0x6f10c5cccc2b3c28c219278b8ee42d5dec3f4493cd69f1df26e85083b2cea4e1

5. 检查转账后的账户A的token余额。
![w7-2](./IMG/5_balanceOfAccountA_afterTransfer.png)

6. 执行第二次通缩。
![w7-2](./IMG/6_rebase2.png)

tx URL: https://sepolia.etherscan.io/tx/0x84e9a71be57b7a5b4c1b1b9adf6707099fb72beeed378e87d548c09deaf28e63

7. 检查第二次通缩后的账户余额和 total supply。
![w7-2](./IMG/7_afterRebase2.png)
