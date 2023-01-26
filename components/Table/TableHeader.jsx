import {
  Flex,
  Heading,
  Button,
  Text,
  Box,
  Stack,
  useBreakpointValue,
  ButtonGroup,
  HStack,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
} from "@chakra-ui/react";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Lend } from "./Lend";
import { Loan } from "./Loan";
// import { useDepositTxns } from "../../hooks/useDepositTxns";

export const TableHeader = () => {
  const { address } = useAccount();
  //   const {
  //     data: depositData,
  //     isError,
  //     isLoading,
  //     getDepositTxns,
  //   } = useDepositTxns();

  const isMobile = useBreakpointValue({
    base: true,
    sm: true,
    md: true,
    lg: false,
  });

  const [activeTable, setActiveTable] = useState("Lend");

  const showLend = () => {
    setActiveTable("Lend");
  };

  const showLoans = () => {
    setActiveTable("Loans");
  };

  //   const tableData = () => {
  //     if ("Lend") {
  //       return depositData;
  //     }
  //     if ("Loans") {
  //       return;
  //     }
  //   };

  return (
    <Stack gap={"4"} fontFamily={"Space Mono, monospace"}>
      <HStack
        flexDirection={{ base: "column", md: "row" }}
        justifyContent={"space-between"}
        alignSelf={isMobile ? "center" : "normal"}
        height={isMobile ? "fit-content" : ""}
        spacing="0"
        gap="3"
      >
        <Heading
          fontFamily={"Space Mono, monospace"}
          letterSpacing={"1"}
          fontSize={"20px"}
          textAlign={isMobile ? "center" : ""}
        >
          All Vaults
        </Heading>

        {/* <ButtonGroup
            mt={{ base: "4", md: "" }}
            border={"1px solid gray"}
            borderRadius={"20px"}
            bg={"rgba(228, 228, 228, 0.1)"}
            fontFamily={"Space Mono, monospace"}
            letterSpacing={"1"}
            spacing={"0"}
            alignSelf={"center"}
        >
            <TableButton
            buttonText="Lend"
            onClick={showLend}
            isActive={activeTable === "Lend" ? true : false}
            />

            <TableButton
            buttonText="Loans"
            onClick={showLoans}
            isActive={activeTable === "Loans" ? true : false}
            />
        </ButtonGroup> */}
      </HStack>
      {/* {activeTable === "Lend" ? */}
      <Lend />
      {/* 
      // : // <Loan />
      // */}
    </Stack>
  );
};

const TableButton = (props) => {
  const { buttonText, isActive, onClick, ...rest } = props;
  return (
    <Button
      {...rest}
      bg={isActive ? "#FF0083" : "transparent"}
      px={{ base: "2", md: "4" }}
      onClick={onClick}
      borderRadius={"full"}
      fontWeight="600"
      py="0"
      size="xs"
      _hover={{
        backgroundColor: "#ed007b",
      }}
      _active={{
        backgroundColor: "#d4006e",
      }}
    >
      {buttonText}
    </Button>
  );
};
