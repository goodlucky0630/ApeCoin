import { Button, ButtonGroup } from "@chakra-ui/react";
import { useUserContext } from "../../contexts/User";

export const SortRow = (props) => {
  const { ...rest } = props;
  const userContext = useUserContext();

  return (
    <ButtonGroup
      {...rest}
      w="fit-content"
      fontFamily={"Space Mono, monospace"}
      spacing="0"
      borderRadius={"full"}
      bg="rgba(228, 228, 228, 0.1)"
    >
      <SortButton
        buttonText="All"
        onClick={() =>
          userContext.dispatch({ type: "HANDLE_SORT_TYPE", payload: 0 })
        }
        isActive={userContext.state.sortType === 0}
      />
      <SortButton
        buttonText="Staked"
        onClick={() =>
          userContext.dispatch({ type: "HANDLE_SORT_TYPE", payload: 1 })
        }
        isActive={userContext.state.sortType === 1}
      />
      <SortButton
        buttonText="Eligible"
        onClick={() =>
          userContext.dispatch({ type: "HANDLE_SORT_TYPE", payload: 2 })
        }
        isActive={userContext.state.sortType === 2}
      />
    </ButtonGroup>
  );
};

const SortButton = (props) => {
  const { buttonText, isActive, onClick, ...rest } = props;
  return (
    <Button
      {...rest}
      bg={isActive ? "#FF0083" : "transparent"}
      px="4"
      onClick={onClick}
      borderRadius={"full"}
      fontWeight="600"
      py="0"
      size="xs"
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
