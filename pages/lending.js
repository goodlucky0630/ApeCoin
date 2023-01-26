import Head from "next/head";
import { Stack } from "@chakra-ui/react";
import { CardWrapper } from "../components/Card/CardWrapper";
import { StatsHeader } from "../components/Lending/StatsHeader";
import { TableHeader } from "../components/Table/TableHeader";

export default function Lending() {
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
      <Stack px={{ base: "2", md: "8" }} maxW="8xl" mx="auto" pt="6" pb="36" pos="relative" spacing="6">
        <CardWrapper mt="6">
          <StatsHeader />
        </CardWrapper>

        <CardWrapper>
          <CardWrapper mt="3">
            <TableHeader />
          </CardWrapper>
        </CardWrapper>
      </Stack>
    </>
  );
}
