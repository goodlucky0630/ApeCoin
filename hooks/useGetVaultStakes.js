import { BigNumber, ethers } from "ethers";
import { useAccount, useProvider } from "wagmi";
import { useMemo, useEffect, useState, useRef } from "react";
import { STAKING } from "../constants/addresses";
import { STAKING_ABI } from "../constants/abi";
import { isAddress } from "ethers/lib/utils";

export const useGetVaultStakes = (vaultAddress) => {
  const [data, setData] = useState(undefined);
  const provider = useProvider();
  const stakingInstance = useMemo(
    () => new ethers.Contract(STAKING, STAKING_ABI, provider),
    [provider]
  );
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const addressRef = useRef(vaultAddress);

  const getVaultStakes = async () => {
    try {
      setIsError(false);
      setIsLoading(true);
      addressRef.current = vaultAddress;
      const allStakes = stakingInstance.getAllStakes(vaultAddress);
      const apeClaimedFilter = stakingInstance.filters.ClaimRewards(
        vaultAddress,
        null,
        null
      );
      const apeClaimedEvents = stakingInstance.queryFilter(apeClaimedFilter);

      Promise.all([allStakes, apeClaimedEvents]).then((promise) => {
        let totalApeClaimedInApePool = BigNumber.from("0");
        promise[1].map(
          (i) =>
            (totalApeClaimedInApePool = totalApeClaimedInApePool.add(
              i.args.amount
            ))
        );
        const cleanedAllStakes = promise[0].map((i) => ({
          poolId: i.poolId.toString(),
          tokenId: i.tokenId.toString(),
          stakedAmount: i.deposited.toString(),
          claimableAmount: i.unclaimed.toString(),
          rewards24hr: i.rewards24hr.toString(),
          mainTypePoolId: i.pair.mainTypePoolId.toString(),
          mainTokenId: i.pair.mainTokenId.toString(),
          apeClaimed:
            i.poolId.toString() === "0"
              ? totalApeClaimedInApePool.toString()
              : null,
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
    if (
      vaultAddress &&
      isAddress(vaultAddress) &&
      stakingInstance.provider !== null &&
      (!data || addressRef.current !== vaultAddress)
    ) {
      getVaultStakes();
    }
  }, [vaultAddress, stakingInstance, data]);

  return { data, isLoading, isError, getVaultStakes };
};
