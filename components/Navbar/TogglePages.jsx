import { ButtonGroup, Button } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";

export const TogglePages = () => {
  const router = useRouter();

  return (
    <ButtonGroup
      border={"1px solid rgba(230, 230, 230, 0.3)"}
      bgColor="rgba(228, 228, 228, 0.1)"
      spacing="0"
      borderRadius={"full"}
      fontFamily={"Space Mono, monospace"}
    >
      <Link href="/">
        <ToggleButton
          isActive={router?.asPath === "/" || router?.asPath === "/auto-compound"}
          buttonText="Staking"
        />
      </Link>
      <Link href="/lending">
        <ToggleButton
          isActive={
            router?.asPath === "/lending" ||
            router?.asPath === "/my-vaults" ||
            router?.pathname === "/vault/[id]"
          }
          buttonText="Lending"
        />
      </Link>
    </ButtonGroup>
  );
};

const ToggleButton = (props) => {
  const { buttonText, isActive, ...rest } = props;
  return (
    <Button
      {...rest}
      bgColor={isActive ? "#FF0083" : "transparent"}
      borderRadius={"full"}
      py="4"
      boxShadow={isActive ? "0px 8px 24px rgba(255, 0, 131, 0.64)" : ""}
      px="4"
      size={{ base: "sm", md: "md" }}
      _hover={{
        backgroundColor: "#ed007b",
      }}
      _active={{
        backgroundColor: "#d4006e",
      }}
    >
      {buttonText}
    </Button>
  );
};
