##UniswapV2Factory合约文件
增加语句以适配部署脚本计算code hash
```solidity
bytes32 public constant INIT_CODE_PAIR_HASH = keccak256(abi.encodePacked(type(UniswapV2Pair).creationCode));
```
