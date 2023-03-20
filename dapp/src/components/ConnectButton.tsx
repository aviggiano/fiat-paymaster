import { FC, useContext } from "react";
import { IAppState } from "../services";
import { Button } from "react-bootstrap";
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi";
import { InjectedConnector } from "wagmi/dist/connectors/injected";
import { AppContext } from "../contexts/AppContext";

export const ConnectButton: FC = () => {
  const state = useContext<IAppState | undefined>(AppContext);
  const { address } = useAccount();
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  const { accountAddress } = state || {};

  return (
    <div className="fw-light connect-button">
      <div className="connect">
        {address ? (
          <>
            <b>{chain?.name || ""}</b>
            <Button variant="secondary" onClick={() => disconnect()}>
              Disconnect
            </Button>
          </>
        ) : (
          <Button onClick={() => connect()}>Connect wallet</Button>
        )}
      </div>
      <div>
        <div>
          <span>Owner</span>
          <pre>{address || "***"}</pre>
        </div>
      </div>
      <div>
        <div>
          <span>Account</span>
          <pre>{accountAddress || "***"}</pre>
        </div>
      </div>
    </div>
  );
};
