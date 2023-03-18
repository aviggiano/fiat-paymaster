import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useAccount, useConnect, useDisconnect, useNetwork, useSigner } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { ClientConfig, ERC4337EthersProvider, ERC4337EthersSigner, wrapProvider } from "@account-abstraction/sdk";
import { TokenPaymaster, TokenPaymaster__factory } from "@account-abstraction/contracts";
import TestCounterAbi from "./TestCounter.abi.json";
import { Counter } from "./Counter";
import "./App.css";

// goerli:
export const config = {
  entryPoint: "0x0576a174D229E3cFA37253523E645A78A0C91B57",
  simpleAccountFactory: "0x09c58cf6be8E25560d479bd52B4417d15bCA2845",
  fiatPaymaster: "0x9957D2d95D0a18a0BaF0e51c60621B8B01B2DD02",
  testCounter: "0x6F9641dd4b6Cf822D4cf52ceE753a8910b034827",
};

export interface IAppState {
  accountAddress: string;
  provider: ERC4337EthersProvider;
  signer: ERC4337EthersSigner;
  fpusd: TokenPaymaster;
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
      if (!isConnected || !signer) {
        setState(undefined);
        return;
      }
      const clientConfig: ClientConfig = {
        entryPointAddress: config.entryPoint,
        bundlerUrl: "https://node.stackup.sh/v1/rpc/621d49f02369a7a589d86c6ea4d0fbf9c227013cde89853bef43552ee1c62be6",
        paymasterAPI: {
          getPaymasterAndData: async () => config.fiatPaymaster,
        },
      };

      const vanillaProvider = signer.provider as JsonRpcProvider;
      const erc4337Provider = await wrapProvider(vanillaProvider, clientConfig, signer);
      const erc4337Signer = erc4337Provider.getSigner();

      const counter = new ethers.Contract(config.testCounter, TestCounterAbi, erc4337Signer);
      const fpusd = TokenPaymaster__factory.connect(config.fiatPaymaster, erc4337Signer);

      setState({
        accountAddress: await erc4337Signer.getAddress(),
        provider: erc4337Provider,
        signer: erc4337Signer,
        fpusd,
        counter,
      });
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
        <Counter {...state} />
      </div>
    </div>
  );
};
