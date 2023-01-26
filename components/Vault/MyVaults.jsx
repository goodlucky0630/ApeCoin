import { Box, Heading, HStack, SimpleGrid, Flex, Spinner, Stack } from "@chakra-ui/react";
import { CardWrapper } from "../../components/Card/CardWrapper";
import BlueButton from "../../components/Buttons/BlueButton";
import { AddIcon } from "@chakra-ui/icons";
import { VaultCard } from "./VaultCard";
import { useMemo } from "react";
import { ethers } from "ethers";
import { VAULT_FACTORY } from "../../constants/addresses";
import { VAULT_FACTORY_ABI } from "../../constants/abi";
import { chain, useAccount, useNetwork, useSigner } from "wagmi";
import { useState } from "react";
import { errorToast, infoToast, successToast } from "../../pages/_app";
import { CHAIN } from "../../constants/chain";
import { useVaults } from "../../hooks/useVaults";
import Image from "next/image";

export const MyVaults = () => {
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const vaultFactoryInstance = useMemo(
    () => new ethers.Contract(VAULT_FACTORY, VAULT_FACTORY_ABI, signer),
    [signer]
  );
  const [isCreating, setIsCreating] = useState(false);
  const { data, isLoading, getVaults } = useVaults();

  const createVault = async () => {
    if (!signer) {
      infoToast("No Wallet Found", "Please connect wallet to create vault.");
      return;
    }
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet");
      return;
    }
    try {
      setIsCreating(true);
      const createVault = await vaultFactoryInstance.initializeBundle(address);
      const result = await createVault.wait();
      if (result.status === 1) {
        await getVaults(true);
        await getVaults(true);
        setIsCreating(false);
        successToast("Successfully Created Vault!");
      }
    } catch (error) {
      setIsCreating(false);
      errorToast("An Error Occurred", "An error occurred creating vault.");
      console.log(error);
    }
  };

  const vaultFilter = (i) => {
    if (i.isWithdrawEnabled) {
      return (
        i.owner?.toLowerCase() === address?.toLowerCase() &&
        (Number(i.apeCoinBalance) !== 0 || i.inventory.length > 0)
      );
    }
    return i.owner?.toLowerCase() === address?.toLowerCase();
  };

  return (
    <CardWrapper maxW="6xl" mx="auto" minH="lg">
      <Box position="relative" textAlign={"center"}>
        <HStack justifyContent="center" mt="-3">
          <Heading fontSize="3xl" fontFamily={"Space Mono, monospace"}>
            My Vaults
            <Box mt={{ md: "-48px", base: "-50px" }}>
              <svg
                width="250"
                height="67"
                viewBox="0 0 199 42"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L28.5 43H174L198 1"
                  stroke="#E6E6E6"
                  strokeOpacity="0.2"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>
          </Heading>
        </HStack>
      </Box>
      <HStack
        w="full"
        align="start"
        justify={{ base: "center", md: "end" }}
        mt={{ base: "2", lg: "-8" }}
        h="fit-content"
        pb="4"
      >
        {signer && (
          <BlueButton
            onClick={createVault}
            buttonText="Create a New Vault"
            leftIcon={!isCreating ? <AddIcon /> : null}
            isLoading={isCreating}
            loadingText="Creating Vault"
          />
        )}
      </HStack>
      {!address && (
        <Flex justifyContent={"center"} mt="4rem">
          <Box animation={"fadeIn .75s"}>
            <Image loading="eager" src="/images/spinning-coin.gif" width="300" height="250" priority alt="" />
            <Box textAlign={"center"} fontFamily={"Space Mono, monospace"}>
              Connect Wallet To View
            </Box>
          </Box>
        </Flex>
      )}

      {address && !isLoading && data && data?.filter((i) => vaultFilter(i)).length === 0 && (
        <Flex justifyContent="center" align="center">
          <Box>No Vaults Found.</Box>
        </Flex>
      )}

      {address && isLoading && (
        <Flex justifyContent={"center"}>
          <Spinner size={"xl"} color="#FF0083" mt="10rem" />
        </Flex>
      )}

      {address && !isLoading && data && data?.filter((i) => vaultFilter(i)).length > 0 && (
        <SimpleGrid
          h="lg"
          overflowY={"auto"}
          sx={{
            "&::-webkit-scrollbar": {
              width: "2px",
              height: "2px",
              borderRadius: "2px",
              backgroundColor: `rgba(0, 0, 0, 0.05)`,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: `white`,
              borderRadius: "8px",
            },
          }}
          pt="6"
          px="4"
          columns={{ base: 1, md: 2 }}
          gap="6"
        >
          {data
            ?.filter((i) => vaultFilter(i))
            .map((i, idx) => (
              <VaultCard key={idx} isMyVaults={true} vault={i} getVaults={getVaults} />
            ))}
        </SimpleGrid>
      )}
    </CardWrapper>
  );
};
