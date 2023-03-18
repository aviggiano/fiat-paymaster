import React from "react";
import ReactDOM from "react-dom/client";
import { configureChains, mainnet, goerli, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { App } from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const { provider, webSocketProvider } = configureChains(
  [mainnet, goerli],
  [infuraProvider({ apiKey: process.env.REACT_APP_INFURA_KEY || "NO_KEY" })],
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <App />
    </WagmiConfig>
  </React.StrictMode>,
);
