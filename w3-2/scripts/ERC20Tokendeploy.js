// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades } = require("hardhat");
const { getImplementationAddress } = require('@openzeppelin/upgrades-core');

async function main() {
  console.log("Deploying ERC20Token ...");
  const ERC20TokenContract = await ethers.getContractFactory("ERC20Token");
  const proxy = await upgrades.deployProxy(ERC20TokenContract);       
  await proxy.deployed();
  console.log("proxy deployed to:", proxy.address);

  const currentImplAddress = await getImplementationAddress(ethers.provider, proxy.address);
  console.log(`implementation = ${currentImplAddress}\n`);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
