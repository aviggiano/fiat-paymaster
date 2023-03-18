import { ethers } from "hardhat";

// goerli:
const config = {
  entryPoint: "0x0576a174D229E3cFA37253523E645A78A0C91B57",
  simpleAccountFactory: "0x09c58cf6be8E25560d479bd52B4417d15bCA2845",
};

(async () => {
  try {
    const [deployer] = await ethers.getSigners();
    const deployerBalance = await deployer.getBalance();
    console.log(`Deployer is ${deployer.address} with balance ${ethers.utils.formatEther(deployerBalance)} ETH`);

    const owner = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY!);
    const ownerBalance = await ethers.provider.getBalance(owner.address);
    console.log(`Owner is ${owner.address} with balance ${ethers.utils.formatEther(ownerBalance)} ETH`);

    const FiatPaymaster = await ethers.getContractFactory("FiatPaymaster");
    const fiatPaymaster = await FiatPaymaster.deploy(config.simpleAccountFactory, "FPUSD", config.entryPoint);

    console.log(`Deployed FiatPaymaster to ${fiatPaymaster.address}`);
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
})();
