import {
  Stack,
  Flex,
  Heading,
  Box,
  HStack,
  Grid,
  Text,
  Image,
  Button,
  Center,
  Input,
  Divider,
  VStack,
  ButtonGroup,
} from "@chakra-ui/react";
import { infoToast } from "../../pages/_app";
import { useReducer, useState, useMemo, useEffect } from "react";
import { useAccount, useSigner, useNetwork } from "wagmi";
import { ITEMS_VERIFIER, ORIGINATION_CONTROLLER, VAULT_FACTORY, APECOIN } from "../../constants/addresses";
import { initialFormState, offerReducer } from "../../reducers/offerReducer";
import {
  calculateAPR,
  calculateProtocolInterestRate,
  calculateSeconds,
  createLoanItemsSignature,
  createLoanTermsPayload,
  createLoanTermsSignature,
  encodePredicates,
  encodeSignatureItems,
  getDeadline,
  timeNowInSeconds,
} from "../../utils/createLoanTermsSignatureWithItems";
import { RoundButton } from "../Buttons/RoundButton";
import { Clock } from "../Icons/Clock";
import { SignOffer } from "../Icons/SignOffer";
import { constants, ethers } from "ethers";
import { ASSET_VAULT_ABI, VAULT_FACTORY_ABI } from "../../constants/abi";
import { errorToast, successToast } from "../../pages/_app";
import { CHAIN } from "../../constants/chain";
import axios from "axios";
import { parseEther } from "ethers/lib/utils";
import { useUserContext } from "../../contexts/User";
import { useApeCoinAllowance } from "../../hooks/useApeCoinAllowance";
import { useApeCoinApproval } from "../../hooks/useApeCoinApproval";

