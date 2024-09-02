"use client";

import { useState } from "react";
import { NextPage } from "next";
import { useTheme } from "next-themes";
import { parseEther } from "viem";
import { TextInput, TextSelect } from "~~/components/pop-up-store/molecules/Form";
import { PaymentEventTable, TableBody, tableHeaders } from "~~/components/pop-up-store/molecules/Table";
import { Button } from "~~/components/pop-up-store/molecules/button";
import { GetBalanceCard } from "~~/components/pop-up-store/molecules/card";
import { Balance } from "~~/components/scaffold-eth";
import {
  useScaffoldContract,
  useScaffoldEventHistory,
  useScaffoldReadContract,
  useScaffoldWriteContract,
} from "~~/hooks/scaffold-eth";

const Page: NextPage = () => {
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

  const [withdrawTokenForm, setWithdrawTokenForm] = useState<{ tokenIndex: string; amount: string }>({
    tokenIndex: "",
    amount: "",
  });

  const [priceForm, setPriceForm] = useState<{ productId: string; amount: string }>({
    productId: "",
    amount: "",
  });

  const [addTokenLoading, setAddTokenLoading] = useState<boolean>(false);
  const [withdrawTokenLoading, setWithdrawTokenLoading] = useState<boolean>(false);
  const [priceLoading, setPriceLoading] = useState<boolean>(false);

  const onTokenChange = (value: string, formKey: string) => {
    setAddTokenForm(form => ({ ...form, [formKey]: value }));
  };
  const onPriceChange = (value: string, formKey: string) => {
    setPriceForm(form => ({ ...form, [formKey]: value }));
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

      console.log("form values: ", withdrawTokenForm.tokenIndex, parseEther(withdrawTokenForm.amount));

      await writeYourContractAsync({
        functionName: "withdrawToken",
        args: [BigInt(withdrawTokenForm.tokenIndex), parseEther(withdrawTokenForm.amount)],
      });

      setWithdrawTokenLoading(false);
    } catch (e) {
      console.error("Error setting:", e);
      setWithdrawTokenLoading(false);
    }
  };

  const handleSetPrice = async () => {
    try {
      console.log(priceForm.productId, priceForm.amount);
      setPriceLoading(true);

      await writeYourContractAsync({
        functionName: "setPrice",
        args: [priceForm.productId, parseEther(priceForm.amount)],
      });

      setPriceLoading(false);
    } catch (e) {
      console.error("Error setting:", e);
      setPriceLoading(false);
    }
  };

  const { data: tokens } = useScaffoldReadContract({
    contractName: "PopUpStore",
    functionName: "getPaymentTokens",
  });

  const { data: events } = useScaffoldEventHistory({
    contractName: "PopUpStore",
    eventName: "PaymentReceive",
    fromBlock: 1n,
    watch: true,
    //filters: { payersAddress: "0x9eB2C4866aAe575bC88d00DE5061d5063a1bb3aF" },
    blockData: true,
    transactionData: true,
    receiptData: true,
  });

  console.log("tokens: ", tokens);

  return (
    <div className="container mx-auto max-w-6xl py-8 px-8 flex flex-col gap-y-10">
      {" "}
      <h4 className="font-heading text-xl lg:text-3xl">Admin Dashboard</h4>
      <div className="grid grid-cols-3 gap-x-4">
        <div className="max-w-sm border p-4 flex flex-col gap-y-4 bg-base-100">
          <h5 className="font-heading text-xl ">Contract Balance</h5>
          <div className="flex flex-col">
            <h5 className="font-heading text-base ">
              <Balance address={popUpStore?.address} />
            </h5>
            {tokens ? (
              tokens.length > 0 ? (
                tokens.map(({ tokenName }, index) => (
                  <GetBalanceCard tokenName={tokenName} tokenIndex={index} key={index} />
                ))
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
              <TextSelect
                placeholder="Select token to withdraw"
                name="tokenIndex"
                isDarkMode={isDarkMode}
                value={withdrawTokenForm.tokenIndex}
                onChange={onTokenChange}
                tokens={tokens}
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

        <div className="max-w-sm border p-4 flex flex-col  bg-base-100">
          <h5 className="font-heading text-xl">Set Product Price</h5>
          <p className="font-body text-md ">Add product&apos;s price</p>
          <form className="w-full flex flex-col gap-y-2">
            <TextInput
              type="text"
              placeholder="Product Id"
              name="productId"
              isDarkMode={isDarkMode}
              value={priceForm.productId}
              onChange={onPriceChange}
            />
            <TextInput
              type="text"
              placeholder="Price"
              name="amount"
              isDarkMode={isDarkMode}
              value={priceForm.amount}
              onChange={onPriceChange}
            />
            <Button
              text="Update price"
              loading={priceLoading}
              action={() => handleSetPrice()}
              isDarkMode={isDarkMode}
            />
          </form>
        </div>
      </div>
      <div className="flex flex-col gap-y-6">
        <h5 className="font-heading text-xl">Payments Receive</h5>
        {events && events.length > 0 && (
          <PaymentEventTable headerContent={tableHeaders}>
            {events.map(({ args }, index) => (
              <TableBody args={args} index={index} key={index} />
            ))}
          </PaymentEventTable>
        )}
      </div>
    </div>
  );
};

export default Page;
