import Head from "next/head";
import { ApeStaking } from "../components/Staking/ApeStaking";
import { Stack, Flex, Heading, Box, HStack, useDisclosure } from "@chakra-ui/react";
import Image from "next/image";
import { NFTStaking } from "../components/Staking/NFTStaking";
import { CardWrapper } from "../components/Card/CardWrapper";
import { ApeCoinStats } from "../components/ApeCoin/ApeCoinStats";
import { useApeCoinData } from "../hooks/useApeCoinData";
import { ApeCoinChart } from "../components/Charts/ApeCoinChart";
import { NFTVault } from "../components/NFTVault/NFTVault";
import { useAccount } from "wagmi";
import { useUserContext } from "../contexts/User";
import { DoubleLeftChevron } from "../components/Icons/DoubleLeftChevron";
import { NFTVaultSort } from "../components/Buttons/NFTVaultSort";
import { StakeFlow } from "../components/NFTVault/StakeFlow";
import { useStakingData } from "../hooks/useStakingData";
import { Transactions } from "../components/Table/Transactions";
import { FAQ } from "../components/FAQ/FAQ";
import BlueButton from "../components/Buttons/BlueButton";
import { Claim } from "../components/NFTVault/Claim";
import { infoToast } from "./_app";

export default function Home() {
  const userContext = useUserContext();
  const { data, isLoading, isError } = useApeCoinData();
  const { address } = useAccount();
  const { onOpen, onClose, isOpen } = useDisclosure();

  const {
    data: poolData,
    isLoading: poolDataIsLoading,
    isError: poolDataIsError,
  } = useStakingData(userContext?.nftVaultState?.poolId);

  const nftFilter = (i) => {
    if (userContext.nftVaultState.sortType === 0) {
      return i;
    }
    if (userContext.nftVaultState.sortType === 1) {
      return String(i.stakedAmount) !== "0";
    }
    if (userContext.nftVaultState.sortType === 2) {
      return Number(i.stakedAmount) !== Number(userContext.allPools[i.poolId].poolCap);
    }
  };

  const handleSelect = (poolId, tokenId, index) => {
    userContext.nftVaultDispatch({
      type: "HANDLE_POOL",
      payload: poolId,
    });
    userContext.nftVaultDispatch({
      type: "HANDLE_INDEX",
      payload: index,
    });
    if (poolId === "1" || poolId === "2") {
      userContext.nftVaultDispatch({
        type: "HANDLE_MAIN_TOKEN_ID",
        payload: tokenId,
      });
    }
    if (poolId === "3") {
      userContext.nftVaultDispatch({
        type: "HANDLE_DOG",
        payload: tokenId,
      });
    }
  };

  const nftArray =
    userContext?.allStakes?.length > 0 &&
    userContext?.allStakes.filter((i) => i?.poolId !== "0").filter((i) => nftFilter(i));

  const next = () => {
    const currentIndex = userContext?.nftVaultState?.index;
    const maxIndex = nftArray?.length - 1;
    const poolId = currentIndex === maxIndex ? nftArray[0].poolId : nftArray[currentIndex + 1].poolId;
    const tokenId = currentIndex === maxIndex ? nftArray[0].tokenId : nftArray[currentIndex + 1].tokenId;
    const index = currentIndex === maxIndex ? 0 : currentIndex + 1;
    handleSelect(poolId, tokenId, index);
  };

  const prev = () => {
    const currentIndex = userContext?.nftVaultState?.index;
    const maxIndex = nftArray?.length - 1;
    const lowestIndex = 0;
    const poolId =
      currentIndex === lowestIndex ? nftArray[maxIndex].poolId : nftArray[currentIndex - 1].poolId;
    const tokenId =
      currentIndex === lowestIndex ? nftArray[maxIndex].tokenId : nftArray[currentIndex - 1].tokenId;
    const index = currentIndex === lowestIndex ? maxIndex : currentIndex - 1;
    handleSelect(poolId, tokenId, index);
  };

  const openModal = () => {
    if (!address) {
      infoToast("No Wallet Found", "Please connect wallet to claim.");
      return;
    }
    onOpen();
  };

  return (
    <>
      <Head>
        <link rel="preload" href="/images/sign-up-bg.svg" as="image" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://www.apecoinstaking.io/`} />
        <meta property="twitter:title" content="ApeCoin Staking Interface" />
        <meta property="twitter:description" content="" />
        <meta property="twitter:image" content={`https://apecoinstaking.io/ape-coin-twitter-card.png`} />
      </Head>
      <Stack gap="4" px={{ base: "4", md: "6" }} maxW="8xl" mx="auto" pt="10" pb="36">
        <Flex
          flexDirection={{ base: "column", lg: "row" }}
          flexWrap={{ base: "wrap", xl: "nowrap" }}
          gap="4"
          align={{ base: "center", lg: "initial" }}
          justifyContent="center"
        >
          <NFTStaking />
          <ApeStaking />
        </Flex>
        <CardWrapper>
          <HStack
            pt="4"
            pb="8"
            gap="12"
            flexDirection={{ base: "column", md: "row" }}
            align={{ base: "center", xl: "initial" }}
            justifyContent="center"
          >
            <ApeCoinStats w={{ base: "full", md: "50%" }} data={data} isLoading={isLoading} />
            <CardWrapper w={{ base: "full", md: "50%" }}>
              <ApeCoinChart chartData={data?.chartData} />
            </CardWrapper>
          </HStack>

          <CardWrapper minW="full" minH="lg">
            <Stack gap="6" position={"relative"}>
              <Box position="relative" textAlign={"center"}>
                <HStack justifyContent="center" mt={{ base: "-1.5", md: "-3" }}>
                  <Heading
                    textAlign={"center"}
                    fontFamily={"Space Mono, monospace"}
                    w="fit-content"
                    mx="auto"
                  >
                    Your Vault
                    <Box mt={{ md: "-48px", base: "-50px" }}>
                      <svg
                        width="2750"
                        height="67"
                        viewBox="0 0 199 47"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1L28.5 43H174L198 1"
                          stroke="#E6E6E6"
                          strokeOpacity="0.1"
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
                justifyContent={"space-between"}
                position="absolute"
                left="0"
                top={{ base: "14", md: "10", lg: "0" }}
                w="full"
                gap="6"
                flexDirection={{ base: "column", md: "row" }}
              >
                {userContext?.nftVaultState.isStakeFlow ? (
                  <DoubleLeftChevron
                    cursor="pointer"
                    onClick={() => userContext.nftVaultDispatch({ type: "RESET" })}
                  />
                ) : (
                  address && (
                    <BlueButton size={{ base: "sm", md: "md" }} buttonText="Rewards" onClick={openModal} />
                  )
                )}
                {address ? <NFTVaultSort isDisabled={userContext.nftVaultState.isStakeFlow} /> : <Box />}
              </HStack>
              <Stack align={"center"} pt={{ base: "6rem", md: "6", lg: "0" }}>
                {address ? (
                  userContext.nftVaultState.isStakeFlow ? (
                    <StakeFlow
                      next={next}
                      prev={prev}
                      poolData={poolData}
                      poolDataIsLoading={poolDataIsLoading}
                      poolDataIsError={poolDataIsError}
                    />
                  ) : (
                    <NFTVault nftArray={nftArray} handleSelect={handleSelect} />
                  )
                ) : (
                  <Box mt="10" animation={"fadeIn .75s"}>
                    <Image
                      loading="eager"
                      src="/images/spinning-coin.gif"
                      width="300"
                      height="250"
                      priority
                      alt=""
                    />
                    <Box textAlign={"center"} fontFamily={"Space Mono, monospace"}>
                      Connect Wallet To View
                    </Box>
                  </Box>
                )}
              </Stack>
            </Stack>
          </CardWrapper>
          <CardWrapper minH="sm" mt="6">
            <Transactions />
          </CardWrapper>
          {/* <CardWrapper mt="6">
            <FAQ />
          </CardWrapper> */}
        </CardWrapper>
        {isOpen && <Claim isOpen={isOpen} onClose={onClose} />}
      </Stack>
    </>
  );
}
