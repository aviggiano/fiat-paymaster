import { BigNumberish, ethers } from "ethers";
import { Chain, config } from "../config";

if (!process.env.GOERLI_PROVIDER_URL) {
  throw new Error("Provider url not set");
}
if (!process.env.PAYMASTER_OWNER_PRIVATE_KEY) {
  throw new Error("Paymaster owner private key not set");
}

export async function fiatPaymaster(network: Chain) {
  const networkConfig = config[network];
  const provider = new ethers.providers.JsonRpcProvider(networkConfig.providerUrl);
  const paymasterSigner = new ethers.Wallet(process.env.PAYMASTER_OWNER_PRIVATE_KEY!).connect(provider);
  const abi = ["function owner() external view returns (address)", "function mintTokens(address, uint256)"];
  const paymaster = new ethers.Contract(networkConfig.fiatPaymaster, abi, paymasterSigner);

  const mintTokens = async (recipient: string, amount: BigNumberish) => {
    const response = await paymaster.mintTokens(recipient, amount);
    const receipt = await response.wait();
    return receipt;
  };

  return {
    mintTokens,
  };
}
