const hre = require("hardhat");

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
  console.log(`Fetching % token and transferring to accounts...\n`);

  const token = await hre.ethers.getContractAt(
    "Token",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
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
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
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

    transaction = await dao.connect(investor1).vote(i + 1)
    await transaction.wait()
    transaction = await dao.connect(investor2).vote(i + 1)
    await transaction.wait()
    transaction = await dao.connect(investor3).vote(i + 1)
    await transaction.wait()

    transaction = await dao.connect(investor3).finalizeProposal(i + 1)
    await transaction.wait()
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
