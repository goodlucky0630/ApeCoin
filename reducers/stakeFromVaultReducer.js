export const initVaultStakeState = {
  chosenToken: {
    tokenId: "",
    poolId: "",
    contractAddress: "",
    mainTokenId: "",
    mainTypePoolId: "",
    mainContractAddress: "",
  },
  apeCoinAmount: "",
  unstakeAmount: "",
};

export const stakeFromVaultReducer = (state, action) => {
  switch (action.type) {
    case "HANDLE_CHOOSE_TOKEN":
      return {
        ...state,
        chosenToken: action.payload,
      };
    case "HANDLE_CHOOSE_AMOUNT":
      return {
        ...state,
        apeCoinAmount: action.payload,
      };
    case "HANDLE_UNSTAKE_AMOUNT":
      return {
        ...state,
        unstakeAmount: action.payload,
      };
    case "RESET":
      return {
        ...initVaultStakeState,
      };
    default:
      throw new Error();
  }
};
