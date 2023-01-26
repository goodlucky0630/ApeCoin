import { BigNumber, ethers } from "ethers";
import { useAccount, useProvider } from "wagmi";
import { useMemo, useEffect, useState, useRef } from "react";
import { STAKING } from "../constants/addresses";
import { STAKING_ABI } from "../constants/abi";

export const useGetAllStakes = () => {
  const [data, setData] = useState(undefined);
  const provider = useProvider();
  const { address } = useAccount();
  const stakingInstance = useMemo(() => new ethers.Contract(STAKING, STAKING_ABI, provider), [provider]);

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const addressRef = useRef(address);

  const getAllStakes = async () => {
    try {
      setIsError(false);
      setIsLoading(true);
      addressRef.current = address;
      const allStakes = stakingInstance.getAllStakes(address);
      const apeClaimedFilter = stakingInstance.filters.ClaimRewards(address, null, null);
      const apeClaimedEvents = stakingInstance.queryFilter(apeClaimedFilter);

      Promise.all([allStakes, apeClaimedEvents]).then((promise) => {
        let totalApeClaimedInApePool = BigNumber.from("0");
        promise[1].map((i) => (totalApeClaimedInApePool = totalApeClaimedInApePool.add(i.args.amount)));
        const cleanedAllStakes = promise[0].map((i) => ({
          poolId: i.poolId.toString(),
          tokenId: i.tokenId.toString(),
          stakedAmount: i.deposited.toString(),
          claimableAmount: i.unclaimed.toString(),
          rewards24hr: i.rewards24hr.toString(),
          mainTypePoolId: i.pair.mainTypePoolId.toString(),
          mainTokenId: i.pair.mainTokenId.toString(),
          apeClaimed: i.poolId.toString() === "0" ? totalApeClaimedInApePool.toString() : null,
        }));
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
    if (address && stakingInstance.provider !== null && (!data || addressRef.current !== address)) {
      getAllStakes();
    }
  }, [address, stakingInstance, data]);

  return { data, isLoading, isError, getAllStakes };
};
