"use client";

import React, { InputHTMLAttributes, ReactNode, ReactPortal } from "react";
import { Button } from "../product/[productId]/page";
import { useTheme } from "next-themes";

const tableHeaders = [
  { title: "S/N", width: "30%" },
  { title: "Name", width: "30%" },
  { title: "Email address", width: "30%" },
  { title: "Amount", width: "30%" },
  { title: "Status", width: "30%" },
  { title: "Date", width: "30%" },
];

const latestOrderData = [
  {
    sn: 3051,
    name: "Bate Lane",
    email: "bate@kjart.com",
    amount: "100,000,000,000",
    status: "Delivered",
    date: "09.09.24",
  },
  {
    sn: 3051,
    name: "Bate Lane",
    email: "bate@kjart.com",
    amount: "100,000",
    status: "Delivered",
    date: "09.09.24",
  },
  {
    sn: 3051,
    name: "Bate Lane",
    email: "bate@kjart.com",
    amount: "100,000",
    status: "Delivered",
    date: "09.09.24",
  },
  {
    sn: 3051,
    name: "Bate Lane",
    email: "bate@kjart.com",
    amount: "100,000",
    status: "Delivered",
    date: "09.09.24",
  },
];

const page = () => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  return (
    <div className="container mx-auto max-w-4xl py-8 px-8 flex flex-col gap-y-10">
      {" "}
      <h4 className="font-heading text-xl  lg:text-5xl">Admin Dashboard</h4>
      <div className="grid grid-cols-2 gap-x-4">
        <div className="max-w-sm border p-4 flex flex-col gap-y-4 bg-base-100">
          <h5 className="font-heading text-xl ">Contract Balance</h5>
          <div className="flex flex-col">
            <h5 className="font-heading text-lg ">USDT: $400</h5>
            <h5 className="font-heading text-lg ">ETH: $400</h5>
          </div>

          <div>
            <form className="w-full flex flex-col gap-y-2">
              <Input inputType="text" inputPlaceholder="Token name" isDarkMode={isDarkMode} />
              <Input inputType="number" inputPlaceholder="Amount" isDarkMode={isDarkMode} />
              <Button text="Withdraw" isDarkMode={isDarkMode} />
            </form>
          </div>
        </div>
        <div className="max-w-sm border p-4 flex flex-col  bg-base-100">
          <h5 className="font-heading text-xl">Add Token for payment</h5>
          <p className="font-body text-md ">Add ERC20 token you intend to accept payments in</p>
          <form className="w-full flex flex-col gap-y-2">
            <Input inputType="text" inputPlaceholder="Token name" isDarkMode={isDarkMode} />
            <Input inputType="text" inputPlaceholder="Token address" isDarkMode={isDarkMode} />
            <Button text="Add token" isDarkMode={isDarkMode} />
          </form>
        </div>
      </div>
      <div className="flex flex-col gap-y-6">
        <h5 className="font-heading text-xl">Payments Receive</h5>
        <AdminTable headerContent={tableHeaders}>
          {latestOrderData.map((item, index) => (
            <tr className="border-b" key={index}>
              <td className="whitespace-nowrap p-4 ">{item.sn}</td>
              <td className="whitespace-nowrap p-4 ">{item.name}</td>
              <td className="p-4"> {item.email}</td>
              <td className="p-4 whitespace-nowrap"># {item.amount}</td>
              <td className="p-4">{item.date}</td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </div>
  );
};

const Input = ({
  inputType,
  inputName,
  inputValue,
  inputPlaceholder,
  onChange,
  isDarkMode,
}: {
  inputType: React.HTMLInputTypeAttribute;
  inputName: string;
  inputValue: string | number;
  inputPlaceholder: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  isDarkMode: boolean;
}) => {
  return (
    <div>
      <input
        type={inputType}
        name={inputName}
        placeholder={inputPlaceholder}
        onChange={onChange}
        value={inputValue}
        className={`w-full ${
          isDarkMode ? "border border-white " : "border border-black"
        } rounded-none py-3 px-4  bg-base-200  text-md focus:outline-none  transition-all duration-500`}
        autoComplete="off"
      />
    </div>
  );
};

const AdminTable = ({
  headerContent,
  children,
}: {
  headerContent: { title: string; width: string }[];
  children: Iterable<ReactNode>;
}) => {
  return (
    <table>
      <thead>
        <tr className="bg-base-300 border-b">
          {headerContent.map(({ title, width }, index) => (
            <th
              scope="col"
              key={index}
              className="text-start p-4 text-[15px] whitespace-nowrap"
              style={{
                width: width,
              }}
            >
              {title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
};

export default page;
