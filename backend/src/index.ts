import "dotenv/config";
import { BigNumberish, ethers } from "ethers";
import express from "express";
import cors from "cors";
import { config } from "./config";

if (!process.env.GOERLI_PROVIDER_URL) {
  throw new Error("Provider url not set");
}
if (!process.env.PAYMASTER_OWNER_PRIVATE_KEY) {
  throw new Error("Paymaster owner private key not set");
}

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_PROVIDER_URL);
const paymasterSigner = new ethers.Wallet(process.env.PAYMASTER_OWNER_PRIVATE_KEY).connect(provider);
const abi = ["function owner() external view returns (address)", "function mintTokens(address, uint256)"];
const fiatPaymaster = new ethers.Contract(config.fiatPaymaster, abi, paymasterSigner);

const mintTokens = async (recipient: string, amount: BigNumberish) => {
  const response = await fiatPaymaster.mintTokens(recipient, amount);
  const receipt = await response.wait();
  return receipt;
};

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");

app.get("/config", (req, res) => {
  res.send(config);
});

app.get("/health", (req, res) => {
  console.log("health check");
  res.send({ status: "ok" });
});

(async () => {
  const paymasterOwner = await fiatPaymaster.owner();
  const signerAddress = paymasterSigner.address;
  if (paymasterOwner !== signerAddress) {
    throw new Error(`Paymaster owner in contract ${paymasterOwner} does not match signer ${signerAddress}`);
  }

  const port = 3001;
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
})();
