import { Box, Flex, HStack, Link as ChakraLink, Divider } from "@chakra-ui/react";
import Link from "next/link";
import { Connect } from "../Connect/Connect";
import { ApeCoinLogo } from "../Icons/ApeCoinLogo";
import { NF3 } from "../Icons/NF3";
import { TogglePages } from "./TogglePages";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { LendingConnect } from "../Connect/LendingConnect";
import { RoundButton } from "../Buttons/RoundButton";
import { CHAIN } from "../../constants/chain";

export const Navbar = () => {
  const router = useRouter();
  const { address } = useAccount();

  return (
    <Box
      bgColor={"black"}
      backdropFilter={"blur(10px)"}
      py="1.25rem"
      align="center"
      px={{ base: "4", md: "6" }}
      border="1px solid #45494D"
      position={"sticky"}
      top="0"
      zIndex={"3"}
      w="full"
    >
      <Flex
        justifyContent={{ base: "space-evenly", md: "space-between" }}
        flexDirection={{ base: "column", md: "row" }}
        maxW="8xl"
        gap="6"
        alignItems={"center"}
      >
        <Flex gap="4" alignItems="center" justifyContent={"center"} w={{ base: "full", md: "initial" }}>
          <ChakraLink href="/">
            <ApeCoinLogo width="35px" height="35px" />
          </ChakraLink>
          <Divider orientation="vertical" borderColor="#45494D" height={"1rem"} />
          <Link
            href={
              router?.asPath === "/lending" ||
              router?.asPath === "/my-vaults" ||
              router?.pathname === "/vault/[id]"
                ? "/lending"
                : "/"
            }
          >
            <Box fontFamily={"Space Mono, monospace"}>
              {CHAIN === 5 ? <span style={{ fontWeight: 700 }}>GOERLI </span> : null}
              {router?.asPath === "/lending" ||
              router?.asPath === "/my-vaults" ||
              router?.pathname === "/vault/[id]"
                ? "Lending Interface"
                : "Staking Interface"}
            </Box>
          </Link>
          <Divider orientation="vertical" borderColor="#45494D" height={"1rem"} />
          <ChakraLink isExternal href="https://twitter.com/nf3exchange">
            <NF3 />
          </ChakraLink>
        </Flex>
        <HStack justifyContent={"center"} w={{ base: "full", md: "initial" }} spacing="4">
          <TogglePages />

          {address && router?.asPath !== "/" ? (
            <>
              <LendingConnect />
              <Link href={`/my-vaults`}>
                <RoundButton buttonText="My Vaults" />
              </Link>
            </>
          ) : (
            <Connect />
          )}
        </HStack>
      </Flex>
    </Box>
  );
};
