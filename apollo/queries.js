import gql from "graphql-tag";

export const GET_TIMESTAMPS_FROM_BLOCK_NUMBERS = (blockNumbers) => {
  let queryString = "query blocks {";
  queryString += blockNumbers.map((blockNumber, idx) => {
    return `t${blockNumber}${idx}:blocks(where: { number: ${blockNumber} }) {
        timestamp
      }`;
  });
  queryString += "}";
  return gql(queryString);
};

export const GET_APE_HOLDER_COUNT = gql`
  query token {
    token(id: "0x4d224452801aced8b2f0aebe155379bb5d594381") {
      holders
    }
  }
`;
