import "dotenv/config";
import express from "express";
import cors from "cors";
import { config } from "./config";
import captureOrder from "./routes/paypal/captureOrder";
import createOrder from "./routes/paypal/createOrder";

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
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
})();

export default app;
