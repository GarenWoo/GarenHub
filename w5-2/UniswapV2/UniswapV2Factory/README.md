## UniswapV2Factory合约文件
增加语句以适配部署脚本计算code hash:
```solidity
bytes32 public constant INIT_CODE_PAIR_HASH = keccak256(abi.encodePacked(type(UniswapV2Pair).creationCode));
```

此外，需导出 abi 放入./deployment/NetName/ 路径下，UniswapV2Factory 合约部署时需调用对应的 JSON 文件。
