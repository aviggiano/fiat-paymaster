import client from "../../lib/paypal";
import paypal from "@paypal/checkout-server-sdk";
import { Order } from "@paypal/checkout-server-sdk/lib/orders/lib";
import type { HttpResponse } from "@paypal/paypalhttp/lib/paypalhttp/http_client.js";
import { Request, Response } from "express";
import * as database from "../../lib/database";
import { fiatPaymaster } from "../../lib/fiatPaymaster";
import { ethers } from "ethers";

export default async function handle(req: Request, res: Response) {
  console.log(req.body);
  const { orderID } = req.body;
  const PaypalClient = client();
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  const response: HttpResponse<Order> = await PaypalClient.execute(request);
  if (!response) {
    res.status(500);
  }

  const key = response.result!.id;
  const value = await database.get(key);
  const { mintTokens } = await fiatPaymaster(value.network);
  console.log("mintTokens", value.address, value.amount);
  const receipt = await mintTokens(value.address, ethers.utils.parseEther(value.amount));
  console.log(receipt);

  res.json({ ...response.result });
}
