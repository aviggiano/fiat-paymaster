import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useAccount, useSigner } from "wagmi";
import { IAppState, getAppState } from "../services";

export const AppContext = createContext<IAppState | undefined>({} as IAppState);

interface Props {
  children: ReactNode;
}

export const AppProvider: React.FC<Props> = ({ children }) => {
  const { isConnected } = useAccount();
  const { data: signer } = useSigner();
  const [state, setState] = useState<IAppState | undefined>();

  useEffect(() => {
    (async () => {
      if (!isConnected || !signer) {
        setState(undefined);
      } else {
        setState(await getAppState(signer));
      }
    })();
  }, [isConnected, signer]);

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};
