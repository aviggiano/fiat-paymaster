import { Button } from "react-bootstrap";
import { BigNumber, ethers } from "ethers";
import { FC, useEffect, useState } from "react";
import { isUndefined } from "lodash-es";
import type { IAppState } from "./App";

export const Counter: FC<IAppState> = ({ accountAddress, provider, counter }) => {
  const [balance, setBalance] = useState<BigNumber>();
  const [currentCount, setCurrentCount] = useState<number>();
  const [status, setStatus] = useState<string>();

  useEffect(() => {
    (async () => {
      setBalance(await provider.getBalance(accountAddress));
      setCurrentCount(await counter.counters(accountAddress));
    })();
  }, [accountAddress, provider, counter]);

  const handleClick = async () => {
    setStatus("Requesting signature...");
    try {
      const response = await counter.count();
      setStatus(`Sent, waiting: ${response.hash}`);
      const timeout = 60_000;
      const receipt = await provider.waitForTransaction(response.hash, undefined, timeout);
      console.log({ receipt });
      setStatus("Success!");
      setCurrentCount(await counter.counters(accountAddress));
      setBalance(await provider.getBalance(accountAddress));
    } catch (e) {
      console.error(e);
      setStatus(`Error: ${e}`);
    }
  };

  return (
    <div className="">
      <p>Account address: {isUndefined(accountAddress) ? "loading..." : accountAddress}</p>
      <p>Balance: {isUndefined(balance) ? "loading..." : `${ethers.utils.formatEther(balance)} ETH`}</p>
      <p>Counter value: {isUndefined(currentCount) ? "loading..." : `${currentCount}`}</p>
      <div>
        <Button onClick={handleClick}>Count</Button>
      </div>
      <div className="mt-3">{status && <p className="">{status}</p>}</div>
    </div>
  );
};
