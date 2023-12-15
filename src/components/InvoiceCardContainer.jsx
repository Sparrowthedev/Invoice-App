import { useState } from "react";
import Invoicecard from "./Invoicecard";

const InvoiceCardContainer = ({ billData }) => {
  return (
    <>
      <div className="w-[100%] lg:w-[85%] ml-0 lg:ml-[10rem] px-[1rem] lg:px-[4rem] md:mb-14 mb-[5rem]">
        {billData === null ? (
          <div className="p-5 bg-[#7B5EF8] text-white font-bold text-center md:w-[400px] rounded-lg my-0 mx-auto">
            <p>Sorry you don't have any invoice</p>
          </div>
        ) : (
          <Invoicecard billData={billData} />
        )}
      </div>
    </>
  );
};

export default InvoiceCardContainer;
