const { expect } = require("chai");
const e = require("express");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const ether = tokens;

describe("DAO", () => {
  let token, dao, deployer, funder;

  beforeEach(async () => {
    let accounts = await ethers.getSigners();
    deployer = accounts[0];
    funder = accounts[1];
    investor1 = accounts[2];
    recipient = accounts[3];

    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Rumpelina", "RUMP", "1000000");

    const DAO = await ethers.getContractFactory("DAO");
    dao = await DAO.deploy(token.address, "500000000000000000000001");

    await funder.sendTransaction({ to: dao.address, value: ether(100) });
  });

  describe("Deployment", () => {
    it("send ether the DAO treasury", async () => {
      expect(await ethers.provider.getBalance(dao.address)).to.eq(ether(100));
    });

    it("returns token addresss", async () => {
      expect(await dao.token()).to.equal(token.address);
    });

    it("returns quorum", async () => {
      expect(await dao.quorum()).to.equal("500000000000000000000001");
    });
  });
  describe("Proposal Creation", () => {
    let transaction, result;
    describe("Success", () => {
      beforeEach(async () => {
        transaction = await dao
          .connect(investor1)
          .createProposal("Proposal 1", ether(100), recipient.address);
        result = await transaction.wait();
      });
      it("updates proposal count", async () => {
        expect(await dao.proposalCount()).to.eq(1);
      });
    });
    describe("Failure", () => {});
  });
});
