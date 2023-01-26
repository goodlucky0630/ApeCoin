import { Box } from "@chakra-ui/react";

export const CardWrapper = (props) => {
  const { children, ...rest } = props;
  return (
    <Box
      {...rest}
      flex="1"
      backgroundColor="rgba(18, 22, 33, 0.5)"
      border="1px solid rgba(230, 230, 230, 0.1)"
      borderRadius={"12px"}
      px="6"
      py="4"
      boxShadow={
        "0px 67px 80px rgba(14, 40, 227, 0.05), 0px 14.8258px 33.4221px rgba(14, 40, 227, 0.0359427), 0px 7.77701px 17.869px rgba(14, 40, 227, 0.0298054), 0px 5.79391px 10.0172px rgba(14, 40, 227, 0.025), 0px 4.93149px 5.32008px rgba(14, 40, 227, 0.0201946), 0px 3.40994px 2.21381px rgba(14, 40, 227, 0.0140573)"
      }
    >
      {children}
    </Box>
  );
};
