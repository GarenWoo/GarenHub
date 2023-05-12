## UniswapV2Router01合约文件
1. UniswapV2Factory合约应在此合约之前部署，并获取应获取当前编译器对应的 code hash，
```javascript
let { ethers } = require("hardhat");

const { writeAddr } = require('./artifact_log.js');  

async function main() {
    let [owner, second] = await ethers.getSigners();

    let UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
    let f = await UniswapV2Factory.deploy(owner.address);
    await f.deployed();
    console.log("UniswapV2Factory address: ", f.address);
    await writeAddr(f.address, "UniswapV2Factory", network.name);

    let codeHash = await f.INIT_CODE_PAIR_HASH();        // 获取 codeHash
    console.log("UniswapV2Pair code hash: ", codeHash);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
```

2. 在./libraries/UniswapV2Library.sol中替换 UniswapV2Library 库中的 pairFor 方法内的 init code hash 。
