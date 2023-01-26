import { Flex, Box, Text, Image, Input, VStack, ButtonGroup, Stack } from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { useAccount, useNetwork, useSigner } from "wagmi";
import {
  APECOIN,
  ITEMS_VERIFIER,
  ORIGINATION_CONTROLLER,
  REPAYMENT_CONTROLLER,
  VAULT_FACTORY,
} from "../../constants/addresses";
import {
  calculateAPR,
  calculateDays,
  encodeSignatureItems,
} from "../../utils/createLoanTermsSignatureWithItems";
import { RoundButton } from "../Buttons/RoundButton";
import { constants, ethers } from "ethers";
import { ERC20_ABI, ORIGINATION_CONTROLLER_ABI, REPAYMENT_CONTROLLER_ABI } from "../../constants/abi";
import { errorToast, infoToast, successToast } from "../../pages/_app";
import axios from "axios";
import { BsTrash } from "react-icons/bs";
import { CHAIN } from "../../constants/chain";
import { useApeCoinAllowance } from "../../hooks/useApeCoinAllowance";
import { useApeCoinApproval } from "../../hooks/useApeCoinApproval";
import { fromRpcSig } from "ethereumjs-util";
import { formatAmount } from "../../utils/formatters";
import { useUserContext } from "../../contexts/User";

