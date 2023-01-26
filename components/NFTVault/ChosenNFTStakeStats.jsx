import { Box, Stack, HStack } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useTimer } from "../../hooks/useTimer";
import { formatAmount } from "../../utils/formatters";

export const ChosenNFTStakeStats = (props) => {
  const { stakedAmount, rewards24hr, claimableAmount, endDate, ...rest } =
    props;

  const { seconds, minutes, hours, days } = useTimer({
    expiresInSeconds: endDate,
  });

  return (
    <Stack {...rest} w="full" animation={"fadeIn .75s"}>
      <StatRow
        title="Staked $APE:"
        data={formatAmount(
          ethers.utils.formatEther(stakedAmount.toString()),
          4
        )}
      />
      <StatRow
        title="$APE/24hr:"
        data={formatAmount(ethers.utils.formatEther(rewards24hr.toString()), 4)}
      />
      <StatRow
        title="Claimable $APE:"
        data={formatAmount(
          ethers.utils.formatEther(claimableAmount.toString()),
          4
        )}
      />
      <StatRow
        title="Time Left:"
        isTime={true}
        data={{ seconds: seconds, minutes: minutes, hours: hours, days: days }}
      />
    </Stack>
  );
};

const StatRow = (props) => {
  const { title, data, isTime, ...rest } = props;

  return (
    <HStack
      {...rest}
      borderRadius={"full"}
      border="1px solid #b0005a"
      bgColor="rgba(228, 228, 228, 0.1)"
      spacing="0"
      gap="4"
      w="full"
      align={"center"}
      justifyContent="space-between"
      px="3"
      py="1"
    >
      <Box>{title}</Box>
      {isTime ? <CountDown data={data} /> : <Box fontWeight={700}>{data}</Box>}
    </HStack>
  );
};

const CountDown = (props) => {
  const { data, ...rest } = props;
  return (
    <HStack spacing="0" fontWeight={"bold"}>
      <Box>{data?.days}D:</Box>
      <Box>{data?.hours}H:</Box>
      <Box>{data?.minutes}M:</Box>
      <Box>{data?.seconds}S</Box>
    </HStack>
  );
};
