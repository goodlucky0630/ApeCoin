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
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import { Download } from "../Icons/Download";
import { useState } from "react";
import { CurrentTable } from "./CurrentTable";
import { useAccount } from "wagmi";
import { useTxns } from "../../hooks/useTxns";
import { infoToast } from "../../pages/_app";
import { exportCSVFile } from "../../utils/CSV";
import { RepeatIcon } from "@chakra-ui/icons";

export const Transactions = () => {
  const { address } = useAccount();
  const [activeTable, setActiveTable] = useState("deposits");
  const { data, isError, isLoading, getTxns } = useTxns(activeTable);
  const [isRefreshDisabled, setIsRefreshDisabled] = useState(false);

  const isMobile = useBreakpointValue({
    base: true,
    sm: true,
    md: true,
    lg: false,
  });

  const showDeposits = () => {
    setActiveTable("deposits");
  };

  const showWithdrawals = () => {
    setActiveTable("withdrawals");
  };

  const showClaim = () => {
    setActiveTable("claim");
  };

  const tableData = () => {
    if (activeTable === "deposits") {
      return data?.deposits;
    }
    if (activeTable === "withdrawals") {
      return data?.withdrawals;
    }
    if (activeTable === "claim") {
      return data?.claim;
    }
  };

  const exportCSV = async () => {
    if (!data[activeTable] || data[activeTable]?.length === 0) {
      infoToast("No deposits to export.");
      return;
    }

    const txType = {
      deposits: "DepositAmount",
      withdrawals: "WithdrawalAmount",
      claim: "ClaimAmount",
    };

    const headers = {
      txHash: "TransactionHash",
      amount: txType[activeTable],
      poolId: "PoolId",
      tokenId: "TokenId",
      timestamp: "Timestamp",
      priceUSD: "APEPrice",
    };

    let itemsFormatted = [];

    // format the data
    data[activeTable].forEach((item) => {
      itemsFormatted.push({
        txHash: String(item.transactionHash),
        amount: String(item.amount),
        poolId: String(item.poolId),
        tokenId: item.poolId === "0" ? "-" : String(item.poolId),
        timestamp: String(item.timestamp),
        priceUSD: String(item.priceUSD),
      });
    });

    const fileTitle = `${activeTable}-${new Date()}`;
    exportCSVFile(headers, itemsFormatted, fileTitle);
  };

  const exportData = () => {
    exportCSV();
  };

  const refresh = async () => {
    infoToast("Refreshing Data", "Can refresh again in 30 seconds.");
    setIsRefreshDisabled(true);
    await getTxns(true);
    setTimeout(() => {
      setIsRefreshDisabled(false);
    }, 30000);
  };

  return (
    <Stack gap={"4"} fontFamily={"Space Mono, monospace"}>
      <HStack
        flexDirection={{ base: "column", md: "row" }}
        justifyContent={"space-between"}
        alignSelf={isMobile ? "center" : "normal"}
        height={isMobile ? "fit-content" : ""}
        spacing="0"
        flexWrap={"wrap"}
        gap="3"
      >
        <HStack spacing="1">
          <Heading
            fontFamily={"Space Mono, monospace"}
            letterSpacing={"1"}
            fontSize={"20px"}
            textAlign={isMobile ? "center" : ""}
          >
            Your Transactions
          </Heading>
          <IconButton
            disabled={isRefreshDisabled}
            onClick={refresh}
            icon={<RepeatIcon />}
            bg="transparent"
          />
        </HStack>

        {address && (
          <>
            <ButtonGroup
              mt={{ base: "4", md: "" }}
              borderRadius={"20px"}
              bg={"rgba(228, 228, 228, 0.1)"}
              fontFamily={"Space Mono, monospace"}
              letterSpacing={"1"}
              spacing={"0"}
              alignSelf={"center"}
            >
              <TableButton
                buttonText="Deposits"
                onClick={showDeposits}
                isActive={activeTable === "deposits" ? true : false}
              />

              <TableButton
                buttonText="Withdrawals"
                onClick={showWithdrawals}
                isActive={activeTable === "withdrawals" ? true : false}
              />

              <TableButton
                buttonText="Claim"
                onClick={showClaim}
                isActive={activeTable === "claim" ? true : false}
              />
            </ButtonGroup>

            <Button
              bg={"transparent"}
              _hover={{ background: "transparent" }}
              _active={{ background: "transparent" }}
              fontFamily={"Space Mono, monospace"}
              letterSpacing={"1"}
            >
              <Flex onClick={exportData} gap={"2"}>
                <Text alignSelf={"center"} textDecoration={"underline"}>
                  Download as CSV
                </Text>
                <Box alignSelf={"center"}>
                  <Download />
                </Box>
              </Flex>
            </Button>
          </>
        )}
      </HStack>
      {!address ? (
        <Box textAlign={"center"}>Connect Wallet To View</Box>
      ) : isLoading ? (
        <Flex justifyContent={"center"} pt="20">
          <Spinner size="lg" color="#FF0083" />
        </Flex>
      ) : (
        <CurrentTable tableData={tableData()} isLoading={isLoading} />
      )}
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
