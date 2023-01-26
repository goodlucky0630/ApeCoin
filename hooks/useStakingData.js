import { ethers } from "ethers";
import { useProvider } from "wagmi";
import { useMemo, useEffect, useState, useRef } from "react";
import { STAKING } from "../constants/addresses";
import { STAKING_ABI } from "../constants/abi";
import { blockClient } from "../apollo/client";
import { GET_TIMESTAMPS_FROM_BLOCK_NUMBERS } from "../apollo/queries";
import { timestampToDate, roundNum } from "../utils/formatters";

const pool = ["0x0", "0x1", "0x2", "0x3"];

export const useStakingData = (poolId) => {
  const [data, setData] = useState({
    0: undefined,
    1: undefined,
    2: undefined,
    3: undefined,
  });
  const provider = useProvider();
  const stakingInstance = useMemo(
    () => new ethers.Contract(STAKING, STAKING_ABI, provider),
    [provider]
  );
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const poolIdRef = useRef(poolId);

  const getStakingData = async () => {
    try {
      poolIdRef.current = poolId;
      if (data[poolId]) {
        return;
      }
      setIsError(false);
      setIsLoading(true);

      const eventFilterPool = stakingInstance.filters.UpdatePool(
        pool[poolId],
        null,
        null,
        null
      );
      const poolEvents = await stakingInstance.queryFilter(eventFilterPool);
      const blockNumbers = poolEvents.map((i) => i.blockNumber);
      const timestamps =
        blockNumbers.length > 0 &&
        (await blockClient.query({
          query: GET_TIMESTAMPS_FROM_BLOCK_NUMBERS(blockNumbers),
          fetchPolicy: "cache-first",
        }));

      let timestampArray = [];
      if (timestamps) {
        Object.keys(timestamps.data).forEach((i) =>
          timestampArray.push(timestamps.data[i][0].timestamp)
        );
      }

      if (timestampArray.length === 0) {
        //can remove after rewards start
        setData({
          ...data,
          [poolId]: [],
        });
        setIsLoading(false);
        return;
      }

      const dates = timestampArray.map((i) => timestampToDate(i));
      const stakedAmount = poolEvents.map((i) =>
        roundNum(ethers.utils.formatEther(i.args.stakedAmount.toString()), 4)
      );

      const accumulatedRewardsPerShare = poolEvents.map((i) =>
        roundNum(
          ethers.utils.formatEther(
            i.args.accumulatedRewardsPerShare.toString()
          ),
          4
        )
      );

      const poolData = stakedAmount.map((amount, idx) => ({
        date: dates[idx],
        timestamp: timestampArray[idx],
        amount: amount,
        accumulatedRewardsPerShare: accumulatedRewardsPerShare[idx],
      }));
      setData({ ...data, [poolId]: poolData });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      stakingInstance.provider !== null &&
      (!data[0] || poolIdRef.current !== poolId) //!data[0] b/c starting on 0 in component
    )
      getStakingData();
  }, [stakingInstance, data, poolId]);

  return { data, isLoading, isError, getStakingData };
};
