const { expect } = require("chai");
const {ethers} = require("hardhat/internal/lib/hardhat-lib");


describe("TestOfERC721Token&NFTMarket", function () {
    let ERC20Token;
    let ERC721Token;
    let NFTMarket;
    let owner;
    let account1;

    beforeEach(async function () {
        [owner, account1] = await ethers.getSigners();

        const ERC20TokenContract = await ethers.getContractFactory("ERC20TokenGTT");
        ERC20Token = await ERC20TokenContract.deploy();
        await ERC20Token.deployed();

        const ERC721TokenContract = await ethers.getContractFactory("ERC721Token");
        ERC721Token = await ERC721TokenContract.deploy();
        await ERC721Token.deployed();

        const NFTMarketContract = await ethers.getContractFactory("NFTMarket");
        NFTMarket = await NFTMarketContract.deploy(ERC20Token.address, ERC721Token.address);
        await NFTMarket.deployed();

    });

    it("ERC721Token name should be 'Garen's Collection'", async function () {
        expect(await ERC721Token.name()).to.equal("Garen's Collection");
    });

    it("ERC721Token symbol should be 'GarenCN'", async function () {
        expect(await ERC721Token.symbol()).to.equal("GarenCN");
    });

    it("test ERC721 mint", async function() {
        ERC721Token.mint(owner.address, "ipfs://QmSz3n347TdH8nNEXfTrjB3oApUfzN3FGX8gUniGV21C4v");
        expect(await ERC721Token.balanceOf(owner.address)).to.be.equal(1);
    });

    it("test NFTMarket list and delist", async function() {
        ERC721Token.connect(owner).mint(owner.address, "ipfs://QmSz3n347TdH8nNEXfTrjB3oApUfzN3FGX8gUniGV21C4v");     
        await ERC721Token.connect(owner).approve(NFTMarket.address, 1);
        expect(await ERC721Token.getApproved(1)).to.be.equal(NFTMarket.address);
        await NFTMarket.connect(owner).list(1, 12500);
        expect(await NFTMarket.getPrice(1)).to.be.equal(12500);
        expect(await ERC721Token.ownerOf(1)).to.be.equal(NFTMarket.address);
        await NFTMarket.connect(owner).delist(1);
        expect(await ERC721Token.ownerOf(1)).to.be.equal(owner.address);
        expect(await NFTMarket.getPrice(1)).to.be.equal(0);
    });

    it("test NFTMarket buy",async function() {
        ERC721Token.mint(owner.address, "ipfs://QmSz3n347TdH8nNEXfTrjB3oApUfzN3FGX8gUniGV21C4v");      
        await ERC721Token.connect(owner).approve(NFTMarket.address, 1);
        await NFTMarket.connect(owner).list(1, 12500);
        await ERC20Token.connect(owner).transfer(account1.address, 20000);
        expect(await ERC20Token.balanceOf(account1.address)).to.be.equal(20000);

        await ERC20Token.connect(account1).approve(NFTMarket.address, 20000);
        expect(await ERC20Token.allowance(account1.address, NFTMarket.address)).to.be.equal(20000);

        await expect(NFTMarket.connect(account1).buy(1, 12499)).to.be.reverted;

        await NFTMarket.connect(account1).buy(1, 12500);
        expect(await ERC721Token.ownerOf(1)).to.be.equal(account1.address)
        expect(await ERC20Token.balanceOf(account1.address)).to.be.equal(7500);
    });
});
