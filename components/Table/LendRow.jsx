import { Tr, Td, Box, Skeleton, HStack } from "@chakra-ui/react";
import { TableApe } from "../Icons/TableApe";
import { TableMutant } from "../Icons/TableMutant";
import { TableKennel } from "../Icons/TableKennel";
import Link from "next/link";
import BlueButton from "../Buttons/BlueButton";
import { useGetImage } from "../../hooks/useGetImage";
import { BAYC, MAYC, BAKC } from "../../constants/addresses";
import { useUserContext } from "../../contexts/User";
import { useState, useEffect } from "react";
import axios from "axios";
import { formatAmount } from "../../utils/formatters";
import { BigNumber, ethers } from "ethers";

const icons = {
  [BAYC.toLowerCase()]: <TableApe key="second" />,
  [MAYC.toLowerCase()]: <TableMutant key="third" />,
  [BAKC.toLowerCase()]: <TableKennel key="forth" />,
};

const poolIds = {
  [BAYC.toLowerCase()]: "1",
  [MAYC.toLowerCase()]: "2",
  [BAKC.toLowerCase()]: "3",
};

export const LendRow = ({ index, inventory, vaultId, vaultTokenId }) => {
  const userContext = useUserContext();
  const [floor, setFloor] = useState(undefined);
  const [valuation, setValuation] = useState(undefined);
  const [isInLoan, setIsInLoan] = useState(undefined);

  const getLoanStatus = async () => {
    try {
      const statuses = await axios.get("/api/getVaultStatus", {
        params: {
          vaultTokenId: vaultTokenId,
        },
      });

      const isAccepted = statuses?.data?.filter((i) => i?.status === "ACCEPTED");
      setIsInLoan(isAccepted?.length === 1 ? true : false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (vaultTokenId && isInLoan === undefined) {
      getLoanStatus();
    }
  }, [vaultTokenId, isInLoan]);

  const calcTotalFloor = () => {
    let total = BigNumber.from("0");
    for (let i = 0; i < inventory.length; i++) {
      const poolId = poolIds[inventory[i]?.contract];
      const floor = userContext?.floorData[poolId] || "0";
      total = total.add(BigNumber.from(floor));
    }
    const formattedFloor = formatAmount(ethers.utils.formatEther(total.toString()), 2);
    setFloor(formattedFloor);
    setValuation(formattedFloor);
  };

  useEffect(() => {
    if (userContext?.floorData && inventory && inventory?.length > 0 && (!floor || !valuation)) {
      calcTotalFloor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inventory, floor, valuation, userContext]);

  return (
    <Tr bg={index % 2 === 0 ? "rgba(0, 0, 0, 0.2)" : "rgb(230, 230, 230, 0.2)"}>
      <Td position={"relative"}>
        <HStack spacing={"-8"}>
          {inventory?.map((i, idx) => (
            <SmallImage
              key={idx}
              isInLoan={isInLoan && idx === 0}
              zIndex={inventory.length - idx}
              tokenId={i.tokenId}
              contractAddress={i.contract}
            />
          ))}
        </HStack>
      </Td>
      <Td>{floor} ETH</Td>
      <Td>{valuation} ETH</Td>
      <Td>
        <HStack spacing="-3">
          {inventory?.map((i, idx) => (
            <Box key={idx} w={"40px"}>
              {icons[i?.contract?.toLowerCase()]}
            </Box>
          ))}
        </HStack>
      </Td>
      <Td position="sticky" right="-3">
        <Link href={`/vault/${vaultId}`}>
          <BlueButton buttonText="View" />
        </Link>
      </Td>
    </Tr>
  );
};

const SmallImage = (props) => {
  const { tokenId, contractAddress, handleClick, isInLoan, zIndex, ...rest } = props;
  const poolId = poolIds[contractAddress];
  const { data, isLoading, isLoaded } = useGetImage(poolId, tokenId);

  return (
    <Skeleton zIndex={zIndex} isLoaded={isLoaded} w="60px">
      <Box
        alt=""
        border="1px solid #FF0083"
        bgImage={data?.imageURL}
        bgSize={"cover"}
        bgPos={"center"}
        w={"60px"}
        h={"83px"}
        borderRadius={"10px"}
      >
        {isInLoan && (
          <Box
            fontSize={"10px"}
            bg="limegreen"
            w="full"
            textAlign={"center"}
            borderRadius={"10px"}
            fontWeight="bold"
            zIndex={"2"}
          >
            In Loan
          </Box>
        )}
      </Box>
    </Skeleton>
  );
};

{
  /* {inventory?.length > 1 && (
            <Box
              bgColor="#FF0083"
              w="fit-content"
              borderRadius={"full"}
              p="1"
              fontWeight={"bold"}
              position="absolute"
              top="2"
              left="4.25rem"
            >
              {`+${inventory?.length - 1}`}
            </Box>
          )} */
}
