const { ethers, upgrades } = require("hardhat");


function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

const contracts = {// test
    testUSDC: '',                   //此处可改动：写入合约的名字
    a_contract:'',
    b_contract:'',
    c_contract:'',
}


async function main() {
    const [deployer] = await ethers.getSigners();

    var now = Math.round(new Date() / 1000);
    console.log('部署人：', deployer.address);

return

//如下代码表示：先执行合约USDCERC20，再实行合约集contracts中的testUSDC合约，然后再在合约中设置参数中，并一键部署
//代码功能：做一个假的USDC和一个假的ERC20合约
    const USDCERC20 = await ethers.getContractFactory('testERC20');
    testUSDT = await USDCERC20.deploy();
    // testUSDC = await USDCERC20.deploy('name', 'name');
    // contracts.testUSDC = testUSDC.address;
    // console.log("usdc:", contracts.testUSDC);
    // await testUSDC.setExecutor(deployer.address, true); console.log("setExecutor "); await sleep(1000);







    console.log("////////////////////全部合约//////////////////////");
    console.log("contracts:", contracts);
    console.log("/////////////////////END/////////////////////");


    return;



}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
    })

    //npx hardhat run --network polygon scripts/deploy.js



