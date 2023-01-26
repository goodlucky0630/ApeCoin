import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";

export const blockClient = new ApolloClient({
  link: new HttpLink({
    // uri: "https://api.thegraph.com/subgraphs/name/dramacrypto/goerli-blocks",
    uri: "https://api.thegraph.com/subgraphs/name/shgyl/goerli-blocks",
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const holderClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.studio.thegraph.com/query/35333/ape-coin-holders/v0.0.1",
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});
