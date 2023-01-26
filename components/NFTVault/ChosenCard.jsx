import { useGetImage } from "../../hooks/useGetImage";
import { Box, Skeleton, Stack, Progress, Flex } from "@chakra-ui/react";
import { formatAmount } from "../../utils/formatters";
import { useUserContext } from "../../contexts/User";
import BlueButton from "../Buttons/BlueButton";
const bigDecimal = require("js-big-decimal");

export const ChosenCard = (props) => {
  const {
    parentHeight,
    parentWidth,
    mainTokenId,
    mainTypePoolId,
    poolId,
    dogTokenId,
    stakedAmount,
    poolCap,
    ...rest
  } = props;

  const userContext = useUserContext();
  const isNotPaired =
    userContext.nftVaultState.poolId === "3" &&
    stakedAmount === "0" &&
    mainTokenId === "0";

  const { data: mainTokenURL, isLoaded: isMainLoaded } = useGetImage(
    userContext.nftVaultState.poolId === "3" ? mainTypePoolId : poolId,
    !isNotPaired ? mainTokenId : ""
  );
  const { data: dogTokenURL, isLoaded: isDogLoaded } = useGetImage(
    poolId,
    dogTokenId
  );

  const percentage = bigDecimal.multiply(
    bigDecimal.divide(stakedAmount, poolCap),
    "100"
  );

  return (
    <Skeleton
      isLoaded={
        userContext.nftVaultState.poolId === "3"
          ? isDogLoaded && (isNotPaired ? true : isMainLoaded)
          : isMainLoaded
      }
      alignSelf={{ base: "center", md: "initial" }}
      w={{
        base: "initial",
        md: userContext.nftVaultState.poolId !== "3" && "full",
        lg: "initial",
      }}
    >
      <Box
        {...rest}
        border={"1px solid #FF0083"}
        borderRadius={"3px"}
        position="relative"
        animation={"fadeIn .75s"}
        bgImage={!isNotPaired ? mainTokenURL?.imageURL : ""}
        minW={{
          base: `${parentWidth / 1.5}px`,
          md: "250px",
          lg: `${parentWidth / 3}px`,
        }}
        height={{ base: "325px", md: "350px" }}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        bgSize={"cover"}
        display="flex"
        alignItems={"flex-end"}
        mr={{ base: "0", md: userContext.nftVaultState.poolId === "3" && "10" }}
      >
        {isNotPaired && (
          <BlueButton
            buttonText="Not Paired"
            disabled
            position="absolute"
            top="50%"
            size="sm"
            w="full"
          />
        )}
        {userContext.nftVaultState.poolId === "3" && (
          <Box
            border={"1px solid #FF0083"}
            borderRadius={"3px"}
            position="absolute"
            bottom="-5"
            right="-10"
            bgImage={dogTokenURL?.imageURL}
            width="100px"
            height={"100px"}
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            bgSize={"cover"}
          />
        )}
      </Box>
      <Box display="flex" alignItems={"flex-end"} h="full" w="full">
        <Stack w="full" spacing="3" pt="5">
          <Box fontWeight={"700"} fontSize="16px">
            {formatAmount(percentage, 3) + "%"} Filled
          </Box>
          <Progress
            border="1px solid #FBFCFD"
            bg="#FBFCFD"
            sx={{
              "& > div": {
                background: "#FF0083",
              },
            }}
            size="sm"
            borderRadius={"full"}
            value={Math.ceil(Number(percentage))}
          />
        </Stack>
      </Box>
    </Skeleton>
  );
};
