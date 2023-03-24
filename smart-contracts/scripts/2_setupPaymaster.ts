import { ethers } from "hardhat";
import { config } from "./config";

(async () => {
  try {
    const [deployer] = await ethers.getSigners();
    const deployerBalance = await deployer.getBalance();
    console.log(`Deployer is ${deployer.address} with balance ${ethers.utils.formatEther(deployerBalance)} ETH`);

    const entryPoint = await ethers.getContractAt("IEntryPoint", config.entryPoint, deployer);
    const fiatPaymaster = await ethers.getContractAt("FiatPaymaster", config.fiatPaymaster, deployer);

    console.log("Setting 1 ETH = 1800 FPUSD");
    let response = await fiatPaymaster.setTokenValueOfEth(ethers.utils.parseEther("1800"));
    await response.wait();

    console.log("Adding paymaster deposit and stake to entry point...");
    await entryPoint.depositTo(fiatPaymaster.address, { value: ethers.utils.parseEther("0.1") });
    response = await fiatPaymaster.addStake(1, { value: ethers.utils.parseEther("0.2") });
    await response.wait();
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
})();
