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
import { TableKennel } from "../Icons/TableKennel";
import { TableApe } from "../Icons/TableApe";
import { TableMutant } from "../Icons/TableMutant";

const icons = {
  1: <TableApe />,
  2: <TableMutant />,
  3: <TableKennel />,
};

const data = {
  1: "baycData",
  2: "maycData",
  3: "bakcData",
};

const title = {
  1: "BAYC",
  2: "MAYC",
  3: "BAKC",
};

export const NFTChart = ({ chartData, height }) => {
  const [dataToShow, setDataToShow] = useState("1");

  return (
    <Stack spacing="3" fontFamily={"Space Mono, monospace"}>
      <Stack color="white" gap="2">
        <Flex
          justifyContent={"space-between"}
          w="full"
          flexWrap={"wrap"}
          gap="4"
        >
          <HStack w="fit-content">
            {icons[dataToShow]}
            <Box fontWeight={700}>{title[dataToShow]}</Box>
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
              title="BAYC"
              isSelected={dataToShow === "1"}
              onClick={() => setDataToShow("1")}
              disabled={
                !chartData?.[data[dataToShow]]?.historicalFloor ||
                chartData?.[data[dataToShow]]?.historicalFloor?.length === 0
              }
            />
            <ChartButton
              title="MAYC"
              isSelected={dataToShow === "2"}
              onClick={() => setDataToShow("2")}
              disabled={
                !chartData?.[data[dataToShow]]?.historicalFloor ||
                chartData?.[data[dataToShow]]?.historicalFloor?.length === 0
              }
            />
            <ChartButton
              title="BAKC"
              isSelected={dataToShow === "3"}
              onClick={() => setDataToShow("3")}
              disabled={
                !chartData?.[data[dataToShow]]?.historicalFloor ||
                chartData?.[data[dataToShow]]?.historicalFloor?.length === 0
              }
            />
          </ButtonGroup>
        </Flex>
        <Skeleton
          isLoaded={
            chartData?.[data[dataToShow]]?.historicalFloor &&
            chartData?.[data[dataToShow]]?.historicalFloor.length > 0
          }
        >
          <HStack minW="4rem">
            <Box fontSize={"lg"} fontWeight={"700"}>
              {chartData?.[data[dataToShow]]?.historicalFloor &&
              chartData?.[data[dataToShow]]?.historicalFloor[
                chartData?.[data[dataToShow]]?.historicalFloor?.length - 1
              ]?.price
                ? formatAmount(
                    chartData?.[data[dataToShow]]?.historicalFloor[
                      chartData?.[data[dataToShow]]?.historicalFloor?.length - 1
                    ]?.price,
                    2,
                    false
                  ) + " ETH"
                : "..."}
            </Box>
            {chartData?.[data[dataToShow]]?.historicalFloor &&
              chartData?.[data[dataToShow]]?.historicalFloor.length >= 2 && (
                <Stat>
                  <StatHelpText>
                    <StatArrow
                      type={
                        getPercentChange(
                          chartData?.[data[dataToShow]]?.historicalFloor[
                            chartData?.[data[dataToShow]]?.historicalFloor
                              ?.length - 1
                          ]?.price,
                          chartData?.[data[dataToShow]]?.historicalFloor[
                            chartData?.[data[dataToShow]]?.historicalFloor
                              ?.length - 2
                          ]?.price
                        ) < 0
                          ? "decrease"
                          : "increase"
                      }
                    />
                    {getPercentChange(
                      chartData?.[data[dataToShow]]?.historicalFloor[
                        chartData?.[data[dataToShow]]?.historicalFloor?.length -
                          1
                      ]?.price,
                      chartData?.[data[dataToShow]]?.historicalFloor[
                        chartData?.[data[dataToShow]]?.historicalFloor?.length -
                          2
                      ]?.price
                    ).toFixed(2) + "%"}
                  </StatHelpText>
                </Stat>
              )}
          </HStack>
        </Skeleton>
      </Stack>

      <Skeleton
        isLoaded={
          chartData?.[data[dataToShow]]?.historicalFloor &&
          chartData?.[data[dataToShow]]?.historicalFloor?.length > 0
        }
      >
        <ResponsiveContainer width="100%" height={height ? height : 200}>
          <AreaChart
            data={
              { ...chartData?.[data[dataToShow]]?.historicalFloor } &&
              chartData?.[data[dataToShow]]?.historicalFloor?.map((i) => ({
                price: Number(formatAmount(i.price, 2, false)),
                date: i.time.slice(0, -10).toString(),
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
            {/* <XAxis dataKey="date" /> */}
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
        <Box>{payload[0].payload.date}</Box>
        <Box fontWeight={700}>Avg Sale Price: {payload[0].value} ETH</Box>
      </Box>
    );
  }

  return null;
};
