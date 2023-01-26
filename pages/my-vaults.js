import { useRouter } from "next/router";
import { MyVaults } from "../components/Vault/MyVaults";
import { Box } from "@chakra-ui/react";

export default function Vault() {
  const router = useRouter();
  //if no wallet view
  //if not valid address in url params

  return (
    <Box pt={{ base: "8", md: "12" }} px="2">
      <MyVaults />
    </Box>
  );
}
