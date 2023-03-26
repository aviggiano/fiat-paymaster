import { Button } from "react-bootstrap";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { isUndefined } from "lodash-es";
import { IAppState } from "./services";
import { AppContext } from "./contexts/AppContext";
import { ConnectButton } from "./components/ConnectButton";
import { Paypal } from "./components/Paypal";
import { Balances } from "./components/Balances";
import { config } from "./config";

export const Page: FC = () => {
  const state = useContext<IAppState | undefined>(AppContext);
  const { provider, accountAddress, counter, network } = state || {};

  const [currentCount, setCurrentCount] = useState<number>();
  const [status, setStatus] = useState<string>();
  const [tx, setTx] = useState<string>();
  const [error, setError] = useState<string>();
  const [refreshCounter, setRefreshCounter] = useState<number>(Date.now());
  const refresh = () => setRefreshCounter(Date.now());

  const explorer = (config as any)[network?.name as string]?.explorer;

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
      const timeout = 60_000;
      const receipt = await provider?.waitForTransaction(response.hash, undefined, timeout);
      console.log({ receipt });
      setStatus("Success!");
      setTx(response.hash);
      await refreshValues();
    } catch (e: any) {
      setStatus(`Error`);
      setError(e?.message);
    }
  };

  return (
    <div className="page">
      <h1>Fiat Paymaster</h1>
      <ConnectButton />
      <Balances refreshCounter={refreshCounter} />
      <div className="mt-3">{status && <p className="">{status}</p>}</div>
      <div className="mt-3" style={{ overflowWrap: "break-word" }}>
        {error ? (
          <p className="">{error}</p>
        ) : tx ? (
          <a href={`${explorer}/tx/${tx}`} target="_blank" rel="noreferrer">
            {tx}
          </a>
        ) : null}
      </div>
      <h2>Buy FPUSD</h2>
      <Paypal refresh={refresh} />
      <h2>Counter</h2>
      <p>Counter value: {isUndefined(currentCount) ? "***" : `${currentCount}`}</p>
      <div>
        <Button onClick={handleClick}>Count</Button>
      </div>
    </div>
  );
};
