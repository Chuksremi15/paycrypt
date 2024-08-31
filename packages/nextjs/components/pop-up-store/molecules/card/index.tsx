import { formatEther, formatUnits } from "viem";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const GetBalanceCard = ({ tokenName }: { tokenName: string }) => {
  const { data: balance } = useScaffoldReadContract({
    contractName: "PopUpStore",
    functionName: "getTokenBalance",
    args: [tokenName],
  });

  return (
    <div className="">
      <span className="ml-3 text-[14px] font-heading ">{balance ? formatEther(balance) : "0.0000"}</span>
      <span className="text-[11.2px] font-heading ml-1 uppercase">{tokenName}</span>
    </div>
  );
};
