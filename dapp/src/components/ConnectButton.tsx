import { FC, useContext, useRef } from "react";
import { IAppState, formatAddress } from "../services";
import { Button } from "react-bootstrap";
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi";
import { InjectedConnector } from "wagmi/dist/connectors/injected";
import makeBlockie from "ethereum-blockies-base64";
import { isUndefined } from "lodash-es";
import { AppContext } from "../contexts/AppContext";

export const ConnectButton: FC = () => {
  const state = useContext<IAppState | undefined>(AppContext);
  const { address } = useAccount();
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  const { accountAddress } = state || {};

  if (!address) {
    return (
      <div className="App mt-3">
        <Button onClick={() => connect()}>Connect wallet</Button>
      </div>
    );
  }

  return (
    <div className="fw-light">
      {address ? <img className="blockie" src={makeBlockie(address)} alt={address} /> : null}
      Owner: {formatAddress(address)} to {chain?.name}.{" "}
      <Button variant="secondary" onClick={() => disconnect()}>
        Disconnect
      </Button>
      <p>Account address: {isUndefined(accountAddress) ? "loading..." : accountAddress}</p>
      <p></p>
    </div>
  );
};
