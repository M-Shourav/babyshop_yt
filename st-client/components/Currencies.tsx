"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const Currencies = () => {
  const [currency, setCurrency] = useState("USD");
  return (
    <Select
      onValueChange={(value) => {
        setCurrency(value);
      }}
    >
      <SelectTrigger className="w-[80px] data-[placeholder]:text-white">
        <SelectValue placeholder={currency} className="text-white" />
      </SelectTrigger>
      <SelectContent className="min-w-[40px]">
        <SelectGroup>
          <SelectLabel>Currencies</SelectLabel>
          <SelectItem value="usd">USD</SelectItem>
          <SelectItem value="bdt">BDT</SelectItem>
          <SelectItem value="inr">INR</SelectItem>
          <SelectItem value="eur">EUR</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default Currencies;
