import {
  Center,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Container,
  Box,
  Heading,
  Hide,
  Text,
  useBreakpointValue,
  Flex,
  Stack,
  Divider,
  Button,
  Skeleton,
  HStack,
} from "@chakra-ui/react";
import { Connect } from "../Connect/Connect";
import { CardWrapper } from "../Card/CardWrapper";
import { ApeCoinChart } from "../Charts/ApeCoinChart";
import { useApeCoinData } from "../../hooks/useApeCoinData";
import { useUserContext } from "../../contexts/User";
import { NFTChart } from "../Charts/NFTChart";
import { useLendingData } from "../../hooks/useLendingData";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { formatAmount } from "../../utils/formatters";

export const StatsHeader = () => {
  const userContext = useUserContext();
  const height = useBreakpointValue({ base: 100, md: 360, xl: 105 });
  const { data, isLoading, getData } = useLendingData();
  const { data: apeData, isLoading: apeDataIsLoading } = useApeCoinData();

  return (
    <Flex gap="6" flexDirection={{ base: "column", lg: "row" }}>
      <Box w={{ base: "full", lg: "60%" }}>
        <Heading pb={"2"} textAlign={"center"} fontSize="3xl" fontFamily={"Space Mono, monospace"}>
          Lending Stats
        </Heading>
        <Stack spacing="0" border="1px solid rgba(230, 230, 230, 0.1)" borderRadius="6px">
          <HStack spacing="0" flexDirection={{ base: "column", xl: "row" }}>
            <StatBox
              title="$APE Demand"
              formattedData={formatAmount(ethers.utils.formatEther(data?.demand || "0"))}
              isLoading={isLoading || apeDataIsLoading}
              borderRight={{ base: "none", xl: "1px solid rgba(230, 230, 230, 0.1)" }}
              borderBottom={{ base: "1px solid rgba(230, 230, 230, 0.1)", xl: "none" }}
            />
            <StatBox
              title="Avg. APR"
              formattedData={formatAmount(data?.averageAPR, 2) + "%"}
              isLoading={isLoading || apeDataIsLoading}
              borderRight={{ base: "none", xl: "1px solid rgba(230, 230, 230, 0.1)" }}
              borderBottom={{ base: "1px solid rgba(230, 230, 230, 0.1)", xl: "none" }}
            />
            <StatBox
              title="$APE 24H Volume"
              formattedData={formatAmount(apeData?.volume24hr, 2, true)}
              isLoading={isLoading || apeDataIsLoading}
            />
          </HStack>
          <HStack
            borderTop={"1px solid rgba(230, 230, 230, 0.1)"}
            spacing="0"
            flexDirection={{ base: "column", md: "row" }}
          >
            <StatBox
              title="Total $APE Loaned"
              formattedData={formatAmount(ethers.utils.formatEther(data?.loaned || "0"))}
              isLoading={isLoading || apeDataIsLoading}
              borderRight={{ base: "none", md: "1px solid rgba(230, 230, 230, 0.1)" }}
              borderBottom={{ base: "1px solid rgba(230, 230, 230, 0.1)", md: "none" }}
            />
            <StatBox
              title="Total $APE Earned"
              formattedData={formatAmount(ethers.utils.formatEther(data?.totalEarned || "0"))}
              isLoading={isLoading || apeDataIsLoading}
            />
          </HStack>
        </Stack>
      </Box>
      <Box w={{ base: "full", lg: "40%" }}>
        <Heading
          whiteSpace={"nowrap"}
          fontSize="3xl"
          fontFamily={"Space Mono, monospace"}
          pb={"2"}
          textAlign={"center"}
        >
          Avg. Sale Price
        </Heading>
        <CardWrapper w="full">
          <NFTChart height={height} chartData={userContext?.historicalFloor} />
        </CardWrapper>
      </Box>
    </Flex>
  );
};

const StatBox = (props) => {
  const { title, formattedData, isLoading, ...rest } = props;
  return (
    <Stack {...rest} py="6" px="4" align={"center"} fontFamily={"Space Mono, monospace"} w="full">
      <Box textAlign={"center"}>{title}</Box>
      <Skeleton isLoaded={!isLoading} maxH="50px" w={isLoading ? "100px" : ""}>
        <Box color={"white"} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700">
          {formattedData}
        </Box>
      </Skeleton>
    </Stack>
  );
};
