import React from "react";
import Image from "next/image";

const page = () => {
  return (
    <div className="container mx-auto flex gap-x-8 max-w-4xl py-8">
      <div>
        <Image src="/store/shirt.svg" width={500} height={500} alt="Picture of the author" />
      </div>
      <div className="">
        <h1 className="text-3xl font-bold">ONE LIFE GRAPHIC T-SHIRT</h1>
        <h5 className="text-lg">$260</h5>
        <p className="text-base max-w-2xl">
          This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers
          superior comfort and style.
        </p>
        <div className="w-52">
          <button className="btn btn-md bg-primary w-full shadow-none border-primary">Buy</button>
        </div>
      </div>
    </div>
  );
};

export default page;
