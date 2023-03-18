import hre, { ethers } from "hardhat";
import { config } from "./config";

(async () => {
  try {
    const [deployer] = await ethers.getSigners();
    const deployerBalance = await deployer.getBalance();
    console.log(`Deployer is ${deployer.address} with balance ${ethers.utils.formatEther(deployerBalance)} ETH`);

    const FiatPaymaster = await ethers.getContractFactory("FiatPaymaster");
    const args = [config.simpleAccountFactory, "FPUSD", config.entryPoint] as const;
    const fiatPaymaster = await FiatPaymaster.deploy(...args);

    console.log(`Deployed FiatPaymaster to ${fiatPaymaster.address}`);

    if (hre.network.name !== "hardhat") {
      console.log("Waiting to upload code to Etherscan...");
      await fiatPaymaster.deployTransaction.wait(5);
      await hre.run("verify:verify", { address: fiatPaymaster.address, constructorArguments: args });
    }
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
})();
