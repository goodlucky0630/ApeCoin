import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  HStack,
  Stack,
  ButtonGroup,
  Skeleton,
  Box,
  Flex,
} from "@chakra-ui/react";
import {
  timestampToDate,
  formatAmount,
  getPercentChange,
} from "../../utils/formatters";
import { useState } from "react";
import { ChartButton } from "./ChartButton";
import { StatArrow, Stat, StatHelpText } from "@chakra-ui/react";
import { ApeCoinLogo } from "../Icons/ApeCoinLogo";
const bigDecimal = require("js-big-decimal");

const timeframe = {
  "1year": 31560000,
  "6month": 15770000,
  "1month": 2628000,
  "7day": 604800,
};

export const ApeCoinChart = ({ chartData, height }) => {
  const [chartTime, setChartTime] = useState("1month");

  return (
    <Stack spacing="3" fontFamily={"Space Mono, monospace"}>
      <Stack color="white" gap="2">
        <Flex justifyContent={"space-between"} w="full" flexWrap={"wrap"} gap="4">
          <HStack w="fit-content">
            <ApeCoinLogo width="35px" height="35px" />
            <Box fontWeight={700}>ApeCoin</Box>
          </HStack>
          <ButtonGroup
            spacing="0"
            w="fit-content"
            borderRadius={"full"}
            h="fit-content"
            bgColor="rgba(228, 228, 228, 0.1)"
            justifyContent="center"
            mx={{ base: "0", lg: "0" }}
          >
            <ChartButton
              title="W"
              isSelected={chartTime === "7day"}
              onClick={() => setChartTime("7day")}
              disabled={!chartData || chartData?.length === 0}
            />
            <ChartButton
              title="M"
              isSelected={chartTime === "1month"}
              onClick={() => setChartTime("1month")}
              disabled={!chartData || chartData?.length === 0}
            />
            <ChartButton
              title="6M"
              isSelected={chartTime === "6month"}
              onClick={() => setChartTime("6month")}
              disabled={!chartData || chartData?.length === 0}
            />
            <ChartButton
              title="Y"
              isSelected={chartTime === "1year"}
              onClick={() => setChartTime("1year")}
              disabled={!chartData || chartData?.length === 0}
            />
          </ButtonGroup>
        </Flex>
        <Skeleton isLoaded={chartData && chartData.length > 0}>
          <HStack minW="4rem">
            <Box fontSize={"lg"} fontWeight={"700"}>
              {chartData && chartData[chartData?.length - 1]?.priceUSD
                ? formatAmount(
                    chartData[chartData?.length - 1]?.priceUSD,
                    2,
                    true
                  )
                : "..."}
            </Box>
            {chartData && chartData.length >= 2 && (
              <Stat>
                <StatHelpText>
                  <StatArrow
                    type={
                      getPercentChange(
                        chartData[chartData?.length - 1]?.priceUSD,
                        chartData[chartData?.length - 2]?.priceUSD
                      ) < 0
                        ? "decrease"
                        : "increase"
                    }
                  />
                  {getPercentChange(
                    chartData[chartData?.length - 1]?.priceUSD,
                    chartData[chartData?.length - 2]?.priceUSD
                  ).toFixed(2) + "%"}
                </StatHelpText>
              </Stat>
            )}
          </HStack>
        </Skeleton>
      </Stack>

      <Skeleton isLoaded={chartData && chartData?.length > 0}>
        <ResponsiveContainer width="100%" height={height ? height : 200}>
          <AreaChart
            data={
              { ...chartData } &&
              chartData
                ?.filter(
                  (x, index) =>
                    bigDecimal.subtract(
                      chartData[chartData?.length - 1]?.timestamp,
                      chartData[index]?.timestamp
                    ) <= timeframe[chartTime]
                )
                .map((day) => ({
                  price: Number(formatAmount(day.priceUSD, 2, false)),
                  priceFormatted: formatAmount(day.priceUSD, 2, true),
                  date: timestampToDate(day.timestamp),
                  timestamp: day.timestamp,
                }))
            }
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="1" x2="0" y2="0">
                <stop
                  offset="0%"
                  stopColor="rgba(0, 0, 0, 0)"
                  stopOpacity={0}
                />
                <stop
                  offset="100%"
                  stopColor="rgba(17, 69, 233, .5)"
                  stopOpacity={1}
                />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#1145E9"
              strokeWidth={"3px"}
              fillOpacity={1}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Skeleton>
    </Stack>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        className="custom-tooltip"
        style={{
          backgroundColor: "#252733",
          borderColor: "#252733",
          color: "#fff",
          borderRadius: "5px",
          padding: "8px",
        }}
      >
        <Box>{label}</Box>
        <Box fontWeight={700}>Price: ${payload[0].value}</Box>
      </Box>
    );
  }

  return null;
};
