import { Button } from "react-bootstrap";
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useProvider, useSigner } from "wagmi";
import TestCounterAbi from "./TestCounter.abi.json";
import "./App.css";

export const Counter = () => {
  const { address } = useAccount();

  const counters = useContractRead({
    address: "0x6F9641dd4b6Cf822D4cf52ceE753a8910b034827",
    abi: TestCounterAbi,
    functionName: "counters",
    args: [address!],
  });

  console.log("counters is", counters);

  const { config } = usePrepareContractWrite({
    address: "0x6F9641dd4b6Cf822D4cf52ceE753a8910b034827",
    abi: TestCounterAbi,
    functionName: "count",
  });
  const count = useContractWrite(config);

  const handleClick = async () => {
    count.write?.();
  };

  return (
    <div className="">
      <p>My counter: {counters.isLoading ? "loading..." : `${counters.data}`}</p>
      <div>
        <Button onClick={handleClick}>{count.isLoading ? "counting..." : "Count"}</Button>
      </div>
      {count.isError && <p className="text-danger">{count.error?.message}</p>}
    </div>
  );
};
