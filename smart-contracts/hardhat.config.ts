import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  networks: {
    gnosis: {
      url: "https://rpc.gnosischain.com",
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY}`],
    },
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
    scrollAlpha: {
      chainId: 534353,
      url: "https://alpha-rpc.scroll.io/l2",
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY}`],
    },
    optimism: {
      url: "https://rpc.ankr.com/optimism",
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY}`],
    },
    polygon: {
      url: "https://rpc.ankr.com/polygon",
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY}`],
    },
    polygonZKEVM: {
      url: "https://rpc.public.zkevm-test.net",
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY}`],
    },
  },
  solidity: "0.8.17",
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY!,
      gnosis: process.env.GNOSISCAN_API_KEY!,
      polygon: process.env.POLYGONSCAN_API_KEY!,
      optimisticEthereum: process.env.OPTIMISMSCAN_API_KEY!,
    },
    customChains: [
      {
        network: "gnosis",
        chainId: 100,
        urls: {
          apiURL: "https://api.gnosisscan.io/api",
          browserURL: "https://gnosisscan.io/",
        },
      },
    ],
  },
};

export default config;
