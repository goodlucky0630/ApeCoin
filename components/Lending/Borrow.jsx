import { Stack, Flex, Heading, Box, HStack, Grid, Text, Image, Button, Center } from "@chakra-ui/react";
import { CardWrapper } from "../Card/CardWrapper";
import { extendTheme } from "@chakra-ui/react";
import { useState } from "react";
import { MakeOffer } from "./MakeOffer";
import { Confirmation } from "./Confirmation";
import { Success } from "./Success";
import { useAccount } from "wagmi";
import { DesiredTerms } from "./DesiredTerms";

export const Borrow = ({ desiredOffer, vault, offers, getOffers, getBorrowNotes, loanId }) => {
  const [show, setShow] = useState(true);
  const { address } = useAccount();

  return (
    <Box
      backgroundColor="rgba(18, 22, 33, 0.5)"
      border="1px solid rgba(230, 230, 230, 0.1)"
      borderRadius={"12px"}
      px={{ md: "6", base: "4" }}
      py="4"
      pos="relative"
      width="100%"
      fontFamily={"Space Mono, monospace"}
    >
      <Stack alignItems={"center"} height="max">
        <Flex
          border="1px solid rgba(230, 230, 230, 0.1)"
          width="min"
          borderRadius="100"
          justifyContent="center"
        >
          <Box
            onClick={() => setShow(true)}
            borderRadius={"100"}
            fontWeight="bold"
            px="6"
            py="2"
            cursor="pointer"
            fontSize={{ md: "base", sm: "sm", base: "xs" }}
            backgroundColor={`${show ? "#FF0083" : "transparent"}`}
            className="whitespace-nowrap"
          >
            Desired Terms
          </Box>
          {vault?.owner?.toLowerCase() !== address?.toLowerCase() && (
            <Box
              onClick={() => setShow(false)}
              borderRadius={"100"}
              fontWeight="bold"
              px="6"
              py="2"
              cursor="pointer"
              fontSize={{ md: "base", sm: "sm", base: "xs" }}
              backgroundColor={`${show ? "transparent" : "#FF0083"}`}
              className="whitespace-nowrap"
            >
              Make an Offer
            </Box>
          )}
        </Flex>
        {show ? (
          !desiredOffer ? (
            <Flex
              alignItems={"center"}
              height={{ md: "525px", base: "440px" }}
              fontWeight={"bold"}
              fontSize="lg"
              textAlign="center"
            >
              Borrower is open to offers!
            </Flex>
          ) : (
            <DesiredTerms
              offer={desiredOffer}
              allOffers={offers}
              getOffers={getOffers}
              vault={vault}
              getBorrowNotes={getBorrowNotes}
              loanId={loanId}
            />
          )
        ) : (
          <MakeOffer vault={vault} offers={offers} getOffers={getOffers} />
        )}
      </Stack>
      {/* <Success /> */}
      {/* <Confirmation /> */}
    </Box>
  );
};
