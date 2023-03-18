import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      forking: {
        url: process.env.GOERLI_PROVIDER_URL!,
        blockNumber: 8677078,
      },
      accounts: [{ privateKey: process.env.DEPLOYER_PRIVATE_KEY!, balance: "10000000000000000000000" }],
    },
    goerli: {
      chainId: 5,
      url: process.env.GOERLI_PROVIDER_URL!,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY}`],
    },
  },
  solidity: "0.8.17",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
