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

app.get("/", (req, res) => {
  res.send({ status: "ok" });
});

app.post("/paypal/order/capture", captureOrder);
app.post("/paypal/order/create", createOrder);

(async () => {
  const paymasterOwner = await fiatPaymaster.owner();
  const signerAddress = paymasterSigner.address;
  if (paymasterOwner !== signerAddress) {
    throw new Error(`Paymaster owner in contract ${paymasterOwner} does not match signer ${signerAddress}`);
  }

  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
})();

export default app;
