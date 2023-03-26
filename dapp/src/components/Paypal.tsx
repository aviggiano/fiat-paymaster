import axios, { AxiosError } from "axios";
import { useMutation } from "react-query";
import { PayPalScriptProvider, PayPalButtons, FUNDING } from "@paypal/react-paypal-js";
import { OnApproveData } from "@paypal/paypal-js";
import { backendUrl, paypalClientId } from "../config";
import { FC, useContext, useEffect } from "react";
import { IAppState } from "../services";
import { AppContext } from "../contexts/AppContext";

export const Paypal: FC<{ refresh: () => {}}> = ({ refresh }) => {
  const state = useContext<IAppState | undefined>(AppContext);
  const accountAddress = state?.accountAddress;
  const network = state?.network;

  const createMutation = useMutation<{ data: any }, AxiosError, any, Response>((): any =>
    axios.post(`${backendUrl}/paypal/order/create`, { address: accountAddress, network }),
  );
  const captureMutation = useMutation<string, AxiosError, any, Response>((data): any =>
    axios.post(`${backendUrl}/paypal/order/capture`, data),
  );
  const createPayPalOrder = async (): Promise<string> => {
    const response = await createMutation.mutateAsync({});
    return response.data.orderID;
  };

  useEffect(() => {
    // wake heroku up
    axios.get(`${backendUrl}/health`);
  }, []);

  useEffect(() => {
    if (captureMutation.data) {
      refresh();
    }
  }, [captureMutation.data]);

  const onApprove = async (data: OnApproveData): Promise<void> => {
    return captureMutation.mutate({ orderID: data.orderID });
  };
  return (
    <div>
      <div>
        {/* {captureMutation.data && <div>{JSON.stringify(captureMutation.data)}</div>} */}
        <PayPalScriptProvider
          options={{
            "client-id": paypalClientId,
            currency: "USD",
          }}
        >
          <PayPalButtons
            style={{
              color: "gold",
              shape: "rect",
              label: "pay",
              height: 50,
            }}
            fundingSource={FUNDING.PAYPAL}
            createOrder={createPayPalOrder}
            onApprove={onApprove}
            onError={(e) => console.log(e)}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};
