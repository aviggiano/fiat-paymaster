import { Button } from "react-bootstrap";
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import "./App.css";
import { Counter } from "./Counter";

export const App = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  if (!isConnected) {
    return (
      <div className="App mt-3">
        <Button onClick={() => connect()}>Connect wallet</Button>
      </div>
    );
  }

  return (
    <div className="App mt-3 px-3">
      <div className="fw-light">
        Connected {address!.slice(0, 6)}...{address!.slice(-4)} to {chain?.name}.{" "}
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
      <Counter />
    </div>
  );
};
