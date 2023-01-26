import { Flex, Skeleton, Box, Stack, Spinner } from "@chakra-ui/react";
import { useUserContext } from "../../contexts/User";
import { useGetImage } from "../../hooks/useGetImage";
import { useEffect } from "react";
import { useIsImageLoaded } from "../../hooks/useIsImageLoaded";

export const WalletContents = ({ nftArray, handleSelect, isLoading }) => {
  return (
    <Stack animation={"fadeIn .75s"} h="lg" fontFamily={"Space Mono, monospace"}>
      {isLoading && (
        <Flex justifyContent={"center"} py="10">
          <Spinner size="lg" color="#FF0083" />
        </Flex>
      )}
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
        {nftArray &&
          nftArray?.length !== 0 &&
          !isLoading &&
          nftArray?.map((i, idx) => (
            <NFTCard
              key={idx}
              tokenId={i.tokenId}
              poolId={i.poolId}
              imageURL={i.imageURL}
              onClick={() => handleSelect(i.poolId, i.tokenId)}
            />
          ))}

        {!isLoading && nftArray?.length === 0 && <Box>No assets found.</Box>}
      </Flex>
    </Stack>
  );
};

const NFTCard = (props) => {
  const userContext = useUserContext();
  const { tokenId, poolId, imageURL, onClick, ...rest } = props;
  const { isLoaded, isLoading, isError } = useIsImageLoaded(imageURL);

  const isSelected = () => {
    const chosen = userContext.collateralState.chosenTokens.filter(
      (i) => i.tokenId === tokenId && i.poolId === poolId
    );
    if (chosen.length !== 0) {
      return true;
    }
  };

  return (
    <Skeleton isLoaded={isLoaded}>
      <Box
        m="1"
        {...rest}
        animation={"fadeIn .75s"}
        cursor={"pointer"}
        border={isSelected() ? "5px solid #FF0083" : "1px solid rgba(230, 230, 230, 0.3)"}
        boxShadow={isSelected() && "0px 8px 24px rgba(255, 0, 131, 0.64)"}
        borderRadius={"3px"}
        position="relative"
        bgImage={imageURL}
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
          alignItems={"center"}
          pt="14"
          h="full"
          w="full"
          backdropFilter={isSelected() && "blur(2px)"}
        >
          <Stack w="full" spacing="1" p="2">
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
                // onClick={viewStakeFlow}
              >
                {"Selected"}
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </Skeleton>
  );
};
