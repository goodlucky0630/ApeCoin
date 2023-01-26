import Head from "next/head";
import { Stack, Box } from "@chakra-ui/react";
import { CardWrapper } from "../../components/Card/CardWrapper";
import { HStack } from "@chakra-ui/react";
import { Transactions } from "../../components/Table/Transactions";
import { ApeCoinChart } from "../../components/Charts/ApeCoinChart";
import { ApeCoinStats } from "../../components/ApeCoin/ApeCoinStats";
import { useApeCoinData } from "../../hooks/useApeCoinData";
import { AutoCompoundComp } from "../../components/AutoCompound/AutoCompoundComp";

export default function AutoCompound() {
  const { data, isLoading, isError } = useApeCoinData();

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
      <Stack px={{ base: "2", md: "8" }} spacing="8" maxW="8xl" mx="auto" pt="8" pb="36" pos="relative">
        <AutoCompoundComp />
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
          <CardWrapper minH="sm" mt="6">
            <Transactions />
          </CardWrapper>
        </CardWrapper>
      </Stack>
    </>
  );
}
