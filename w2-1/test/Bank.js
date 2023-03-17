const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Bank", function () {
    async function deployBank() {

        const Bank = await ethers.getContractFactory("Bank");
        const bank = await Bank.deploy();
        const [account1, account2] = await ethers.getSigners();
        return {bank, account1, account2 };
    }

    describe("deposit", function(){
      it("deposit in bank", async function(){
          const {bank, account1, account2} = await loadFixture(deployBank);
          // 向地址进行转账，并且检查他们的余额
          await bank.connect(account1).deposit({value : ethers.utils.parseEther("1")});
          expect(await bank.connect(account1).checkBalance()).to.equal(ethers.utils.parseEther("1"));

          await bank.connect(account2).deposit({value: ethers.utils.parseEther("2")});
          expect(await bank.connect(account2).checkBalance()).to.equal(ethers.utils.parseEther("2"));
      });
    });

    describe("withdraw", function(){
      it("withdraw custom value of money", async function () {
          const {bank, account1, account2} = await loadFixture(deployBank);

          // 存款
          await bank.deposit({value: ethers.utils.parseEther("2") });

          // 取款
          await bank.withdraw(ethers.utils.parseEther("1"));
      
          // 验证余额是否正确
          expect(await bank.checkBalance()).to.equal(ethers.utils.parseEther("1"));
        });

        it("withdraw more than the balance", async function () {
          const {bank, account1, account2} = await loadFixture(deployBank);

          // 存款
          await bank.deposit({value: ethers.utils.parseEther("1") });
      
          // 尝试取款超过余额的金额
          await expect(bank.withdraw(ethers.utils.parseEther("2"))).to.be.revertedWith(
            "Insufficient balance"
          );
      
          // 验证余额是否正确
          expect(await bank.checkBalance()).to.equal(ethers.utils.parseEther("1"));
        });

        it("withdraw all", async function () {
          const {bank, account1, account2} = await loadFixture(deployBank);

          // 存款
          await bank.deposit({value: ethers.utils.parseEther("1") });
      
          // 取款
          await bank.withdrawAll();
      
          // 验证余额是否正确
          expect(await bank.checkBalance()).to.equal(0);
        });
    });



});