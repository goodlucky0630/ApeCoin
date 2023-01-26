import { useState } from "react";

export const useIsSignedIn = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  return { isSignedIn, setIsSignedIn };
};
