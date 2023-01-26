import axios from "axios";
import { CHAIN } from "../../constants/chain";
import { BAYC, BAKC, MAYC } from "../../constants/addresses";

const poolId = {
  [BAYC.toLowerCase()]: "1",
  [MAYC.toLowerCase()]: "2",
  [BAKC.toLowerCase()]: "3",
};

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const { address } = req.query;
        const options = {
          method: "GET",
          url: `https://deep-index.moralis.io/api/v2/${address.toLowerCase()}/nft`,
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
                url: `https://deep-index.moralis.io/api/v2/${address.toLowerCase()}/nft`,
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

        let walletOfOwner = [];

        for (let i = 0; i < data.length; i++) {
          if (
            data[i]?.token_address?.toLowerCase() === BAYC.toLowerCase() ||
            data[i]?.token_address?.toLowerCase() === BAKC.toLowerCase() ||
            data[i]?.token_address?.toLowerCase() === MAYC.toLowerCase()
          ) {
            let image = JSON.parse(data[i].metadata).image;
            if (image.slice(0, 7) === "ipfs://") {
              image = `https://ipfs.moralis.io:2053/ipfs/${image.slice(7, image.length)}`;
            }
            walletOfOwner.push({
              tokenAddress: data[i].token_address,
              tokenId: data[i].token_id,
              imageURL: image,
              poolId: poolId[data[i].token_address],
            });
          }
        }

        res.send({ walletOfOwner: walletOfOwner });
      } catch (_error) {
        console.log(_error);
        res.json({ walletOfOwner: false });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
