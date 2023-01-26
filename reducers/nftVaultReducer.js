export const initialnftVaultState = {
  isStakeFlow: false,
  poolId: "",
  mainTokenId: "",
  mainTypePoolId: "",
  dogTokenId: "",
  apeAmount: "1",
  sortType: 0,
  hasConfirmed: false,
  index: undefined,
};

export const nftVaultReducer = (state, action) => {
  switch (action.type) {
    case "HANDLE_IS_STAKE_FLOW":
      return {
        ...state,
        isStakeFlow: action.payload,
      };
    case "HANDLE_INDEX":
      return {
        ...state,
        index: action.payload,
      };
    case "HANDLE_POOL":
      return {
        ...state,
        poolId: action.payload,
      };
    case "HANDLE_MAIN_TOKEN_ID":
      return {
        ...state,
        mainTokenId: action.payload,
      };
    case "HANDLE_MAIN_POOL_ID":
      return {
        ...state,
        mainTypePoolId: action.payload,
      };
    case "HANDLE_DOG":
      return {
        ...state,
        dogTokenId: action.payload,
      };
    case "HANDLE_APE_AMOUNT":
      return {
        ...state,
        apeAmount: action.payload,
      };
    case "HANDLE_SORT_TYPE":
      return {
        ...state,
        sortType: action.payload,
      };
    case "HANDLE_CONFIRM":
      return {
        ...state,
        hasConfirmed: action.payload,
      };
    case "RESET":
      return {
        ...initialnftVaultState,
      };
    default:
      throw new Error();
  }
};
