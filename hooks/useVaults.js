import { ethers } from "ethers";
import { useMemo, useEffect, useState, useRef } from "react";
import { useProvider } from "wagmi";
import { APECOIN, INVENTORY_REPORTER, VAULT_FACTORY } from "../constants/addresses";
import { ASSET_VAULT_ABI, ERC20_ABI, INVENTORY_REPORTER_ABI, VAULT_FACTORY_ABI } from "../constants/abi";
import { Multicall } from "ethereum-multicall";
import axios from "axios";
import { Interface } from "ethers/lib/utils";
import cache from "memory-cache";

export const useVaults = () => {
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const provider = useProvider();
  const vaultFactoryInstance = useMemo(
    () => new ethers.Contract(VAULT_FACTORY, VAULT_FACTORY_ABI, provider),
    [provider]
  );
  const callingRef = useRef(false);

  const getVaults = async (getFresh) => {
    try {
      callingRef.current = true;
      setIsLoading(true);
      setIsError(false);

      // const vaultCreatedFilter = vaultFactoryInstance.filters.VaultCreated(
      //   null,
      //   null
      // );

      // const vaultCreatedFilter1 = vaultFactoryInstance.filters.Transfer(
      //   null,
      //   null,
      //   null
      // );

      // const events = await vaultFactoryInstance.queryFilter(vaultCreatedFilter);
      // if (events.length === 0) {
      //   setData([]);
      //   setIsLoading(false);
      //   return;
      // }

      // const events1 = await vaultFactoryInstance.queryFilter(
      //   vaultCreatedFilter1
      // );

      // let allVaultsAndOwners = events.map((i) => ({
      //   vault: i.args.vault,
      //   owner: i.args.to,
      // }));

      // for (let i = 0; i < events.length; i++) {
      //   for (let x = 0; x < events1.length; x++) {
      //     if (events[i].transactionHash === events1[x].transactionHash) {
      //       allVaultsAndOwners[i].vaultTokenId = events1[x].args[2].toString();
      //     }
      //   }
      // }

      // const calls = allVaultsAndOwners.map((i, idx) => ({
      //   reference: `isInstance${idx}`,
      //   methodName: "isInstance(address)",
      //   methodParameters: [i.vault],
      // }));

      const multicall = new Multicall({
        ethersProvider: provider,
        tryAggregate: true,
      });

      // const contractCallContext = {
      //   reference: "VaultFactory",
      //   contractAddress: VAULT_FACTORY,
      //   abi: VAULT_FACTORY_ABI,
      //   calls: [...calls],
      // };
      // //get vaultTokenId as well so it can approve OriginationController

      // const results = await multicall.call(contractCallContext);

      // const isInstanceArray =
      //   results.results.VaultFactory.callsReturnContext.map((i) => ({
      //     vault: i.methodParameters[0],
      //     isValid: i.returnValues[0],
      //   }));

      // for (let i = 0; i < allVaultsAndOwners.length; i++) {
      //   if (
      //     isInstanceArray[i].vault.toLowerCase() ===
      //     allVaultsAndOwners[i].vault.toLowerCase()
      //   ) {
      //     allVaultsAndOwners[i].exists = isInstanceArray[i].isValid;
      //   }
      // }

      // allVaultsAndOwners = allVaultsAndOwners.filter((i) => i.exists);
      const response = await axios.get("/api/allVaults");

      let cachedResponse = cache.get(`/api/allVaults`);

      if (getFresh) {
        cachedResponse = [];
      }
      //after minting vault moralis data is fully fresh =>figure that out

      let allVaultsAndOwners = response.data.allVaults;

      if (cachedResponse?.length === allVaultsAndOwners?.length) {
        setData(cachedResponse);
        setIsLoading(false);
        return;
      }

      if (allVaultsAndOwners?.length === 0) {
        setData([]);
        setIsLoading(false);
        return;
      }

      const contractCallContext1 = allVaultsAndOwners?.map((i, idx) => ({
        reference: `AssetVault${idx}`,
        contractAddress: i.vault,
        abi: ASSET_VAULT_ABI,
        calls: [
          {
            reference: `withdrawEnabled${idx}`,
            methodName: "withdrawEnabled()",
            methodParameters: [],
          },
          {
            reference: `owner${idx}`,
            methodName: "owner()",
            methodParameters: [],
          },
        ],
      }));

      const results1 = await multicall.call([...contractCallContext1]);

      for (let i = 0; i < allVaultsAndOwners.length; i++) {
        let ref = `AssetVault${i}`;
        allVaultsAndOwners[i].isWithdrawEnabled = results1.results[ref].callsReturnContext[0].returnValues[0];
        allVaultsAndOwners[i].owner = results1.results[ref].callsReturnContext[1].returnValues[0];
      }

      for (let i = 0; i < allVaultsAndOwners.length; i++) {
        const res = await axios.get("/api/vault", {
          params: { vault: allVaultsAndOwners[i].vault },
        });
        allVaultsAndOwners[i].inventory = res.data;
      }

      const calls2 = allVaultsAndOwners.map((i, idx) => ({
        reference: `balanceOf${idx}`,
        methodName: "balanceOf(address)",
        methodParameters: [i.vault],
      }));

      const contractCallContext2 = {
        reference: "ApeCoin",
        contractAddress: APECOIN,
        abi: ERC20_ABI,
        calls: [...calls2],
      };

      const results2 = await multicall.call(contractCallContext2);

      for (let i = 0; i < allVaultsAndOwners.length; i++) {
        allVaultsAndOwners[i].apeCoinBalance =
          results2.results.ApeCoin.callsReturnContext[i].returnValues[0].hex;
      }
      setData(allVaultsAndOwners);
      setIsLoading(false);
      cache.put(`/api/allVaults`, allVaultsAndOwners, 24 * 1000 * 60 * 60); //24 hours
      callingRef.current = false;
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      console.log(error);
    }
  };

  useEffect(() => {
    if (!data && !callingRef.current) {
      getVaults(false);
    }
  }, [data]);

  return { data, isLoading, isError, getVaults };
};
