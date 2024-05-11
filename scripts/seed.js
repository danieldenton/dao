const hre = require("hardhat");
const config = require("../src/config.json");

const tokens = (n) => {
  return hre.ethers.utils.parseUnits(n.toString(), "ether");
};

const ether = tokens;

async function main() {
  const accounts = await hre.ethers.getSigners();
  deployer = accounts[0];
  funder = accounts[1];
  investor1 = accounts[2];
  investor2 = accounts[3];
  investor3 = accounts[4];
  investor4 = accounts[5];
  investor5 = accounts[6];
  recipient = accounts[7];
  user = accounts[8];

  let transaction;

  const { chainId } = await hre.ethers.provider.getNetwork();

  console.log(`Fetching % token and transferring to accounts...\n`);

  const token = await hre.ethers.getContractAt(
    "Token",
    config[chainId].token.address
  );
  console.log(`Token fetched at ${token.address}\n`);

  transaction = await token.transfer(investor1.address, tokens(200000));
  await transaction.wait();
  transaction = await token.transfer(investor2.address, tokens(200000));
  await transaction.wait();
  transaction = await token.transfer(investor3.address, tokens(200000));
  await transaction.wait();

  console.log("Fetching DAO...");
  const dao = await hre.ethers.getContractAt(
    "DAO",
    config[chainId].dao.address
  );
  console.log(`DAO fetched at ${dao.address}\n`);

  transaction = await funder.sendTransaction({
    to: dao.address,
    value: ether(1000),
  });
  console.log("Sent DAO funds to treasury");

  for (let i = 0; i < 3; i++) {
    transaction = await dao
      .connect(investor1)
      .createProposal(`Proposal ${i + 1}`, ether(100), recipient.address);
    await transaction.wait();

    transaction = await dao.connect(investor1).vote(i + 1);
    await transaction.wait();
    transaction = await dao.connect(investor2).vote(i + 1);
    await transaction.wait();
    transaction = await dao.connect(investor3).vote(i + 1);
    await transaction.wait();

    transaction = await dao.connect(investor3).finalizeProposal(i + 1);
    await transaction.wait();

    console.log(`Created and Finalized Proposal ${i + 1}`);
  }

  console.log(`Creating one more proposal... \n`);
  transaction = await dao
    .connect(investor1)
    .createProposal(`Proposal 4`, ether(100), recipient.address);
  await transaction.wait();

  transaction = await dao.connect(investor1).vote(4);
  await transaction.wait();
  transaction = await dao.connect(investor2).vote(4);
  await transaction.wait();

  console.log("Finished");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
