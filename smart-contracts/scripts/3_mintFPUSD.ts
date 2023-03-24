import { ethers } from "hardhat";
import { config } from "./config";

(async () => {
  try {
    const [deployer] = await ethers.getSigners();
    const deployerBalance = await deployer.getBalance();
    console.log(`Deployer is ${deployer.address} with balance ${ethers.utils.formatEther(deployerBalance)} ETH`);

    const account = "0xd3354C3Fb5A758330F819c1d9DA2349084f8C394";
    const fiatPaymaster = await ethers.getContractAt("FiatPaymaster", config.goerli.fiatPaymaster, deployer);

    console.log(`FPUSD before: ${ethers.utils.formatEther(await fiatPaymaster.balanceOf(account))}`);
    const response = await fiatPaymaster.mintTokens(account, ethers.utils.parseEther("100"));
    await response.wait();
    console.log(`FPUSD after: ${ethers.utils.formatEther(await fiatPaymaster.balanceOf(account))}`);
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
})();
