"use client";

import { useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { parseEther } from "viem";
import { TextInput, TextSelect } from "~~/components/pop-up-store/molecules/Form";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const page = () => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("PopUpStore");

  const [addTokenLoading, setPaymentLoading] = useState<boolean>(false);

  const { data: tokens } = useScaffoldReadContract({
    contractName: "PopUpStore",
    functionName: "getPaymentTokens",
  });

  const [paymentForm, setPaymentForm] = useState<{ tokenName: string }>({
    tokenName: "",
  });

  const onTokenChange = (value: string, formKey: string) => {
    setPaymentForm(form => ({ ...form, [formKey]: value }));
  };

  const handlePayment = async () => {
    try {
      console.log("form values: ", paymentForm);

      if (paymentForm.tokenName) {
        setPaymentLoading(true);
        const trxRef = await writeYourContractAsync({
          functionName: "payForProduct",
          args: [parseEther("50"), paymentForm.tokenName, "3627873bfdnfdnfnoifoiieefifeoioe"],
        });

        if (trxRef) {
          console.log("payment successful");
        }

        setPaymentLoading(false);
      }
    } catch (e) {
      console.error("Error setting:", e);
      setPaymentLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-8">
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 ">
        <div className="relative w-full h-[300px] lg:h-[400px]">
          <img className="w-full h-full object-cover" alt="art work" width={400} height={400} src="/store/shirt.jpg" />
        </div>
        <div className="">
          <h4 className="font-heading text-xl opacity-80">
            Vamtac Graphic Tees Mens Vintage Oversized T Shirts Half Sleeve Boxy Baggy Loose Streetwear
          </h4>
          <p className="font-body text-2xl">$59.99</p>
          <p className="text-body text-lg">About this item</p>
          <p className="text-body">
            Soft and comfortable: Made of 100% pure cotton, this t shirt is soft, lightweight and comfortable to wear.
            The natural material is breathable, helping to regulate body temperature and preventing sweat buildup.
            Graphic T Shirts: The fashion element of this oversized t shirt is butterfly print, it is funny and cute,
            popular among young people, also a great gift. Oversized Shirts: The shirt's oversized fit is loose and
            relaxed, providing maximum comfort and allowing for easy
          </p>

          <div className="flex flex-col gap-y-2">
            <TextSelect
              type="text"
              placeholder="Token name"
              name="tokenName"
              isDarkMode={isDarkMode}
              value={paymentForm.tokenName}
              onChange={onTokenChange}
              tokens={tokens}
            />
            <Button text="Pay Now" isDarkMode={isDarkMode} loading={addTokenLoading} action={() => handlePayment()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Button = ({
  text,
  padding,
  loading = false,
  action,
  isDarkMode,
}: {
  text: string;
  padding?: string;
  loading?: boolean;
  action?: () => Promise<void> | (() => void);
  isDarkMode: boolean;
}) => {
  return (
    <div>
      <div>
        <button
          type="button"
          onClick={action}
          className={`button border ${
            isDarkMode
              ? " border-white hover:bg-white hover:text-black"
              : " border-black hover:bg-black hover:text-white"
          } font-heading w-full h-10 text-md ${padding} transition-all duration-500`}
        >
          {loading ? (
            <div>
              <span className="w-6 loading loading-spinner"></span>
            </div>
          ) : (
            text
          )}
        </button>
      </div>
    </div>
  );
};

export default page;
