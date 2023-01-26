import { Flex, Skeleton, Box, Stack, Progress } from "@chakra-ui/react";
import { useUserContext } from "../../contexts/User";
import { useGetImage } from "../../hooks/useGetImage";
const bigDecimal = require("js-big-decimal");
import { formatAmount } from "../../utils/formatters";
import { useEffect, useState } from "react";

export const NFTVault = ({ nftArray, handleSelect }) => {
  return (
    <Stack
      animation={"fadeIn .75s"}
      h="lg"
      fontFamily={"Space Mono, monospace"}
    >
      <Flex
        justifyContent={"center"}
        flexWrap={"wrap"}
        gap="10"
        overflowY={"scroll"}
        sx={{
          "&::-webkit-scrollbar": {
            width: "2px",
            borderRadius: "2px",
            backgroundColor: `rgba(0, 0, 0, 0.05)`,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: `white`,
            borderRadius: "8px",
          },
        }}
      >
        {nftArray?.length > 0 ? (
          nftArray.map((i, idx) => (
            <NFTCard
              key={idx}
              tokenId={i.tokenId}
              poolId={i.poolId}
              stakedAmount={i.stakedAmount}
              onClick={() => handleSelect(i.poolId, i.tokenId, idx)}
            />
          ))
        ) : (
          <Box>No assets found.</Box>
        )}
      </Flex>
    </Stack>
  );
};

const NFTCard = (props) => {
  const userContext = useUserContext();
  const { tokenId, stakedAmount, poolId, onClick, ...rest } = props;
  const { data, isLoading, isLoaded, isError, getImage } = useGetImage(
    poolId,
    tokenId
  );
  useEffect(() => {
    if (
      data?.tokenId.toString() !== tokenId.toString() ||
      (data?.poolId.toString() !== poolId.toString() && !isLoading)
    ) {
      getImage(poolId, tokenId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, tokenId, poolId, isLoading]);

  const poolCap = () => {
    if (String(poolId) === "1") {
      return String(userContext.allPools[1].poolCap);
    }
    if (String(poolId) === "2") {
      return String(userContext.allPools[2].poolCap);
    }
    if (String(poolId) === "3") {
      return String(userContext.allPools[3].poolCap);
    }
  };

  const percentage = bigDecimal.multiply(
    bigDecimal.divide(stakedAmount, poolCap()),
    "100"
  );

  const isSelected = () => {
    if (
      String(userContext.nftVaultState.poolId) === "3" &&
      userContext.nftVaultState.dogTokenId === tokenId
    ) {
      return true;
    }
    if (
      (String(userContext.nftVaultState.poolId) === "1" ||
        String(userContext.nftVaultState.poolId) === "2") &&
      userContext.nftVaultState.mainTokenId === tokenId
    ) {
      return true;
    }
  };

  const viewStakeFlow = () => {
    if (isSelected()) {
      userContext.nftVaultDispatch({
        type: "HANDLE_IS_STAKE_FLOW",
        payload: true,
      });
    }
  };

  return (
    <Skeleton isLoaded={isLoaded && !isLoading}>
      <Box
        m="1"
        {...rest}
        animation={"fadeIn .75s"}
        cursor={"pointer"}
        border={
          isSelected()
            ? "5px solid #FF0083"
            : "1px solid rgba(230, 230, 230, 0.3)"
        }
        boxShadow={isSelected() && "0px 8px 24px rgba(255, 0, 131, 0.64)"}
        borderRadius={"3px"}
        position="relative"
        bgImage={data?.imageURL}
        width="225px"
        height={"275px"}
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        bgSize={"cover"}
        onClick={onClick}
        display="flex"
        alignItems={"flex-end"}
      >
        <Box
          display="flex"
          alignItems={"flex-end"}
          h="full"
          w="full"
          backdropFilter={isSelected() && "blur(2px)"}
        >
          <Stack
            w="full"
            spacing="1"
            p="2"
            backdropFilter="blur(2px)"
            bgColor={!isSelected() && "rgba(0,0,0,.4)"}
          >
            {isSelected() && (
              <Box
                mx="auto"
                mb="8"
                bg="#FF0083"
                borderRadius={"1.5px"}
                px="3"
                py="2"
                fontWeight={"700"}
                border="1px solid rgba(230, 230, 230, 0.5)"
                onClick={viewStakeFlow}
              >
                {"View Stakes"}
              </Box>
            )}
            <Progress
              border="2px solid #FBFCFD"
              bg="#FBFCFD"
              sx={{
                "& > div": {
                  background: "#FF0083",
                },
              }}
              size="md"
              borderRadius={"full"}
              value={Math.ceil(Number(percentage))}
            />
            <Box fontWeight={"700"} fontSize="16px">
              {formatAmount(percentage, 3) + "%"} Filled
            </Box>
          </Stack>
        </Box>
      </Box>
    </Skeleton>
  );
};
