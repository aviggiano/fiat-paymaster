import { TokenPaymaster, TokenPaymaster__factory } from "@account-abstraction/contracts";
import { ClientConfig, SimpleAccountAPI, wrapProvider } from "@account-abstraction/sdk";
import { BaseAccountAPI } from "@account-abstraction/sdk/dist/src/BaseAccountAPI";
import { Provider, Web3Provider } from "@ethersproject/providers";
import { ethers, Signer } from "ethers";
import { bundlerUrl, config } from "./config";
import TestCounterAbi from "./TestCounter.abi.json";

export interface IAppState {
  signer: Signer;
  provider: Provider;
  accountAddress: string;
  fpusd: TokenPaymaster;
  counter: ethers.Contract;
  isAA: boolean;
  accountAPI: BaseAccountAPI;
  network: ethers.providers.Network;
}

export const getAppState = async (originalSigner: ethers.Signer) => {
  const [isAA, signer, provider, accountAPI] = await getSignerAndProvider(originalSigner);
  const web3Provider = originalSigner.provider as Web3Provider;
  const network = await web3Provider.getNetwork();
  const networkConfig = (config as any)[network.name];

  const accountAddress = await signer.getAddress();
  const counter = new ethers.Contract(networkConfig.testCounter, TestCounterAbi, signer);
  const fpusd = TokenPaymaster__factory.connect(networkConfig.fiatPaymaster, provider);

  return { provider, signer, accountAddress, fpusd, counter, isAA, accountAPI, network };
};

export const getSignerAndProvider = async (originalSigner: ethers.Signer) => {
  const web3Provider = originalSigner.provider as Web3Provider;
  const injectedProvider = web3Provider.provider;
  const network = await web3Provider.getNetwork();
  const networkConfig = (config as any)[network.name];
  const isAA = (injectedProvider as any).isAAExtension;
  const paymasterAPI = {
    getPaymasterAndData: async () => networkConfig.fiatPaymaster,
  };

  if (isAA) {
    const accountAPI = new SimpleAccountAPI({
      accountAddress: await originalSigner.getAddress(),
      provider: web3Provider,
      entryPointAddress: networkConfig.entryPoint,
      owner: originalSigner,
      factoryAddress: networkConfig.simpleAccountFactory,
      paymasterAPI,
    });

    return [true, originalSigner, web3Provider, accountAPI] as const;
  }

  const clientConfig: ClientConfig = { entryPointAddress: networkConfig.entryPoint, bundlerUrl, paymasterAPI };
  const erc4337Provider = await wrapProvider(web3Provider, clientConfig, originalSigner);
  const erc4337Signer = erc4337Provider.getSigner();
  const accountAPI = erc4337Provider.smartAccountAPI;
  return [false, erc4337Signer, erc4337Provider, accountAPI] as const;
};

export const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
