import { Button } from "react-bootstrap";
import { BigNumber, ethers } from "ethers";
import { FC, useCallback, useEffect, useState } from "react";
import { isUndefined } from "lodash-es";
import { IAppState } from "./services";

export const Page: FC<IAppState> = ({ provider, accountAddress, fpusd, counter }) => {
  const [ethBalance, setEthBalance] = useState<BigNumber>();
  const [fpusdBalance, setFpusdBalance] = useState<BigNumber>();
  const [currentCount, setCurrentCount] = useState<number>();
  const [status, setStatus] = useState<string>();

  const refreshValues = useCallback(async () => {
    setEthBalance(await provider.getBalance(accountAddress));
    setFpusdBalance(await fpusd.balanceOf(accountAddress));
    setCurrentCount(await counter.counters(accountAddress));
  }, [accountAddress, provider, fpusd, counter]);

  useEffect(() => {
    refreshValues();
  }, [refreshValues]);

  const handleClick = async () => {
    setStatus("Requesting signature...");
    try {
      const response = await counter.count({ gasLimit: 66_000 });
      setStatus(`Sent, waiting: ${response.hash}`);
      const timeout = 60_000;
      const receipt = await provider.waitForTransaction(response.hash, undefined, timeout);
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
      <p>Account address: {isUndefined(accountAddress) ? "loading..." : accountAddress}</p>
      <p></p>
      <div>Balances:</div>
      <div>{isUndefined(ethBalance) ? "loading..." : `${ethers.utils.formatEther(ethBalance)} ETH`}</div>
      <div>{isUndefined(fpusdBalance) ? "loading..." : `${ethers.utils.formatEther(fpusdBalance)} FPUSD`}</div>
      <p></p>
      <p>Counter value: {isUndefined(currentCount) ? "loading..." : `${currentCount}`}</p>
      <div>
        <Button onClick={handleClick}>Count</Button>
      </div>
      <div className="mt-3">{status && <p className="">{status}</p>}</div>
    </div>
  );
};
