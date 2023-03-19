import { TokenPaymaster, TokenPaymaster__factory } from "@account-abstraction/contracts";
import { ClientConfig, wrapProvider } from "@account-abstraction/sdk";
import { Provider, Web3Provider } from "@ethersproject/providers";
import { ethers, Signer } from "ethers";
import { config } from "./config";
import TestCounterAbi from "./TestCounter.abi.json";

export interface IAppState {
  signer: Signer;
  provider: Provider;
  accountAddress: string;
  fpusd: TokenPaymaster;
  counter: ethers.Contract;
}

export const getAppState = async (wagmiSigner: ethers.Signer) => {
  const [signer, provider] = await getSignerAndProvider(wagmiSigner);

  const accountAddress = await signer.getAddress();
  const counter = new ethers.Contract(config.testCounter, TestCounterAbi, signer);
  const fpusd = TokenPaymaster__factory.connect(config.fiatPaymaster, provider);

  return { accountAddress, provider, signer, fpusd, counter };
};

export const getSignerAndProvider = async (wagmiSigner: ethers.Signer) => {
  const web3Provider = wagmiSigner.provider as Web3Provider;
  const injectedProvider = web3Provider.provider;
  const isTrampoline = (injectedProvider as any).isAAExtension;
  console.log({ isTrampoline });
  if (isTrampoline) {
    return [wagmiSigner, web3Provider] as const;
  }

  const erc4337Provider = await wrapProvider(web3Provider, clientConfig, wagmiSigner);
  const erc4337Signer = erc4337Provider.getSigner();
  return [erc4337Signer, erc4337Provider] as const;
};

const clientConfig: ClientConfig = {
  entryPointAddress: config.entryPoint,
  bundlerUrl: "https://node.stackup.sh/v1/rpc/621d49f02369a7a589d86c6ea4d0fbf9c227013cde89853bef43552ee1c62be6",
  paymasterAPI: {
    getPaymasterAndData: async () => config.fiatPaymaster,
  },
};
