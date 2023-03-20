import { FC } from "react";
import { formatAddress } from "../services";
import { Button } from "react-bootstrap";
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi";
import { InjectedConnector } from "wagmi/dist/connectors/injected";

export const ConnectButton: FC = () => {
  const { address } = useAccount();
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  const handleDisconnect = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    disconnect();
  };

  if (!address) {
    return (
      <div className="App mt-3">
        <Button onClick={() => connect()}>Connect wallet</Button>
      </div>
    );
  }

  return (
    <div className="fw-light">
      Connected owner: {formatAddress(address)} to {chain?.name}.{" "}
      <a href="/" onClick={handleDisconnect}>
        Disconnect
      </a>
    </div>
  );
};