export const DesiredTerms = ({ vault, offer, getOffers, allOffers, loanId, getBorrowNotes }) => {
  const userContext = useUserContext();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isRepaying, setIsRepaying] = useState(false);
  const { data: signer } = useSigner();
  const apeInstance = useMemo(() => new ethers.Contract(APECOIN, ERC20_ABI, signer), [signer]);
  const controllerInstance = useMemo(
    () => new ethers.Contract(ORIGINATION_CONTROLLER, ORIGINATION_CONTROLLER_ABI, signer),
    [signer]
  );
  const repaymentInstance = useMemo(
    () => new ethers.Contract(REPAYMENT_CONTROLLER, REPAYMENT_CONTROLLER_ABI, signer),
    [signer]
  );
  const { data: apeAllowance, getAllowance } = useApeCoinAllowance(ORIGINATION_CONTROLLER);
  const { isLoading: isApproving, approveSpender } = useApeCoinApproval();
  const needsApproval = apeAllowance && Number(apeAllowance) !== Number(constants.MaxUint256);

  const deleteDesiredTerms = async () => {
    if (offer.owner !== address.toLowerCase()) {
      infoToast("No Owner Of Vault", "Must be owner of vault to do this action");
      return;
    }
    if (!userContext.isSignedIn) {
      infoToast("Please Sign In", "Sign message in wallet to sign in to continue");
      return;
    }
    try {
      setIsDeleting(true);
      const deleteTerms = await axios.delete("/api/offers", {
        params: {
          signersAddress: offer.signersAddress,
          id: offer.id,
        },
      });
      if (deleteTerms.data.offerDeleted) {
        successToast("Terms Deleted");
        await getOffers();
      } else {
        errorToast("An Error Occurred Deleting Terms");
      }
      setIsDeleting(false);
    } catch (error) {
      console.log(error);
      errorToast("An Error Occurred Deleting Terms");
      setIsDeleting(false);
    }
  };

  const startLoanAsLender = async () => {
    if (!address) {
      infoToast("No Wallet Found", "Please connect a wallet.");
      return;
    }
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet.");
      return;
    }
    if (offer.owner === address.toLowerCase()) {
      infoToast("Cannot Loan To Yourself");
      return;
    }

    if (userContext.balance.lt(offer.principal)) {
      infoToast("Insufficient ApeCoin Balance");
      return;
    }
    if (!userContext.isSignedIn) {
      infoToast("Please Sign In", "Sign message in wallet to sign in to continue");
      return;
    }
    try {
      setIsStarting(true);
      const loanTerms = {
        durationSecs: Number(offer.duration),
        principal: offer.principal.toString(),
        interestRate: offer.interestRate.toString(),
        collateralAddress: VAULT_FACTORY.toLowerCase(),
        collateralId: vault.vaultTokenId,
        payableCurrency: APECOIN.toLowerCase(),
        numInstallments: Number(offer.numOfInstallments),
        deadline: Number(offer.deadline),
      };

      let signatureItems = [];
      for (let i = 0; i < vault.inventory.length; i++) {
        signatureItems.push({
          cType: 0,
          asset: vault.inventory[i].contract,
          tokenId: vault.inventory[i].tokenId,
          amount: 0,
        });
      }
      const predicates = [
        {
          verifier: ITEMS_VERIFIER,
          data: encodeSignatureItems(signatureItems),
        },
      ];

      if (needsApproval) {
        const approved = await approveSpender(ORIGINATION_CONTROLLER);
        if (!approved) {
          errorToast("An Error Occurred", "An error occurred giving approval.");
          return;
        }
        await getAllowance();
      }

      const initLoan = await controllerInstance.initializeLoanWithItems(
        loanTerms,
        offer.owner.toLowerCase(),
        address.toLowerCase(),
        fromRpcSig(offer.signature),
        Number(offer.nonce),
        predicates
      );
      const result = await initLoan.wait();
      if (result.status === 1) {
        await axios.put("/api/offers", {
          offerId: offer.id,
          status: "ACCEPTED",
          lendersAddress: address,
          sender: address,
        });
        await getOffers();
        setIsStarting(false);
        successToast("Successfully Started Loan", "Loan has been initialized!");
        await getBorrowNotes();
      }
    } catch (error) {
      console.log(error);
      errorToast("An Error Occurred", "An error occurred starting loan.");
      setIsStarting(false);
    }
  };

  const repayLoan = async () => {
    if (!userContext.isSignedIn) {
      infoToast("Please Sign In", "Sign message in wallet to sign in to continue");
      return;
    }
    if (userContext.balance.lt(offer.repayment)) {
      infoToast("Insufficient ApeCoin Balance");
      return;
    }
    if (!userContext.isSignedIn) {
      infoToast("Please Sign In", "Sign message in wallet to sign in to continue");
      return;
    }
    try {
      setIsRepaying(true);
      const repayAllowance = await getAllowance(REPAYMENT_CONTROLLER);

      const repaymentNeedsApproval =
        repayAllowance && Number(repayAllowance) !== Number(constants.MaxUint256);

      if (repaymentNeedsApproval) {
        await approveSpender(REPAYMENT_CONTROLLER);
      }
      const repay = await repaymentInstance.repay(loanId);
      const result = await repay.wait();
      if (result.status === 1) {
        await axios.put("/api/updateOffersStatus", {
          allOffers: allOffers,
          owner: vault.owner,
          lendersAddress: offer.lendersAddress,
          newStatus: "REPAID",
        });
        await getOffers();
        setIsRepaying(false);
        successToast("Loan Repaid!", "Successfully repaid loan.");
        await getBorrowNotes();
      }
    } catch (error) {
      errorToast("An Error Occurred", "An error occurred repaying loan.");
      setIsRepaying(false);
    }
  };

  return (
    <VStack textAlign="left" gap={{ md: "10", base: "3" }}>
      <VStack align="stretch" width="100%" mt="4">
        <Text fontSize="sm" mb="3px">
          Principal
        </Text>
        <Flex
          width="100%"
          borderRadius="3px"
          alignItems="center"
          bgColor="rgba(228, 228, 228, 0.1)"
          border="1px solid #b0005a"
        >
          <Input
            fontSize="xl"
            bgColor="transparent"
            fontWeight="bold"
            width="100%"
            border="0px"
            focusBorderColor="none"
            name="principal"
            isDisabled={isDeleting || isRepaying || isStarting || isApproving}
            type="number"
            value={ethers.utils.formatEther(offer?.principal)}
            readOnly={true}
          />
          <Box h="55px" border="none" w="1px" bg="#b0005a" />
          <Image alt="" my="2" mx="4" width="40px" height="40px" src="/ape-coin.png" />
        </Flex>
      </VStack>
      <VStack align="stretch" width="100%" mt="4">
        <Text fontSize="sm" mb="3px">
          Repayment
        </Text>
        <Flex
          width="100%"
          borderRadius="3px"
          alignItems="center"
          bgColor="rgba(228, 228, 228, 0.1)"
          border="1px solid #b0005a"
        >
          <Input
            fontSize="xl"
            bgColor="transparent"
            fontWeight="bold"
            width="100%"
            border="0px"
            focusBorderColor="none"
            name="repayment"
            type="number"
            isDisabled={isDeleting || isRepaying || isStarting || isApproving}
            value={ethers.utils.formatEther(offer?.repayment)}
            readOnly={true}
          />
          <Box h="55px" border="none" w="1px" bg="#b0005a" />
          <Image alt="" my="2" mx="4" width="40px" height="40px" src="/ape-coin.png" />
        </Flex>
      </VStack>
      <Flex gap={{ md: "10", base: "4" }}>
        <VStack width="100%" align="stretch" mt="0">
          <Text fontSize="sm" mb="3px">
            Duration
          </Text>
          <Flex
            width="100%"
            borderRadius="3px"
            alignItems="center"
            bgColor="rgba(228, 228, 228, 0.1)"
            border="1px solid #b0005a"
          >
            <Input
              fontSize={{ md: "xl", base: "md" }}
              bgColor="transparent"
              fontWeight="bold"
              width="100%"
              border="0px"
              focusBorderColor="none"
              px={{ md: "4", base: "2" }}
              name="duration"
              type="number"
              isDisabled={isDeleting || isRepaying || isStarting || isApproving}
              value={calculateDays(offer?.duration)}
              readOnly={true}
            />
            <Box h="55px" border="none" w="1px" bg="#b0005a" />
            <Text fontSize={{ md: "xl", base: "base" }} fontWeight="bold" mx={{ md: "5", base: "2" }}>
              DAYS
            </Text>
            {/* <Box my="2" mx={{ md: "4", base: "2" }} w="35px" h="35px">
              <Clock />
            </Box> */}
          </Flex>
        </VStack>
        <VStack align="stretch" width="100%" mt="0">
          <Text fontSize="sm" mb="3px">
            Interest
          </Text>
          <Flex
            width="100%"
            borderRadius="3px"
            alignItems="center"
            bgColor="rgba(228, 228, 228, 0.1)"
            border="1px solid #b0005a"
          >
            <Input
              fontSize={{ md: "xl", base: "md" }}
              bgColor="transparent"
              fontWeight="bold"
              width="100%"
              border="0px"
              focusBorderColor="none"
              px={{ md: "4", base: "2" }}
              readOnly={true}
              isDisabled={isDeleting || isRepaying || isStarting || isApproving}
              value={calculateAPR({
                principal: offer?.principal,
                repayment: offer?.repayment,
                durationInDays: calculateDays(offer?.duration),
              })}
            />
            <Box h="55px" border="none" w="1px" bg="#b0005a" />
            <Text fontSize={{ md: "xl", base: "base" }} fontWeight="bold" mx={{ md: "5", base: "2" }}>
              APR
            </Text>
          </Flex>
        </VStack>
      </Flex>
      <ButtonGroup justifyContent={"space-between"} w="full">
        {offer?.owner !== address?.toLowerCase() && (
          <RoundButton
            buttonText={!needsApproval ? "Approved" : "Approve APE"}
            size="lg"
            onClick={async () => {
              await approveSpender(ORIGINATION_CONTROLLER);
              await getAllowance();
            }}
            isDisabled={isRepaying || isStarting || isApproving || !needsApproval}
            isLoading={isApproving}
            loadingText={"Approving"}
          />
        )}
        {offer?.owner === address?.toLowerCase() ? (
          <>
            {offer?.status === "DESIRED" && (
              <RoundButton
                buttonText="Delete Terms"
                size="lg"
                leftIcon={<BsTrash />}
                onClick={deleteDesiredTerms}
                isLoading={isDeleting}
                isDisabled={isDeleting || isRepaying || isStarting || isApproving}
                loadingText={"Deleting"}
              />
            )}
            {/* if owner of loan and status not defaulted */}
            {offer?.status === "ACCEPTED" && (
              <Stack align={"start"}>
                <RoundButton
                  w="fit-content"
                  buttonText="Repay Loan"
                  size="lg"
                  onClick={repayLoan}
                  isDisabled={isDeleting || isRepaying || isStarting || isApproving}
                  isLoading={isRepaying}
                  loadingText={"Repaying Loan"}
                />
                <Box fontSize={"xs"}>
                  Due on{" "}
                  {new Date(Number(offer?.deadline) * 1000).toDateString() +
                    " " +
                    new Date(Number(offer?.deadline) * 1000).toLocaleTimeString()}
                </Box>
              </Stack>
            )}
            {offer?.status === "ACCEPTED" && Math.round(new Date().getTime() / 1000) > offer.deadline && (
              <RoundButton buttonText="DEFAULTED" bgColor="red" isDisabled={true} />
            )}
          </>
        ) : (
          <>
            <RoundButton
              buttonText="Start Loan"
              size="lg"
              onClick={startLoanAsLender}
              isDisabled={isDeleting || isRepaying || isStarting || isApproving}
              isLoading={isStarting}
              loadingText={"Starting Loan"}
            />
          </>
        )}
      </ButtonGroup>
    </VStack>
  );
};
