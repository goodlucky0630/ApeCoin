import { Stack, Flex, Box, Text, Button } from "@chakra-ui/react";
import { utils } from "ethers";
import { useNetwork, useSigner } from "wagmi";
import { timestampToDate } from "../../utils/formatters";
import { RoundButton } from "../Buttons/RoundButton";
import { ApeCoinLogo } from "../Icons/ApeCoinLogo";
import { ethers } from "ethers";
import { REPAYMENT_CONTROLLER } from "../../constants/addresses";
import { REPAYMENT_CONTROLLER_ABI } from "../../constants/abi";
import { useState, useMemo } from "react";
import { CHAIN } from "../../constants/chain";
import { errorToast, successToast } from "../../pages/_app";
import axios from "axios";
import { useUserContext } from "../../contexts/User";

export const LoanInformation = ({ offer, vaultOwner, allOffers, loanId, getOffers, getVaults }) => {
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const userContext = useUserContext();
  const repayInstance = useMemo(
    () => new ethers.Contract(REPAYMENT_CONTROLLER, REPAYMENT_CONTROLLER_ABI, signer),
    [signer]
  );
  const [isClaiming, setIsClaiming] = useState();

  const claim = async () => {
    if (!signer) {
      infoToast("No Wallet Found", "Please connect a wallet.");
      return;
    }
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet.");
      return;
    }
    if (!userContext.isSignedIn) {
      infoToast("Please Sign In", "Sign message in wallet to sign in to continue");
      return;
    }
    try {
      setIsClaiming(true);
      const claimVault = await repayInstance.claim(loanId);
      const result = await claimVault.wait();
      if (result.status === 1) {
        await axios.put("/api/updateOffersStatus", {
          allOffers: allOffers,
          owner: vaultOwner,
          lendersAddress: offer.lendersAddress,
          newStatus: "DEFAULTED",
        });

        await getVaults(true); //update who has the tokens now
        await getOffers();
        successToast("Successfully Claimed", "You now have your lent ApeCoin and assets from the vault.");
        setIsClaiming(false);
      }
    } catch (error) {
      console.log(error);
      setIsClaiming(false);
      errorToast("An Error Occurred", "An error occurred while claiming.");
    }
  };

  // for after claim

  return (
    <Box
      backgroundColor="rgba(18, 22, 33, 0.5)"
      border="1px solid rgba(230, 230, 230, 0.1)"
      borderRadius={"12px"}
      px={{ md: "6", base: "4" }}
      pb="7"
      pt="4"
      pos="relative"
      width="100%"
      fontFamily={"Space Mono, monospace"}
    >
      <Text fontWeight="bold" textAlign="center">
        LOAN INFORMATION
      </Text>

      <Stack justifyContent="center" alignItems="center" py="7.5rem" gap="5">
        <Box textAlign="center">
          <Text fontWeight="bold" fontSize="xl">
            You will receive
          </Text>
          <Flex gap="2" fontSize="xl" textAlign="center">
            {offer?.repayment ? utils.formatEther(offer?.repayment) : "-"}
            <ApeCoinLogo width="30px" />{" "}
            <Text as="span" color="#FFFFFF80">
              {" "}
              by{" "}
            </Text>{" "}
            {timestampToDate(offer?.deadline)}
          </Flex>
        </Box>
        <Flex w="100%" alignItems="center" gap="4" color="rgba(233, 233, 233, 0.3)" fontSize="lg">
          <Box h="1px" bg="rgba(233, 233, 233, 0.3)" w="100%" />
          or
          <Box h="1px" bg="rgba(233, 233, 233, 0.3)" w="100%" />
        </Flex>
        <Flex gap="2" fontSize="xl" textAlign="center">
          You can claim here to own the vault and it&apos;s inventory.
        </Flex>
        <RoundButton
          w="full"
          buttonText="Claim"
          py="7"
          isDisabled={Math.round(new Date().getTime() / 1000) < offer?.deadline || isClaiming}
          isLoading={isClaiming}
          loadingText="Claiming"
          onClick={claim}
        />
      </Stack>
    </Box>
  );
};
