// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades } = require("hardhat");
const { getImplementationAddress } = require('@openzeppelin/upgrades-core');

async function main() {
  console.log("Upgrade ERC20Token to ERC20TokenV2 ...");
  const ERC20TokenV2Contract = await ethers.getContractFactory("ERC20TokenV2");  
  // proxy.address = 0x0d414ED87b916e54042AA6D4d9D898B0E460d952  
  const proxyAddr = "0x0d414ED87b916e54042AA6D4d9D898B0E460d952";    
  const proxy = await upgrades.upgradeProxy(proxyAddr, ERC20TokenV2Contract);
  await proxy.deployed();
  console.log("Upgrade complete");  
  console.log(`Proxy address: ${proxy.address} `);

  const currentImplAddress = await getImplementationAddress(ethers.provider, proxy.address);
  console.log(`implementation = ${currentImplAddress}\n`);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
