import { ethers } from "hardhat";
import { config } from "./config";

(async () => {
  try {
    const [deployer] = await ethers.getSigners();
    const deployerBalance = await deployer.getBalance();
    console.log(`Deployer is ${deployer.address} with balance ${ethers.utils.formatEther(deployerBalance)} ETH`);

    const FiatPaymaster = await ethers.getContractFactory("FiatPaymaster");
    const fiatPaymaster = await FiatPaymaster.deploy(config.simpleAccountFactory, "FPUSD", config.entryPoint);

    console.log(`Deployed FiatPaymaster to ${fiatPaymaster.address}`);
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
})();
