import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  YAxis,
} from "recharts";
import { HStack, Stack, ButtonGroup, Skeleton, Box } from "@chakra-ui/react";
import {
  timestampToDate,
  formatAmount,
  getPercentChange,
} from "../../utils/formatters";
import { useState } from "react";
import { ChartButton } from "./ChartButton";
import { StatArrow, Stat, StatHelpText } from "@chakra-ui/react";

export const StakedChart = ({ chartData }) => {
  const [dataType, setDataType] = useState(0);

  return (
    <Stack spacing="3" fontFamily={"Space Mono, monospace"}>
      <Stack color="white">
        <HStack
          spacing={"0"}
          gap="2"
          justifyContent={"space-between"}
          w="full"
          flexWrap={"wrap"}
        >
          <HStack w="fit-content">
            <Box fontWeight={700}>
              {dataType === 0
                ? "Total $APE Staked"
                : "Accum. Rewards Per Share"}
            </Box>
          </HStack>
          <ButtonGroup
            spacing="0"
            w="fit-content"
            borderRadius={"full"}
            h="fit-content"
            bgColor="rgba(228, 228, 228, 0.1)"
            justifyContent="center"
            mx={{ base: "auto", lg: "0" }}
          >
            <ChartButton
              title="$APE Staked"
              isSelected={dataType === 0}
              onClick={() => setDataType(0)}
              disabled={!chartData || chartData?.length === 0}
            />
            <ChartButton
              title="Per Share"
              isSelected={dataType === 1}
              onClick={() => setDataType(1)}
              disabled={!chartData || chartData?.length === 0}
            />
          </ButtonGroup>
        </HStack>
        <Skeleton isLoaded={chartData && chartData.length > 0}>
          <HStack minW="4rem">
            {chartData && chartData.length >= 2 && (
              <Stat>
                <StatHelpText>
                  <StatArrow
                    type={
                      getPercentChange(
                        chartData[chartData?.length - 1]?.[
                          dataType === 0
                            ? "amount"
                            : "accumulatedRewardsPerShare"
                        ],
                        chartData[chartData?.length - 2]?.[
                          dataType === 0
                            ? "amount"
                            : "accumulatedRewardsPerShare"
                        ]
                      ) < 0
                        ? "decrease"
                        : "increase"
                    }
                  />
                  {formatAmount(
                    getPercentChange(
                      chartData[chartData?.length - 1]?.[
                        dataType === 0 ? "amount" : "accumulatedRewardsPerShare"
                      ],
                      chartData[chartData?.length - 2]?.[
                        dataType === 0 ? "amount" : "accumulatedRewardsPerShare"
                      ]
                    ),
                    4
                  ) + "%"}
                </StatHelpText>
              </Stat>
            )}
          </HStack>
        </Skeleton>
      </Stack>

      {chartData?.length === 0 ? (
        <Box h="100" textAlign={"center"} pt="5">
          Chart Live When Data Available
        </Box>
      ) : (
        <Skeleton isLoaded={chartData && chartData?.length > 0}>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart
              data={
                { ...chartData } &&
                chartData?.map((i) => ({
                  amount: i.amount,
                  accumulatedRewardsPerShare: i.accumulatedRewardsPerShare,
                  date: timestampToDate(i.timestamp),
                  timestamp: Number(i.timestamp),
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
              <YAxis
                dataKey={
                  dataType === 0 ? "amount" : "accumulatedRewardsPerShare"
                }
                fontSize="10px"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={
                  dataType === 0 ? "amount" : "accumulatedRewardsPerShare"
                }
                stroke="#1145E9"
                strokeWidth={"3px"}
                fillOpacity={1}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Skeleton>
      )}
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
        <Box fontWeight={700}>Amount: {payload[0].value}</Box>
      </Box>
    );
  }

  return null;
};
