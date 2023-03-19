import client from "../../lib/paypal";
import paypal from "@paypal/checkout-server-sdk";
import { Request, Response } from "express";

export default async function handle(req: Request, res: Response) {
  const PaypalClient = client();
  //This code is lifted from https://github.com/paypal/Checkout-NodeJS-SDK
  const request = new paypal.orders.OrdersCreateRequest();
  request.headers["Prefer"] = "return=representation";
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "100.00",
        },
      },
    ],
  });
  const response = await PaypalClient.execute(request);
  if (response.statusCode !== 201) {
    res.status(500);
  }

  //Once order is created store the data
  console.log({
    orderID: response.result.id,
    status: "PENDING",
  });
  res.json({ orderID: response.result.id });
}
