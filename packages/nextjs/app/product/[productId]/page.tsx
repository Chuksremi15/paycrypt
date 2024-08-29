"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

const page = () => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  return (
    <div className="container mx-auto max-w-4xl py-8 px-8">
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:mt-[0px]">
        <div className="row-start-2 lg:row-start-1">
          <h4 className="font-heading text-xl leading-[30px] lg:max-w-[750px] lg:text-[55px] lg:leading-[75px]">
            GRAPHIC T-SHIRT
          </h4>
          <div className="mt-3 text-xl tracking-wide lg:mt-5 lg:text-2xl">
            <span className="text-[12px] font-normal lg:text-[20px]">By</span> Chukwuma Didi
          </div>
          <i className="text-[12px] font-normal lg:text-[17px]">Acrylic canvas</i>
          <div className="my-2 text-[12px]  lg:my-3 lg:text-[17px]">100 X 180cm 44 X 70 in</div>
          <div>
            <div className="mt-[24px] max-w-[400px] text-[14px] lg:mt-[34px] lg:text-[20px] lg:leading-[25px]">
              <p className="text-[15px] lg:text-[18px]">About this artwork</p>
              <p className="pt-4">
                <b className="font-heading">"Ashes Dance" </b>
                In this captivating masterpiece, we are transported to an epic universe of romance, where love and
                nature intertwine in a harmonious dance. Each brushstroke and color palette are a celebration of these
                timeless forces, weaving a narrative that transcends time and space.
              </p>
            </div>
            <div className="mt-4 mb-10 lg:my-3 lg:mt-0 lg:mb-0">
              <p className="font-heading text-[18px] lg:text-[30px]">$50</p>
            </div>
            <Button text="Pay Now" isDarkMode={isDarkMode} />
          </div>
        </div>
        <div className="relative w-full h-[300px] lg:h-[650px]">
          <img className="w-full h-full " alt="art work" width={400} height={400} src="/store/artwork.png" />
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
  action?: () => void;
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
