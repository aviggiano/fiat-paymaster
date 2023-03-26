import hre from "hardhat";
import { ethers } from "hardhat";
import { Chain, config } from "./config";

(async () => {
  try {
    const network = hre.network.name as Chain;
    const [deployer] = await ethers.getSigners();
    const deployerBalance = await deployer.getBalance();
    console.log(`Deployer is ${deployer.address} with balance ${ethers.utils.formatEther(deployerBalance)} ETH`);

    const networkConfig = config[network];
    const entryPoint = await ethers.getContractAt("IEntryPoint", networkConfig.entryPoint, deployer);
    const fiatPaymaster = await ethers.getContractAt("FiatPaymaster", networkConfig.fiatPaymaster, deployer);

    console.log("Setting 1 ETH = 1800 FPUSD");
    let response = await fiatPaymaster.setTokenValueOfEth(ethers.utils.parseEther("1800"));
    await response.wait();

    console.log("Adding paymaster deposit and stake to entry point...");
    await entryPoint.depositTo(fiatPaymaster.address, { value: ethers.utils.parseEther("0.003") });
    let response2 = await fiatPaymaster.addStake(1, { value: ethers.utils.parseEther("0.003") });
    await response2.wait();
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
})();
