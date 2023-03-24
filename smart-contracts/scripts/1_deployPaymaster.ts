import hre, { ethers } from "hardhat";
import { config } from "./config";

(async () => {
  try {
    const [deployer] = await ethers.getSigners();
    const deployerBalance = await deployer.getBalance();
    console.log(`Deployer is ${deployer.address} with balance ${ethers.utils.formatEther(deployerBalance)} ETH`);

    const FiatPaymasterFactory = await ethers.getContractFactory("FiatPaymasterFactory");
    const args = [config.simpleAccountFactory, "FPUSD", config.entryPoint] as const;
    const fiatPaymasterFactory = await FiatPaymasterFactory.deploy(...args, config.salt);
    await fiatPaymasterFactory.deployed();

    const fiatPaymaster = await fiatPaymasterFactory.fiatPaymaster();

    console.log(`Deployed FiatPaymaster to ${fiatPaymaster}`);

    if (hre.network.name !== "hardhat") {
      console.log("Waiting to upload code to Etherscan...");
      await hre.run("verify:verify", {
        address: fiatPaymasterFactory.address,
        constructorArguments: [...args, config.salt],
      });
      await hre.run("verify:verify", { address: fiatPaymaster, constructorArguments: args });
    }
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
})();
