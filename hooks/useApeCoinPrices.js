import axios from "axios";
import { useEffect, useState } from "react";
import { timestampToDate } from "../utils/formatters";

export const useApeCoinPrices = () => {
  const [data, setData] = useState(undefined);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getPrices = async () => {
    try {
      setIsError(false);
      setIsLoading(true);
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/ethereum/contract/0x4d224452801ACEd8B2F0aebE155379bb5D594381/market_chart/?vs_currency=usd&days=max"
      );
      const cleanedData = response.data.prices.map((i) => ({
        priceUSD: i[1],
        unixTimestamp: i[0],
        date: timestampToDate(i[0] / 1000),
        timestamp: i[0] / 1000,
      }));
      setData(cleanedData);
      setIsLoading(false);
      return cleanedData;
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (!data) getPrices();
  // }, [data]);

  return { data, isLoading, isError, getPrices };
};