const { expect } = require("chai");
const {ethers} = require("hardhat/internal/lib/hardhat-lib");


describe("TestOfGTT&Vault", function () {
    let GTT;
    let vault;
    let owner;
    let account1;
    let account2;

    beforeEach(async function () {
        [owner, account1, account2] = await ethers.getSigners();

        const ERC20TokenGTT = await ethers.getContractFactory("ERC20TokenGTT");
        GTT = await ERC20TokenGTT.deploy();
        await GTT.deployed();

        const VaultContract = await ethers.getContractFactory("Vault");
        vault = await VaultContract.deploy(GTT.address);
        await vault.deployed();

    });

    it("Token name should be 'Garen Test Token'", async function () {
        expect(await GTT.name()).to.equal("Garen Test Token");
    });

    it("Token symbol should be 'GTT'", async function () {
        expect(await GTT.symbol()).to.equal("GTT");
    });

    it("Test GTT Transfer", async function () {
        // assume the transferred amount is 30000*10**18
        const amount = ethers.utils.parseUnits("30000", 18);
        await GTT.connect(owner).transfer(account1.address, amount);
        const balanceOwner = await GTT.balanceOf(owner.address);
        const balanceAccount1 = await GTT.balanceOf(account1.address);
        expect(balanceAccount1).to.equal(ethers.utils.parseUnits("30000", 18));
        expect(balanceOwner).to.equal(ethers.utils.parseUnits("70000", 18));
    });

    it("Test GTT Approve",async ()=>{
        const amount = ethers.utils.parseUnits("30000",18);

        await GTT.approve(account1.address, amount);

        const allowanceBalance = await GTT.allowance(owner.address, account1.address);
        
        expect(allowanceBalance).to.equal(ethers.utils.parseUnits("30000",18));
    });

    it("Test Vault Deposit", async function () {
        let tx = await GTT.approve(vault.address, 1000);
        await tx.wait();
        await expect(vault.connect(owner).deposit(1000)).to.changeTokenBalances(GTT, [owner.address, vault.address], [-1000, 1000]);
    });

    it("Test Vault Deposited Amount Exceed Allowance", async function () {
        const depositAmount = ethers.utils.parseUnits("100000",18);
        let tx = await GTT.approve(vault.address, ethers.utils.parseUnits("2000",18));
        await tx.wait();
        await expect(vault.connect(owner).deposit(depositAmount)).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("Test Vault Deposited Amount Exceed Balance", async function () {
        const depositAmount = ethers.utils.parseUnits("100001",18);
        let tx = await GTT.approve(vault.address, ethers.utils.parseUnits("100001",18));
        await tx.wait();
        await expect(vault.connect(owner).deposit(depositAmount)).to.be.revertedWith("Insufficient balance");
    });
    
    it("Test Vault Withdraw", async function () {
        const depositAmount = ethers.utils.parseUnits("50000",18);
        await GTT.approve(vault.address, depositAmount);
        await vault.deposit(depositAmount);
        const depositAmountBigInt = BigInt(depositAmount.toString());
        await expect(vault.connect(owner).withdraw(depositAmountBigInt)).to.changeTokenBalances(GTT, [owner.address, vault.address], [depositAmountBigInt, -depositAmountBigInt]);
    });

    it("test Vault ERC20Permit", async function () {

        const nonce = await GTT.nonces(owner.address);
        const deadline = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
        const chainId = (await ethers.provider.getNetwork()).chainId;
        const domain = {
            name: 'Garen Test Token', version: '1', chainId, verifyingContract: GTT.address
        };

        const types = {
            Permit: [{name: "owner", type: "address"}, {name: "spender", type: "address"}, {
                name: "value",
                type: "uint256"
            }, {name: "nonce", type: "uint256"}, {name: "deadline", type: "uint256"},],
        };

        const message = {
            owner: owner.address, spender: vault.address, value: 6000, nonce: nonce, deadline: deadline,
        };

        const signature = await owner._signTypedData(domain, types, message);
        const {v, r, s} = ethers.utils.splitSignature(signature);

        await expect(vault.connect(owner).permitDeposit(6000, deadline, v, r, s)).to.changeTokenBalances(GTT, [owner.address, vault.address], [-6000, 6000])
    })

});