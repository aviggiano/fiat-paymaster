import client from "../../lib/paypal";
import paypal from "@paypal/checkout-server-sdk";
import { Order } from "@paypal/checkout-server-sdk/lib/orders/lib";
import type { HttpResponse } from "@paypal/paypalhttp/lib/paypalhttp/http_client.js";
import { Request, Response } from "express";
import { mintTokens } from "../../lib/fiatPaymaster";

export default async function handle(req: Request, res: Response) {
  //Capture order to complete payment
  const { orderID } = req.body;
  const PaypalClient = client();
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  const response: HttpResponse<Order> = await PaypalClient.execute(request);
  if (!response) {
    res.status(500);
  }

  const { id, status } = response.result!;

  // Update payment to PAID status once completed
  console.log({
    orderID: id,
    status,
  });
  await mintTokens("0x", "0");

  res.json({ ...response.result });
}
