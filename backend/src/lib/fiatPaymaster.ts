import { BigNumberish, ethers } from "ethers";
import { config } from "../config";

if (!process.env.GOERLI_PROVIDER_URL) {
  throw new Error("Provider url not set");
}
if (!process.env.PAYMASTER_OWNER_PRIVATE_KEY) {
  throw new Error("Paymaster owner private key not set");
}

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_PROVIDER_URL);
export const paymasterSigner = new ethers.Wallet(process.env.PAYMASTER_OWNER_PRIVATE_KEY).connect(provider);
const abi = ["function owner() external view returns (address)", "function mintTokens(address, uint256)"];
export const fiatPaymaster = new ethers.Contract(config.fiatPaymaster, abi, paymasterSigner);

export const mintTokens = async (recipient: string, amount: BigNumberish) => {
  const response = await fiatPaymaster.mintTokens(recipient, amount);
  const receipt = await response.wait();
  return receipt;
};
