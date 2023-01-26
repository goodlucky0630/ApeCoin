import { Tr, Td, Box, Link } from "@chakra-ui/react";
import { getEllipsisTxt } from "../../utils/formatters";
import { TableApe } from "../Icons/TableApe";
import { TableMutant } from "../Icons/TableMutant";
import { TableKennel } from "../Icons/TableKennel";
import { ApeCoinLogo } from "../Icons/ApeCoinLogo";

const icons = [
  <ApeCoinLogo width="40px" key="first" />,
  <TableApe key="second" />,
  <TableMutant key="third" />,
  <TableKennel key="forth" />,
];

export const TableRow = ({
  index,
  txHash,
  amount,
  poolId,
  tokenId,
  date,
  priceUSD,
}) => {
  return (
    <Tr bg={index % 2 === 0 ? "rgba(0, 0, 0, 0.2)" : "rgb(230, 230, 230, 0.2)"}>
      <Td textDecoration={"underline"}>
        <Link href={`https://etherscan.io/tx/${txHash}`} isExternal>
          {getEllipsisTxt(txHash)}
        </Link>
      </Td>
      <Td>{amount}</Td>
      <Td>
        <Box w={"50px"}>{icons[poolId]}</Box>
      </Td>
      <Td>{poolId === "0" ? "-" : tokenId}</Td>
      <Td>{date}</Td>
      <Td textAlign={"end"}>{priceUSD}</Td>
    </Tr>
  );
};
