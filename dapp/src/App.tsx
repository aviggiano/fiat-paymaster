import { Page } from "./Page";
import "./App.css";
import { Paypal } from "./components/Paypal";
import { ConnectButton } from "./components/ConnectButton";

export const App = () => {
  return (
    <div className="App mt-3 px-3">
      <ConnectButton />
      <div className="mt-3">
        <Page />
      </div>
      <Paypal />
    </div>
  );
};
