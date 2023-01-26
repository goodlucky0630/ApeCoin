import { ButtonGroup } from "@chakra-ui/react";
import { OutlineButton } from "../Buttons/OutlineButton";
import BlueButton from "../Buttons/BlueButton";
import { useUserContext } from "../../contexts/User";
import { useSigner, useNetwork } from "wagmi";
import { ethers } from "ethers";
import { STAKING } from "../../constants/addresses";
import { STAKING_ABI } from "../../constants/abi";
import { useMemo, useState } from "react";
import { errorToast, successToast, infoToast } from "../../pages/_app";
import { formatAmount } from "../../utils/formatters";
import { CHAIN } from "../../constants/chain";
const claimFns = { 1: "claimSelfBAYC", 2: "claimSelfMAYC", 3: "claimSelfBAKC" };

export const StakeFlowActions = ({
  chosenNFT,
  handleSetShowInput,
  showInput,
  isUnstaking,
}) => {
  const userContext = useUserContext();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const [isClaiming, setIsClaiming] = useState(false);
  const stakingInstance = useMemo(
    () => new ethers.Contract(STAKING, STAKING_ABI, signer),
    [signer]
  );

  const claim = async () => {
    if (chain.id !== CHAIN) {
      infoToast("Incorrect Network", "Please switch to Ethereum Mainnet");
      return;
    }
    if (!signer) {
      infoToast("No Wallet Found", "Please connect wallet to claim.");
      return;
    }
    if (Number(chosenNFT?.claimableAmount) === 0) {
      infoToast("Nothing To Claim", "Currently do not have $APE to claim.");
      return;
    }
    try {
      setIsClaiming(true);
      let params = undefined;
      let result;
      if (chosenNFT.poolId === "1" || chosenNFT.poolId === "2") {
        params = [chosenNFT.tokenId];
        const claimApe = await stakingInstance[claimFns[chosenNFT.poolId]](
          params
        );
        result = await claimApe.wait();
      }
      if (chosenNFT.poolId === "3") {
        if (chosenNFT.mainTypePoolId === "1") {
          params = [
            {
              mainTokenId: chosenNFT.mainTokenId,
              bakcTokenId: chosenNFT.tokenId,
            },
          ];
        }
        if (chosenNFT.mainTypePoolId === "2") {
          params = [
            {
              mainTokenId: chosenNFT.mainTokenId,
              bakcTokenId: chosenNFT.tokenId,
            },
          ];
        }
        const claimApe = await stakingInstance[claimFns[chosenNFT.poolId]](
          chosenNFT.mainTypePoolId === "1" ? params : [],
          chosenNFT.mainTypePoolId === "2" ? params : []
        );
        result = await claimApe.wait();
      }

      if (result.status === 1) {
        setIsClaiming(false);
        const claimAmount = formatAmount(
          ethers.utils.formatEther(chosenNFT?.claimableAmount.toString())
        );
        successToast("Successfully Claimed", `Claimed ${claimAmount} $APE!`);
        await userContext.getBalance();
        await userContext.getAllPools();
        await userContext.getAllStakes();
      }
    } catch (error) {
      setIsClaiming(false);
      console.log(error);
      errorToast("Error", "An error occurred while claiming.");
    }
  };

  return (
    <ButtonGroup
      spacing="0"
      gap="2"
      w="full"
      flexDirection={{ base: "column", md: "row" }}
    >
      <BlueButton
        w="full"
        isLoading={isClaiming}
        isDisabled={showInput}
        loadingText="Claiming"
        onClick={claim}
        buttonText="Claim"
      />
      <OutlineButton
        w="full"
        isDisabled={isClaiming}
        onClick={() => handleSetShowInput(true, false)}
        buttonText="Stake"
        bgColor={showInput && !isUnstaking ? "#ed007b" : "initial"}
      />
      <OutlineButton
        w="full"
        isDisabled={isClaiming}
        onClick={() => handleSetShowInput(true, true)}
        buttonText="Unstake"
        bgColor={showInput && isUnstaking ? "#ed007b" : "initial"}
      />
    </ButtonGroup>
  );
};
