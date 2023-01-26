import axios from "axios";
import { ethers } from "ethers";
import { useEffect, useRef, useState } from "react";
import { useProvider } from "wagmi";
import { ERC20_ABI } from "../constants/abi";
import { APECOIN, STAKING } from "../constants/addresses";
import { timestampToDate } from "../utils/formatters";
import { GET_APE_HOLDER_COUNT } from "../apollo/queries";
import { holderClient } from "../apollo/client";
const bigDecimal = require("js-big-decimal");

export const useApeCoinData = () => {
  const [data, setData] = useState(undefined);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const callingRef = useRef(false);
  const provider = useProvider();

  const getPrices = async () => {
    try {
      callingRef.current = true;
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

      const price = response.data.prices[response.data.prices.length - 1][1].toFixed(2);
      const totalSupply = "1000000000";

      const marketCap = bigDecimal.multiply(price, totalSupply);
      const instance = new ethers.Contract(APECOIN, ERC20_ABI, provider);
      const totalStaked = await instance.balanceOf(STAKING);

      const percentStaked = bigDecimal.multiply(
        bigDecimal.divide(String(ethers.utils.formatEther(totalStaked.toString())), totalSupply),
        "100"
      );

      const holderCount = await holderClient.query({
        query: GET_APE_HOLDER_COUNT,
        fetchPolicy: "cache-first",
      });

      setData({
        chartData: cleanedData,
        currentPrice: price,
        volume24hr: response.data.total_volumes[response.data.total_volumes.length - 1][1],
        marketCap: marketCap,
        holderCount: holderCount?.data?.token?.holders,
        percentStaked: percentStaked,
      });

      setIsLoading(false);
      callingRef.current = false;
      return cleanedData;
    } catch (error) {
      callingRef.current = false;
      setIsLoading(false);
      setIsError(true);
      console.log(error);
    }
  };

  useEffect(() => {
    if (!data && !callingRef.current && provider) getPrices();
  }, [data, provider]);

  return { data, isLoading, isError, getPrices };
};
