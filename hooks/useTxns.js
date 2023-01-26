import { ethers } from "ethers";
import { useMemo, useEffect, useState, useRef } from "react";
import { useAccount, useProvider } from "wagmi";
import { STAKING } from "../constants/addresses";
import { STAKING_ABI } from "../constants/abi";
import { useApeCoinData } from "./useApeCoinData";
import { blockClient } from "../apollo/client";
import { GET_TIMESTAMPS_FROM_BLOCK_NUMBERS } from "../apollo/queries";

const events = {
  deposits: ["Deposit", "DepositNft", "DepositPairNft"],
  withdrawals: ["Withdraw", "WithdrawNft", "WithdrawPairNft"],
  claim: ["ClaimRewards", "ClaimRewardsNft", "ClaimRewardsPairNft"],
};

export const useTxns = (type) => {
  const [data, setData] = useState({});
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { getPrices } = useApeCoinData();
  const { address } = useAccount();
  const provider = useProvider();
  const callingRef = useRef(false);
  const addressRef = useRef(address);

  const stakingInstance = useMemo(
    () => new ethers.Contract(STAKING, STAKING_ABI, provider),
    [provider]
  );

  const getTxns = async (isRefresh) => {
    try {
      if (type in data && !isRefresh) return;
      callingRef.current = true;
      setIsError(false);
      setIsLoading(true);
      if (!address) return;
      addressRef.current = address;

      const apeCoinFilter = stakingInstance.filters[events[type][0]](
        address,
        null,
        null
      );
      const nftFilter = stakingInstance.filters[events[type][1]](
        address,
        null,
        null,
        null
      );
      const pairNFTFilter = stakingInstance.filters[events[type][2]](
        address,
        null,
        null,
        null,
        null
      );

      const ApeCoinEvents = stakingInstance.queryFilter(apeCoinFilter);
      const NFTEvents = stakingInstance.queryFilter(nftFilter);
      const PairNFTEvents = stakingInstance.queryFilter(pairNFTFilter);

      let apeEvents = [];
      let nftEvents = [];
      let pairEvents = [];

      const prices = await getPrices();
      let apeData = [];
      let nftData = [];
      let pairData = [];
      Promise.all([ApeCoinEvents, NFTEvents, PairNFTEvents]).then((events) => {
        apeEvents = events[0];
        nftEvents = events[1];
        pairEvents = events[2];

        const apeBlockNumber =
          apeEvents?.length > 0 ? apeEvents?.map((i) => i.blockNumber) : [];
        const nftBlockNumber =
          nftEvents?.length > 0 ? nftEvents?.map((i) => i.blockNumber) : [];
        const nftPairBlockNumber =
          pairEvents?.length > 0 ? pairEvents?.map((i) => i.blockNumber) : [];

        let promises = [];

        promises.push(
          apeBlockNumber.length > 0 &&
            blockClient.query({
              query: GET_TIMESTAMPS_FROM_BLOCK_NUMBERS(apeBlockNumber),
              fetchPolicy: "cache-first",
            }),
          nftBlockNumber.length > 0 &&
            blockClient.query({
              query: GET_TIMESTAMPS_FROM_BLOCK_NUMBERS(nftBlockNumber),
              fetchPolicy: "cache-first",
            }),
          nftPairBlockNumber.length > 0 &&
            blockClient.query({
              query: GET_TIMESTAMPS_FROM_BLOCK_NUMBERS(nftPairBlockNumber),
              fetchPolicy: "cache-first",
            })
        );

        Promise.all(promises)
          .then((timestamps) => {
            let timestampsApe = [];

            if (timestamps[0]) {
              Object.keys(timestamps[0]?.data).forEach((i) =>
                timestampsApe.push(timestamps[0]?.data[i][0]?.timestamp)
              );
            }
            let timestampsNFT = [];
            if (timestamps[1]) {
              Object.keys(timestamps[1]?.data).forEach((i) =>
                timestampsNFT.push(timestamps[1]?.data[i][0]?.timestamp)
              );
            }
            let timestampsPair = [];
            if (timestamps[2]) {
              Object.keys(timestamps[2]?.data).forEach((i) =>
                timestampsPair.push(timestamps[2]?.data[i][0]?.timestamp)
              );
            }
            apeData = apeEvents?.map((i, idx) => ({
              transactionHash: i.transactionHash,
              amount: ethers.utils.formatEther(i.args.amount.toString()),
              timestamp: timestampsApe[idx],
              poolId: "0",
              tokenId: "0",
              mainTokenId: null,
              mainTypePoolId: null,
            }));

            for (let i = 0; i < apeData.length; i++) {
              for (let x = 0; x < prices.length; x++) {
                if (
                  Number(apeData[i].timestamp) - Number(prices[x].timestamp) >=
                    0 &&
                  Number(apeData[i].timestamp) - Number(prices[x].timestamp) <=
                    86400
                ) {
                  apeData[i].priceUSD = prices[x].priceUSD;
                }
              }
            }

            nftData = nftEvents?.map((i, idx) => ({
              transactionHash: i.transactionHash,
              amount: ethers.utils.formatEther(i.args.amount.toString()),
              timestamp: timestampsNFT[idx],
              poolId: i.args.poolId.toString(),
              tokenId: i.args.tokenId.toString(),
              mainTokenId: null,
              mainTypePoolId: null,
            }));

            for (let i = 0; i < nftData.length; i++) {
              for (let x = 0; x < prices.length; x++) {
                if (
                  Number(nftData[i].timestamp) - Number(prices[x].timestamp) >=
                    0 &&
                  Number(nftData[i].timestamp) - Number(prices[x].timestamp) <=
                    86400
                ) {
                  nftData[i].priceUSD = prices[x].priceUSD;
                }
              }
            }

            pairData = pairEvents?.map((i, idx) => ({
              transactionHash: i.transactionHash,
              amount: ethers.utils.formatEther(i.args.amount.toString()),
              timestamp: timestampsPair[idx],
              poolId: "3",
              tokenId: i.args.bakcTokenId.toString(),
              mainTokenId: i.args.mainTokenId.toString(),
              mainTypePoolId: i.args.mainTypePoolId.toString(),
            }));

            for (let i = 0; i < pairData.length; i++) {
              for (let x = 0; x < prices.length; x++) {
                if (
                  Number(pairData[i].timestamp) - Number(prices[x].timestamp) >=
                    0 &&
                  Number(pairData[i].timestamp) - Number(prices[x].timestamp) <=
                    86400
                ) {
                  pairData[i].priceUSD = prices[x].priceUSD;
                }
              }
            }

            const combinedData = apeData.concat(nftData).concat(pairData);
            setData({ ...data, [type]: combinedData });
            setIsLoading(false);
            callingRef.current = false;
          })
          .catch((e) => {
            callingRef.current = false;
            console.log(e);
            setIsLoading(false);
            setIsError(true);
          });
      });
    } catch (error) {
      callingRef.current = false;
      setIsLoading(false);
      setIsError(true);
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      address &&
      (!(type in data) || addressRef.current !== address) &&
      !callingRef.current
    ) {
      getTxns();
    }
  }, [data, address, type]);

  return { data, isLoading, isError, getTxns };
};
