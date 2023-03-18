import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useAccount, useConnect, useDisconnect, useNetwork, useSigner } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { ClientConfig, ERC4337EthersProvider, ERC4337EthersSigner, wrapProvider } from "@account-abstraction/sdk";
import TestCounterAbi from "./TestCounter.abi.json";
import { Counter } from "./Counter";
import "./App.css";

export interface IAppState {
  accountAddress: string;
  provider: ERC4337EthersProvider;
  signer: ERC4337EthersSigner;
  counter: ethers.Contract;
}

export const App = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const [state, setState] = useState<IAppState>();

  useEffect(() => {
    (async () => {
      if (state || !isConnected || !signer) {
        return;
      }
      const config: ClientConfig = {
        entryPointAddress: "0x0576a174D229E3cFA37253523E645A78A0C91B57",
        bundlerUrl: "https://node.stackup.sh/v1/rpc/621d49f02369a7a589d86c6ea4d0fbf9c227013cde89853bef43552ee1c62be6",
      };
      const vanillaProvider = signer.provider as JsonRpcProvider;
      const erc4337Provider = await wrapProvider(vanillaProvider, config, signer);
      console.log("erc4337Provider", erc4337Provider);
      const erc4337Signer = erc4337Provider.getSigner();

      const counterAddress = "0x6F9641dd4b6Cf822D4cf52ceE753a8910b034827";
      const counter = new ethers.Contract(counterAddress, TestCounterAbi, erc4337Signer);

      setState({
        accountAddress: await erc4337Signer.getAddress(),
        provider: erc4337Provider,
        signer: erc4337Signer,
        counter,
      });
    })();
  }, [isConnected, state, signer]);

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
        <Counter {...state} />
      </div>
    </div>
  );
};
