import "dotenv/config";
import express from "express";
import cors from "cors";
import { config } from "./config";
import captureOrder from "./routes/paypal/captureOrder";
import createOrder from "./routes/paypal/createOrder";
import { fiatPaymaster, paymasterSigner } from "./lib/fiatPaymaster";

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

app.post("/paypal/capture", captureOrder);
app.post("/paypal/create", createOrder);

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
