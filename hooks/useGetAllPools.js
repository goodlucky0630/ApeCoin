import { ethers } from "ethers";
import { useProvider } from "wagmi";
import { useMemo, useEffect, useState } from "react";
import { STAKING } from "../constants/addresses";
import { STAKING_ABI } from "../constants/abi";
const bigDecimal = require("js-big-decimal");

export const useGetAllPools = () => {
  const [data, setData] = useState(undefined);
  const provider = useProvider();
  const stakingInstance = useMemo(
    () => new ethers.Contract(STAKING, STAKING_ABI, provider),
    [provider]
  );

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getAllPools = async () => {
    try {
      setIsError(false);
      setIsLoading(true);
      const pools = await stakingInstance.getPoolsUI();

      const cleanedPools = pools.map((i) => {
        const apy = calcAPY(
          ethers.utils.formatEther(
            i.currentTimeRange.rewardsPerHour.toString()
          ),
          ethers.utils.formatEther(i.stakedAmount.toString())
        );
        return {
          poolId: i.poolId.toString(),
          stakedAmount: i.stakedAmount.toString(),
          poolCap: i.currentTimeRange.capPerPosition.toString(),
          endTimestamp: i.currentTimeRange.endTimestampHour.toString(),
          startTimestamp: i.currentTimeRange.startTimestampHour.toString(),
          rewardsPerHour: i.currentTimeRange.rewardsPerHour.toString(),
          apy: apy,
        };
      });
      
      setData(cleanedPools);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      console.log(error);
    }
  };

  const calcAPY = (ratePerHour, amountInPool) => {
    const ratePerDay = bigDecimal.multiply(ratePerHour, "24");
    const ratePerYear = bigDecimal.multiply(ratePerDay, "365");
    const apy = bigDecimal.multiply(
      bigDecimal.divide(ratePerYear, amountInPool),
      "100"
    );
    return apy;
  };

  useEffect(() => {
    if (stakingInstance.provider !== null && !data) getAllPools();
  }, [stakingInstance, data]);

  return { data, isLoading, isError, getAllPools };
};
