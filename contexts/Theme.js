import { createContext, useContext, useEffect } from "react";
import { useColorMode } from "@chakra-ui/react";

const ThemeContext = createContext();

export const ThemeWrapper = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if(colorMode === "light"){
      toggleColorMode();
    }
  }, [colorMode])
  
  

  return(
    <ThemeContext.Provider value={null}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => {
  return useContext(ThemeContext);
}
