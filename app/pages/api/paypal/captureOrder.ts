import type { NextApiRequest, NextApiResponse } from "next";
import client from "lib/paypal";
import paypal from "@paypal/checkout-server-sdk";
import { Order } from "@paypal/checkout-server-sdk/lib/orders/lib";
import type { HttpResponse } from "@paypal/paypalhttp/lib/paypalhttp/http_client.d.ts";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //Capture order to complete payment
  const { orderID } = req.body;
  const PaypalClient = client();
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  // request.requestBody({
  //   payment_source: undefined,
  // });
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

  res.json({ ...response.result });
}
