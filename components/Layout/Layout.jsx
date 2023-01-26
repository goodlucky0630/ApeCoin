import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Flex, Image, Link } from "@chakra-ui/react";
import Head from "next/head";
import { getEllipsisTxt } from "../../utils/formatters";
import { NF3 } from "../Icons/NF3";
import { Navbar } from "../Navbar/Navbar";
import { useRouter } from "next/router";
import { AutoMarquee } from "../AutoMarquee/AutoMarquee";
import { WalletChatWidget } from "react-wallet-chat-nf3";
import "react-wallet-chat-nf3/dist/index.css";

export const Layout = ({ children }) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>ApeCoin Staking</title>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="description" content="ApeCoin Staking" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <Box
        flex="1"
        display={"flex"}
        flexDirection="column"
        bgColor="white"
        overflowX={"hidden"}
        backgroundColor="black"
        h={"100vh"}
      >
        <Navbar />
        {router?.asPath !== "/auto-compound" ? <AutoMarquee /> : null}
        <main style={{ flex: "1 0 auto" }}>
          <Box
            h="100%"
            backgroundImage={"url(/images/sign-up-bg.svg)"}
            backgroundPosition="center"
            backgroundSize="cover"
            backgroundRepeat="no-repeat"
          >
            {children}
          </Box>
        </main>
        <Box as={"footer"} pt={{ base: "3rem", sm: "1.25rem" }} pb={{ base: "8rem", sm: "1.25rem" }} px="4">
          <Flex
            maxW={"8xl"}
            mx="auto"
            align={"center"}
            justify="center"
            justifyContent={"space-between"}
            fontFamily={"Space Mono, monospace"}
            fontSize="xs"
            flexDirection={{ base: "column", md: "row" }}
            gap="4"
          >
            <Flex gap="2">
              <Box>Contract Address:</Box>
              <Link
                isExternal
                fontWeight={"700"}
                href="https://etherscan.io/address/0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9"
              >
                {getEllipsisTxt("0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9")}
                <ExternalLinkIcon ml="2" />
              </Link>
            </Flex>
            <Flex
              mr={{ base: "", md: "5rem" }}
              align={"center"}
              gap="3"
              flexDirection={{ base: "column", md: "row" }}
            >
              Powered By:
              <Link isExternal href="https://twitter.com/nf3exchange">
                <NF3 />
              </Link>
            </Flex>
          </Flex>
        </Box>
      </Box>
      <WalletChatWidget />
    </>
  );
};
