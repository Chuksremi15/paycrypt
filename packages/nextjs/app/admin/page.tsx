"use client";

import { useState } from "react";
import { Button } from "../product/[productId]/page";
import { useTheme } from "next-themes";
import { parseEther } from "viem";
import { TextInput } from "~~/components/pop-up-store/molecules/Form";
import { PaymentEventTable, TableBody, tableHeaders } from "~~/components/pop-up-store/molecules/Table";
import { GetBalanceCard } from "~~/components/pop-up-store/molecules/card";
import { Balance } from "~~/components/scaffold-eth";
import {
  useScaffoldContract,
  useScaffoldEventHistory,
  useScaffoldReadContract,
  useScaffoldWriteContract,
} from "~~/hooks/scaffold-eth";

const page = () => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const { data: popUpStore } = useScaffoldContract({
    contractName: "PopUpStore",
  });
  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("PopUpStore");

  const [addTokenForm, setAddTokenForm] = useState<{ tokenName: string; tokenAddress: string }>({
    tokenName: "",
    tokenAddress: "",
  });

  const [withdrawTokenForm, setWithdrawTokenForm] = useState<{ tokenName: string; amount: string }>({
    tokenName: "",
    amount: "",
  });

  const [addTokenLoading, setAddTokenLoading] = useState<boolean>(false);
  const [withdrawTokenLoading, setWithdrawTokenLoading] = useState<boolean>(false);

  const onTokenChange = (value: string, formKey: string) => {
    setAddTokenForm(form => ({ ...form, [formKey]: value }));
  };
  const onWithdrawChange = (value: string | bigint, formKey: string) => {
    setWithdrawTokenForm(form => ({ ...form, [formKey]: value }));
  };

  const handleAddToken = async () => {
    try {
      setAddTokenLoading(true);
      await writeYourContractAsync({
        functionName: "addPaymentToken",
        args: [addTokenForm.tokenName, addTokenForm.tokenAddress],
      });

      setAddTokenLoading(false);
    } catch (e) {
      console.error("Error setting:", e);
      setAddTokenLoading(false);
    }
  };

  const handleWithdrawToken = async () => {
    try {
      setWithdrawTokenLoading(true);

      console.log("form values: ", withdrawTokenForm.tokenName, parseEther(withdrawTokenForm.amount));

      await writeYourContractAsync({
        functionName: "withdrawToken",
        args: [withdrawTokenForm.tokenName, parseEther(withdrawTokenForm.amount)],
      });

      setWithdrawTokenLoading(false);
    } catch (e) {
      console.error("Error setting:", e);
      setWithdrawTokenLoading(false);
    }
  };

  const { data: tokens } = useScaffoldReadContract({
    contractName: "PopUpStore",
    functionName: "getPaymentTokens",
  });

  const {
    data: events,
    isLoading: isLoadingEvents,
    error: errorReadingEvents,
  } = useScaffoldEventHistory({
    contractName: "PopUpStore",
    eventName: "PaymentReceive",
    fromBlock: 1n,
    watch: true,
    //filters: { payersAddress: "0x9eB2C4866aAe575bC88d00DE5061d5063a1bb3aF" },
    blockData: true,
    transactionData: true,
    receiptData: true,
  });

  return (
    <div className="container mx-auto max-w-4xl py-8 px-8 flex flex-col gap-y-10">
      {" "}
      <h4 className="font-heading text-xl lg:text-3xl">Admin Dashboard</h4>
      <div className="grid grid-cols-2 gap-x-4">
        <div className="max-w-sm border p-4 flex flex-col gap-y-4 bg-base-100">
          <h5 className="font-heading text-xl ">Contract Balance</h5>
          <div className="flex flex-col">
            <h5 className="font-heading text-base ">
              <Balance address={popUpStore?.address} />
            </h5>
            {tokens ? (
              tokens.length > 0 ? (
                tokens.map(({ tokenName }) => <GetBalanceCard tokenName={tokenName} />)
              ) : (
                <div></div>
              )
            ) : (
              <div className="animate-pulse flex space-x-4 mt-1">
                <div className="rounded-md bg-slate-300 h-6 w-6"></div>
                <div className="flex items-center space-y-6">
                  <div className="h-2 w-28 bg-slate-300 rounded"></div>
                </div>
              </div>
            )}
          </div>

          <div>
            <form className="w-full flex flex-col gap-y-2">
              <TextInput
                type="text"
                name="tokenName"
                value={withdrawTokenForm.tokenName}
                placeholder="Token name"
                isDarkMode={isDarkMode}
                onChange={onWithdrawChange}
              />
              <TextInput
                type="string"
                name="amount"
                value={withdrawTokenForm.amount}
                placeholder="Amount"
                isDarkMode={isDarkMode}
                onChange={onWithdrawChange}
              />
              <Button
                text="Withdraw"
                isDarkMode={isDarkMode}
                action={() => handleWithdrawToken()}
                loading={withdrawTokenLoading}
              />
            </form>
          </div>
        </div>
        <div className="max-w-sm border p-4 flex flex-col  bg-base-100">
          <h5 className="font-heading text-xl">Add Token for payment</h5>
          <p className="font-body text-md ">Add ERC20 token you intend to accept payments in</p>
          <form className="w-full flex flex-col gap-y-2">
            <TextInput
              type="text"
              placeholder="Token name"
              name="tokenName"
              isDarkMode={isDarkMode}
              value={addTokenForm.tokenName}
              onChange={onTokenChange}
            />
            <TextInput
              type="text"
              placeholder="Token address"
              name="tokenAddress"
              isDarkMode={isDarkMode}
              value={addTokenForm.tokenAddress}
              onChange={onTokenChange}
            />
            <Button
              action={() => handleAddToken()}
              text="Add token"
              isDarkMode={isDarkMode}
              loading={addTokenLoading}
            />
          </form>
        </div>
      </div>
      <div className="flex flex-col gap-y-6">
        <h5 className="font-heading text-xl">Payments Receive</h5>
        {events && events.length > 0 && (
          <PaymentEventTable headerContent={tableHeaders}>
            {events.map(({ args }, index) => (
              <TableBody args={args} index={index} />
            ))}
          </PaymentEventTable>
        )}
      </div>
    </div>
  );
};

export default page;
