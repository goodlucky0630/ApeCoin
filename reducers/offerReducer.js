export const initialFormState = {
  principal: "",
  repayment: "",
  duration: "",
  apr: "0.00%",
  isSigning: false,
  signature: "",
};

export const offerReducer = (state, action) => {
  switch (action.type) {
    case "HANDLE_TEXT_INPUT":
      return {
        ...state,
        [action.field]: action.payload,
      };
    case "HANDLE_APR":
      return {
        ...state,
        apr: action.payload,
      };
    case "HANDLE_SIGNING":
      return {
        ...state,
        isSigning: action.payload,
      };
    case "HANDLE_SIGNATURE":
      return {
        ...state,
        signature: action.payload,
      };
    case "RESET":
      return {
        ...initialFormState,
      };
    default:
      throw new Error();
  }
};
