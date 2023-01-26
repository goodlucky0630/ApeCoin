import { Tr, Td, Box, Link, Button, Container, Text } from "@chakra-ui/react";
import { getEllipsisTxt } from "../../utils/formatters";
import { TableApe } from "../Icons/TableApe";
import { TableMutant } from "../Icons/TableMutant";
import { TableKennel } from "../Icons/TableKennel";
import { ApeCoinLogo } from "../Icons/ApeCoinLogo";
import { OtherSideLogo } from "../Icons/OtherSideLogo";
import Image from "next/image";

const icons = [
  <ApeCoinLogo width="40px" key="first" />,
  <TableApe key="second" />,
  <TableMutant key="third" />,
  <TableKennel key="forth" />,
  <OtherSideLogo key="fifth" />,
];

export const LoansRow = ({
    index,
    NFT,
    Collection,
    Principal,
    APR,
    Due,
    LendonAsset,
    Status,
}) => {
    return (
    <Tr bg={index % 2 === 0 ? "rgba(0, 0, 0, 0.2)" : "rgb(230, 230, 230, 0.2)"}>
        <Td>
            <Box bgImage={NFT} bgSize={"cover"} bgPos={"center"} w={"60px"} h={"83px"} borderRadius={"10px"}>
                <Box bg={Status === 'Repaid' ? 'rgba(17, 69, 233, 1)' : '#FF9736'} width={'fit-content'} borderRadius={'0px 5px 5px 0px'}fontSize={'8px'} pr={'1'}>{Status}</Box>
            </Box>
        </Td>
        <Td><Box w={"50px"}>{icons[Collection]}</Box></Td>
        <Td>{Principal}</Td>
        {/* <Td>{poolId === "0" ? "-" : tokenId}</Td> */}
        <Td>{APR}</Td>
        <Td>{Due}</Td>
        <Td position="sticky" right="-3"><Button bg={'#2D3042'}>{LendonAsset}</Button></Td>
    </Tr>
    )
}