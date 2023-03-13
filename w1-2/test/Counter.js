const { expect } = require("chai");


let counter;
let owner;
let otherAccount;
describe("Counter", function () {
  async function init() {
    [owner, otherAccount] = await ethers.getSigners();
    console.log("owner:" + owner.address);
    console.log("otherAccount:" + otherAccount.address);
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy(0);
    await counter.deployed();
    console.log("counter:" + counter.address);
  }

  before(async function () {
    await init();
  });

  it("owner init equal 0", async function () {                //check the initial value of counter is 0 as expected
    expect(await counter.connect(owner).counter()).to.equal(0);
  });

  it("owner add 1 equal 1", async function () {          
    let tx = await counter.count();
    await tx.wait();
    //console.log(tx);
    expect(await counter.connect(owner).counter()).to.equal(1);
  });
  it("otherAccount add equal 1", async function () {
    try{
        let tx = await counter.connect(otherAccount).count();
        await tx.wait();
        //console.log(tx);
    }catch {
        console.log("Only owner can use count()");
    }
 
    expect(await counter.connect(otherAccount).counter()).to.equal(1);
});
});
