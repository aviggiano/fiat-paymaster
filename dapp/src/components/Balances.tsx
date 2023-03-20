import { BigNumber, BigNumberish, ethers } from "ethers";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { IAppState } from "../services";
import { AppContext } from "../contexts/AppContext";
import { isUndefined } from "lodash-es";

export const Balances: FC = () => {
  const state = useContext<IAppState | undefined>(AppContext);
  const { provider, accountAddress, fpusd } = state || {};

  const [ethBalance, setEthBalance] = useState<BigNumber>();
  const [fpusdBalance, setFpusdBalance] = useState<BigNumber>();

  const refreshValues = useCallback(async () => {
    if (accountAddress) {
      setEthBalance(await provider?.getBalance(accountAddress));
      setFpusdBalance(await fpusd?.balanceOf(accountAddress));
    }
  }, [accountAddress, provider, fpusd]);

  useEffect(() => {
    refreshValues();
  }, [refreshValues]);

  const format = (x: BigNumberish): string => ethers.utils.formatEther(x).replace(/(\.\d\d).*/, "$1");

  return (
    <div className="balances">
      <div>
        <img src="/eth.png" alt="ETH" />
        <span>{!accountAddress || isUndefined(ethBalance) ? "***" : `${format(ethBalance)} ETH`}</span>
      </div>
      <div>
        <img src="/usd.png" alt="FPUSD" />
        <span>{!accountAddress || isUndefined(fpusdBalance) ? "***" : `${format(fpusdBalance)} FPUSD`}</span>
      </div>
    </div>
  );
};
