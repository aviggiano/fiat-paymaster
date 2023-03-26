import client from "../../lib/paypal";
import paypal from "@paypal/checkout-server-sdk";
import { Request, Response } from "express";
import * as database from "../../lib/database";
import { config } from "../../config";

export default async function handle(req: Request, res: Response) {
  console.log(req.body);
  const {
    address,
    network: { network },
  } = req.body;
  const amount = "10.00";

  const PaypalClient = client();
  const request = new paypal.orders.OrdersCreateRequest();
  request.headers["Prefer"] = "return=representation";
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: (Number(amount) * (1 + config.feePercent)).toFixed(2),
        },
      },
    ],
  });
  const response = await PaypalClient.execute(request);
  if (response.statusCode !== 201) {
    res.status(500);
  }

  const key = response.result.id;
  const value = {
    orderID: key,
    status: "PENDING",
    address,
    amount,
    network,
  };
  await database.set(key, value);
  res.json(value);
}