export const MakeOffer = ({ vault, offers, getOffers }) => {
  const [state, dispatch] = useReducer(offerReducer, initialFormState);
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const vaultFactoryInstance = useMemo(
    () => new ethers.Contract(VAULT_FACTORY, VAULT_FACTORY_ABI, signer),
    [signer]
  );
  const { data: apeAllowance, getAllowance } = useApeCoinAllowance(ORIGINATION_CONTROLLER);
  const { isLoading: isApprovingApe, approveSpender } = useApeCoinApproval();
  const needsApproval = apeAllowance && Number(apeAllowance) !== Number(constants.MaxUint256);
  const userContext = useUserContext();

  const [isOCApproved, setIsOCApproved] = useState(undefined);
  const [isApproving, setIsApproving] = useState(false);

  const getIsApproved = async () => {
    try {
      const operator = await vaultFactoryInstance.getApproved(vault.vaultTokenId);
      if (operator.toLowerCase() === ORIGINATION_CONTROLLER.toLowerCase()) {
        setIsOCApproved(true);
      } else {
        setIsOCApproved(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (vaultFactoryInstance.provider !== null && isOCApproved === undefined) {
      getIsApproved();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultFactoryInstance, isOCApproved]);

  const handleTextInput = (e) => {
    dispatch({
      type: "HANDLE_TEXT_INPUT",
      payload: e.target.name === "duration" ? String(Math.round(Number(e.target.value))) : e.target.value,
      field: e.target.name,
    });
  };

  const handleIsSigning = (bool) => {
    dispatch({
      type: "HANDLE_SIGNING",
      payload: bool,
    });
  };

  const signLoanTerms = async () => {
    if (!address) {
      infoToast("No Wallet Found", "Please connect a wallet.");
      return;
    }
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet.");
      return;
    }
    if (!userContext.isSignedIn) {
      infoToast("Please Sign In", "Sign message in wallet to sign in to make an offer");
      return;
    }
    const principal = state.principal;
    const repayment = state.repayment;
    if (principal === "" || repayment === "" || state.duration === "") {
      infoToast("Empty Field Found", "All fields must be filled out");
      return;
    }
    if (Number(state.duration) <= 0) {
      infoToast("Duration Too Low", "Duration must be greater than zero.");
      return;
    }
    if (Number(repayment) <= Number(principal)) {
      infoToast("Repayment Too Low", "Repayment must be greater than Principal");
      return;
    }
    try {
      handleIsSigning(true);
      const side = address.toLowerCase() === vault?.owner?.toLowerCase() ? 0 : 1;
      if (side === 1) {
        //if lender check apecoin balance
        if (userContext.balance.lt(ethers.utils.parseEther(principal))) {
          infoToast(
            "ApeCoin Balance Too Low",
            `ApeCoin balance in wallet must be greater than ${principal}.`
          );
          handleIsSigning(false);

          return;
        }
      }
      let interestRate = calculateProtocolInterestRate({
        principal, //must be whole number, not wei, like what user is inputing
        repayment, //must be whole number, not wei, like what user is inputing
      });
      interestRate = interestRate.interestInWei.toString();

      const durationSecs = calculateSeconds(state.duration);
      const deadline = getDeadline(durationSecs);
      const collateralAddress = vault.vault;
      // const nonce = await vaultFactoryInstance.nonces(address);
      const nonce = Math.round(new Date().getTime() / 1000) + Number(await signer.getTransactionCount());
      const sideForSig = address.toLowerCase() === vault?.owner?.toLowerCase() ? "b" : "l";

      const loanTerms = {
        durationSecs: durationSecs,
        principal: parseEther(principal),
        interestRate: interestRate,
        collateralAddress: VAULT_FACTORY.toLowerCase(),
        collateralId: vault.vaultTokenId,
        payableCurrency: APECOIN.toLowerCase(),
        numInstallments: 0,
        deadline: deadline,
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

      const itemsHash = encodePredicates(predicates);

      const signature = await createLoanItemsSignature(
        ORIGINATION_CONTROLLER.toLowerCase(),
        "OriginationController",
        loanTerms,
        itemsHash,
        signer,
        "2",
        Number(nonce),
        sideForSig
      );

      dispatch({
        type: "HANDLE_SIGNATURE",
        payload: signature,
      });

      let status = "";
      if (!isOCApproved && side === 0) {
        const approve = await approveOC();
        if (!approve) {
          return;
        }
      }
      if (needsApproval && side === 1) {
        const approved = await approveSpender(ORIGINATION_CONTROLLER);
        if (!approved) {
          errorToast("An Error Occurred", "An error occurred giving approval.");
          return;
        }
        await getAllowance();
      }
      if (side === 0) {
        status = "DESIRED";
      } else {
        status = "LENDER";
      }

      const sendToDB = await sendOfferToDB(
        vault?.owner?.toLowerCase(),
        address.toLowerCase(),
        vault.vault.toLowerCase(),
        signature,
        String(nonce),
        durationSecs,
        deadline,
        interestRate,
        parseEther(principal).toString(),
        parseEther(repayment).toString(),
        collateralAddress.toLowerCase(),
        itemsHash,
        vault.vaultTokenId,
        vault.owner.toLowerCase() === address.toLowerCase() ? "" : address.toLowerCase(),
        status
      );
      if (!sendToDB) {
        handleIsSigning(false);
        dispatch({
          type: "RESET",
        });
      } else {
        handleIsSigning(false);
        await getOffers();
        dispatch({
          type: "RESET",
        });
        successToast("Successfully Submitted Offer!");
      }

      handleIsSigning(false);
    } catch (error) {
      handleIsSigning(false);
      console.log(error);
      dispatch({
        type: "RESET",
      });
    }
  };

  const sendOfferToDB = async (
    owner,
    signersAddress,
    vaultAddress,
    signature,
    nonce,
    durationSecs,
    deadline,
    interestRate,
    principal,
    repayment,
    collateralAddress,
    itemsHash,
    vaultTokenId,
    lendersAddress,
    status
  ) => {
    try {
      const isAccepted = await axios.post("/api/offers", {
        offer: {
          owner: owner,
          signersAddress: signersAddress,
          vault: vaultAddress,
          signature: signature,
          nonce: nonce.toString(),
          duration: durationSecs.toString(),
          deadline: deadline.toString(),
          numOfInstallments: "0",
          interestRate: interestRate,
          principal: principal,
          repayment: repayment,
          collateralAddress: collateralAddress,
          itemsHash: itemsHash,
          vaultTokenId: vaultTokenId,
          lendersAddress: lendersAddress,
          status: status,
        },
      });
      return isAccepted.data.offerAccepted;
    } catch (error) {
      console.log(error);
      handleIsSigning(false);
      console.log(error);
      dispatch({
        type: "RESET",
      });
    }
  };

  const approveOC = async () => {
    if (!signer) {
      infoToast("No Wallet Found", "Please connect a wallet.");
      return;
    }
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet.");
      return;
    }
    try {
      setIsApproving(true);

      const approve = await vaultFactoryInstance.approve(ORIGINATION_CONTROLLER, vault.vaultTokenId);
      const result = await approve.wait();
      if (result.status === 1) {
        setIsApproving(false);
        successToast("Successfully Granted Approval");
        return true;
      }
    } catch (error) {
      setIsApproving(false);
      errorToast("An Error Occurred", "An error occurred granting approval.");
      console.log(error);
      dispatch({
        type: "RESET",
      });
      return false;
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
            isDisabled={state.isSigning}
            name="principal"
            type="number"
            value={state.principal}
            onChange={handleTextInput}
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
            isDisabled={state.isSigning}
            value={state.repayment}
            onChange={handleTextInput}
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
              isDisabled={state.isSigning}
              type="number"
              value={state.duration}
              onChange={handleTextInput}
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
              value={calculateAPR({
                principal: state.principal,
                repayment: state.repayment,
                durationInDays: state.duration,
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
        {vault?.owner.toLowerCase() !== address?.toLowerCase() ? (
          needsApproval && <RoundButton
            buttonText={!needsApproval ? "Approved" : "Approve APE"}
            size="lg"
            onClick={async () => approveSpender(ORIGINATION_CONTROLLER)}
            isDisabled={isApprovingApe || state.isSigning || !needsApproval}
            isLoading={isApprovingApe}
            loadingText={"Approving"}
          />
        ) : (
          !isOCApproved && <RoundButton
            buttonText={isOCApproved ? "Approved" : "Approve Assets"}
            size="lg"
            onClick={approveOC}
            isDisabled={isOCApproved || state.isSigning}
            isLoading={isApproving}
            loadingText={"Approving"}
          />
        )}
        <RoundButton
          buttonText={vault?.owner.toLowerCase() !== address?.toLowerCase() ? "Make Offer" : "Set Desired Terms"}
          size="lg"
          leftIcon={<SignOffer />}
          onClick={signLoanTerms}
          isLoading={state.isSigning}
          isDisabled={isApproving}
          loadingText={"Signing"}
        />
      </ButtonGroup>
    </VStack>
  );
};
