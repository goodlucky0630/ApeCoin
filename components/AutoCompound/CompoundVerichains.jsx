import { useEffect, useState } from "react";
import { 
  Stack, 
  Text,
  Box,
  Image,
  Flex
} from "@chakra-ui/react";
import { GoFileSymlinkFile } from 'react-icons/go'

export const CompoundVerichains = () => {

  return (
    <Flex>
      <Stack spacing={4}>
        <Box/>
        <Text size='sm'>
          - Harvested and restaked every 24 hours at 12AM UTC
        </Text>
        <Text size='sm'>
          - Gas fees covered by NF3
        </Text>
        <Text size='sm'>
          - 1% convenience fee charged on rewards harvested
        </Text>
        <Flex position={'relative'}>
          <Text size='sm'>
            - Auto-compounding contract audited by Verichains 
            <a href="https://github.com/verichains/public-audit-reports/blob/main/Verichains%20Public%20Audit%20Report%20-%20NF3%20Auto%20Compouding%20-%20v1.0.pdf" target="_blank" rel="noreferrer">
              <span style={{display: "inline-block"}}>
                <GoFileSymlinkFile />
              </span>
            </a>
          </Text>
          <a href="https://github.com/verichains/public-audit-reports/blob/main/Verichains%20Public%20Audit%20Report%20-%20NF3%20Auto%20Compouding%20-%20v1.0.pdf" target="_blank" rel="noreferrer">
            <Image position={'absolute'} right={{md: "-80px", base: "-20px"}} top={{md: "-20px", base: "-10px"}} my="2" mx="4" width="50px" height="50px" src='/images/verichains-01.png' alt='verichains' />
          </a>
        </Flex>
        <Box h={'20px'} />
      </Stack>
    </Flex>
  );
};

