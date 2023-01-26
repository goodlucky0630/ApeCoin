export const initCollateralState = {
  chosenTokens: [],
  vault: "",
};

export const collateralReducer = (state, action) => {
  switch (action.type) {
    case "HANDLE_CHOOSE_TOKEN":
      return {
        ...state,
        chosenTokens: action.payload,
      };
    case "HANDLE_CHOOSE_VAULT":
      return {
        ...state,
        vault: action.payload,
      };
    case "RESET":
      return {
        ...initCollateralState,
      };
    default:
      throw new Error();
  }
};
