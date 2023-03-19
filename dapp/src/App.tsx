import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useAccount, useConnect, useDisconnect, useNetwork, useSigner } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { Page } from "./Page";
import { getAppState, IAppState } from "./services";
import "./App.css";

export const App = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const [state, setState] = useState<IAppState>();

  useEffect(() => {
    (async () => {
      if (!isConnected || !signer) {
        setState(undefined);
      } else {
        setState(await getAppState(signer));
      }
    })();
  }, [isConnected, signer]);

  if (!state || !address) {
    return (
      <div className="App mt-3">
        <Button onClick={() => connect()}>Connect wallet</Button>
      </div>
    );
  }

  return (
    <div className="App mt-3 px-3">
      <div className="fw-light">
        Connected owner: {address.slice(0, 6)}...{address.slice(-4)} to {chain?.name}.{" "}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            disconnect();
          }}
        >
          Disconnect
        </a>
      </div>
      <div className="mt-3">
        <Page {...state} />
      </div>
    </div>
  );
};
