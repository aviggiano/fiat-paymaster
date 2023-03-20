import { Button } from "react-bootstrap";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { isUndefined } from "lodash-es";
import { IAppState } from "./services";
import { AppContext } from "./contexts/AppContext";
import { ConnectButton } from "./components/ConnectButton";
import { Paypal } from "./components/Paypal";
import { Balances } from "./components/Balances";

export const Page: FC = () => {
  const state = useContext<IAppState | undefined>(AppContext);
  const { provider, accountAddress, counter } = state || {};

  const [currentCount, setCurrentCount] = useState<number>();
  const [status, setStatus] = useState<string>();

  const refreshValues = useCallback(async () => {
    if (accountAddress) {
      setCurrentCount(await counter?.counters(accountAddress));
    }
  }, [accountAddress, counter]);

  useEffect(() => {
    refreshValues();
  }, [refreshValues]);

  const handleClick = async () => {
    setStatus("Requesting signature...");
    try {
      const response = await counter?.count({ gasLimit: 66_000 });
      setStatus(`Sent, waiting: ${response.hash}`);
      const timeout = 60_000;
      const receipt = await provider?.waitForTransaction(response.hash, undefined, timeout);
      console.log({ receipt });
      setStatus("Success!");
      await refreshValues();
    } catch (e: any) {
      console.error(e);
      setStatus(`Error: ${e?.message || e}`);
    }
  };

  return (
    <div className="">
      <h1>Fiat Paymaster</h1>
      <ConnectButton />
      <Balances />
      <div className="mt-3">{status && <p className="">{status}</p>}</div>
      <h2>Buy FPUSD</h2>
      <Paypal />
      <h2>Counter</h2>
      <p>Counter value: {isUndefined(currentCount) ? "loading..." : `${currentCount}`}</p>
      <div>
        <Button onClick={handleClick}>Count</Button>
      </div>
    </div>
  );
};
