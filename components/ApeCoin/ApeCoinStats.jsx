import {
  SimpleGrid,
  Flex,
  Stack,
  HStack,
  Box,
  Tooltip,
  Skeleton,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { ApeCoinLogo } from "../Icons/ApeCoinLogo";
import { formatAmount } from "../../utils/formatters";
import { Percent } from "../Icons/Percent";
import { Martketcap } from "../Icons/Marketcap";
import { Volume } from "../Icons/Volume";

export const ApeCoinStats = (props) => {
  const { data, isLoading, ...rest } = props;
  return (
    <SimpleGrid columns={{ base: 1, xl: 2 }} {...rest} spacing={"0"}>
      <StatBox
        icon={<ApeCoinLogo width="40px" height="40px" />}
        title="Holders"
        data={formatAmount(data?.holderCount)}
        toolTipText="Amount of addresses holding any amount of ApeCoin."
        borderTop={"1px solid rgba(230, 230, 230, 0.3)"}
        borderRight={{ base: "", xl: "1px solid rgba(230, 230, 230, 0.3)" }}
        isLoading={isLoading}
      />
      <StatBox
        icon={<Martketcap />}
        title="Market Cap"
        data={formatAmount(data?.marketCap, 2, true)}
        toolTipText="Refers to the total market value of ApeCoin's total supply."
        borderTop={"1px solid rgba(230, 230, 230, 0.3)"}
        isLoading={isLoading}
      />
      <StatBox
        icon={<Volume />}
        title="24hr Volume"
        data={formatAmount(data?.volume24hr, 2, true)}
        toolTipText="A measure of a ApeCoin's trading volume across all tracked platforms in the last 24 hours. This is tracked on a rolling 24-hour basis with no open/closing times."
        borderTop={"1px solid rgba(230, 230, 230, 0.3)"}
        borderBottom={{ base: "", xl: "1px solid rgba(230, 230, 230, 0.3)" }}
        borderRight={{ base: "", xl: "1px solid rgba(230, 230, 230, 0.3)" }}
        isLoading={isLoading}
      />
      <StatBox
        icon={<Percent />}
        title="$APE Staked"
        data={`${formatAmount(data?.percentStaked, 2)}%`}
        toolTipText="Percentage of ApeCoin's total supply in staking contract."
        borderTop={"1px solid rgba(230, 230, 230, 0.3)"}
        borderBottom={"1px solid rgba(230, 230, 230, 0.3)"}
        isLoading={isLoading}
      />
    </SimpleGrid>
  );
};

const StatBox = (props) => {
  const { icon, title, data, isLoading, toolTipText, ...rest } = props;

  return (
    <Flex
      px="6"
      py="10"
      {...rest}
      fontFamily={"Space Mono, monospace"}
      align="center"
      gap="3"
      backdropFilter={"blur(15px)"}
    >
      <Box>{icon}</Box>
      <Stack spacing="0">
        <HStack fontSize={"sm"} color="#808191">
          <Box>{title}</Box>
          <Tooltip label={toolTipText} placement="top" hasArrow>
            <InfoOutlineIcon />
          </Tooltip>
        </HStack>
        <Skeleton isLoaded={!isLoading}>
          <Box>{data}</Box>
        </Skeleton>
      </Stack>
    </Flex>
  );
};
