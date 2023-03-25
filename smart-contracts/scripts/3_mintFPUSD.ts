import hre from "hardhat";
import { ethers } from "hardhat";
import { config } from "./config";

(async () => {
  try {
    const [deployer] = await ethers.getSigners();
    const deployerBalance = await deployer.getBalance();
    console.log(`Deployer is ${deployer.address} with balance ${ethers.utils.formatEther(deployerBalance)} ETH`);

    const account = "0x865F5F4473304a44A6e78b6442eD78e99a41A242";
    const networkConfig = (config as any)[hre.network.name];
    const fiatPaymaster = await ethers.getContractAt("FiatPaymaster", networkConfig.fiatPaymaster, deployer);

    console.log(`FPUSD before: ${ethers.utils.formatEther(await fiatPaymaster.balanceOf(account))}`);
    const response = await fiatPaymaster.mintTokens(account, ethers.utils.parseEther("1000"));
    await response.wait();
    console.log(`FPUSD after: ${ethers.utils.formatEther(await fiatPaymaster.balanceOf(account))}`);
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
})();
