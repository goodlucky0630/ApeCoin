import { BigNumber, ethers } from "ethers";
import { useProvider } from "wagmi";
import { useMemo, useEffect, useState, useRef } from "react";
import { AUTO_COMPOUND, STAKING } from "../constants/addresses";
import { STAKING_ABI } from "../constants/abi";

export const useCompoundingData = () => {
  const provider = useProvider();
  const [data, setData] = useState(undefined);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const stakingInstance = useMemo(() => new ethers.Contract(STAKING, STAKING_ABI, provider), [provider]);

  const getCompoundedStakes = async () => {
    try {
      setIsError(false);
      setIsLoading(true);
      const apeStakes = stakingInstance.getApeCoinStake(AUTO_COMPOUND);
      const apeClaimedFilter = stakingInstance.filters.ClaimRewards(AUTO_COMPOUND, null, null);
      const apeClaimedEvents = stakingInstance.queryFilter(apeClaimedFilter);

      Promise.all([apeStakes, apeClaimedEvents]).then((promise) => {
        let totalCompounded = BigNumber.from("0");
        promise[1].map((i) => (totalCompounded = totalCompounded.add(i.args.amount)));

        const cleanedAllStakes = {
          stakedAmount: promise[0].deposited.toString(),
          claimableAmount: promise[0].unclaimed.toString(),
          rewards24hr: promise[0].rewards24hr.toString(),
          totalCompounded: totalCompounded.toString(),
        };
        setData(cleanedAllStakes);
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      console.log(error);
    }
  };

  useEffect(() => {
    if (stakingInstance.provider !== null && !data) {
      getCompoundedStakes();
    }
  }, [stakingInstance, data]);

  return { data, isLoading, isError, getCompoundedStakes };
};
