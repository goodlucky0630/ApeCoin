import axios from "axios";
import { CHAIN } from "../../constants/chain";
import { VAULT_FACTORY } from "../../constants/addresses";
import { BigNumber, ethers } from "ethers";

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const options = {
          method: "GET",
          url: `https://deep-index.moralis.io/api/v2/nft/${VAULT_FACTORY}`,
          params: { chain: CHAIN === 1 ? "eth" : "goerli", format: "decimal", normalizeMetadata: "false" },
          headers: {
            "accept-encoding": null,
            accept: "application/json",
            "X-API-Key": process.env.MORALIS_API_KEY,
          },
        };
        const response = await axios.request(options);
        let data = [];
        response.data.result.forEach((i) => {
          data.push(i);
        });

        let amountOfPagesLeft = Math.ceil(Number(response.data.total) / Number(response.data.page_size));

        let newData = [];
        if (Number(response.data.total) > Number(response.data.page_size)) {
          let cursor = response.data.cursor;
          for (let i = 0; i < amountOfPagesLeft; i++) {
            if (cursor !== null) {
              const options = {
                method: "GET",
                url: `https://deep-index.moralis.io/api/v2/nft/${VAULT_FACTORY}`,
                params: {
                  cursor: cursor,
                  chain: CHAIN === 1 ? "eth" : "goerli",
                  format: "decimal",
                  normalizeMetadata: "false",
                },
                headers: {
                  "accept-encoding": null,
                  accept: "application/json",
                  "X-API-Key": process.env.MORALIS_API_KEY,
                },
              };
              let responseNew = await axios.request(options);

              responseNew.data.result.forEach((element) => {
                newData.push(element);
              });

              cursor = responseNew.data.cursor;
            }
          }
        }
        newData.forEach((i) => {
          data.push(i);
        });

        let vaults = [];

        for (let i = 0; i < data.length; i++) {
          const tokenId = data[i].token_id;
          const bigNumber = BigNumber.from(tokenId.toString());
          const hex = bigNumber.toHexString();

          vaults.push({
            vault: ethers.utils.getAddress(hex),
            vaultTokenId: tokenId,
          });
        }

        res.send({ allVaults: vaults });
      } catch (_error) {
        console.log(_error);
        res.json({ allVaults: false });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
