const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Score contract", function() {
  let owner;
  let stu1;
  let stu2;

  beforeEach(async function() {
    [owner, stu1, stu2] = await ethers.getSigners();

    const Teacher = await ethers.getContractFactory("Teacher");
    teacherContract = await Teacher.deploy();
    await teacherContract.connect(owner).SetTeacher(owner.address);

    const Score = await ethers.getContractFactory("Score");
    scoreContract = await Score.deploy(teacherContract.address);

    return {owner, stu1, stu2, teacherContract, scoreContract};
  });

  describe("setScore", function() {
    it("Score cannot exceed 100", async function() {
        
    await expect(teacherContract.connect(owner).SetScoreByTeacher(scoreContract.address, stu1.address, 101))
        .to.be.reverted;

    await expect(teacherContract.connect(owner).SetScoreByTeacher(scoreContract.address, stu1.address, 99))
        .to.not.be.reverted;

    await expect(teacherContract.connect(owner).SetScoreByTeacher(scoreContract.address, stu2.address, 100))
        .to.not.be.reverted;

    });
  });

  it("Only teacher can set score", async function() {

    await expect(teacherContract.connect(owner).SetScoreByTeacher(scoreContract.address, stu2.address, 80))
      .to.not.be.reverted;

    await expect(teacherContract.connect(stu1).SetScoreByTeacher(scoreContract.address, stu2.address, 90))
      .to.be.reverted;

  });

  describe("GetScore", function() {
    it("Get the correct score", async function() {

    await teacherContract.connect(owner).SetScoreByTeacher(scoreContract.address, stu1.address, 88);
    await teacherContract.connect(owner).SetScoreByTeacher(scoreContract.address, stu2.address, 60);
      const score1 = await scoreContract.GetScore(stu1.address);
      expect(score1).to.equal(88);

      const score2 = await scoreContract.GetScore(stu2.address);
      expect(score2).to.equal(60);
    });
  });
});