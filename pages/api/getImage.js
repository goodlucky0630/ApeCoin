import axios from "axios";
import { ethers } from "ethers";
import cache from "memory-cache";
import { CHAIN } from "../../constants/chain";
import { BAYC, BAKC, MAYC } from "../../constants/addresses";

const contracts = {
  1: BAYC.toLowerCase(),
  2: MAYC.toLowerCase(),
  3: BAKC.toLowerCase(),
};

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "GET":
      async function getImage() {
        const { poolId, tokenId } = req.query;

        let cachedResponse = undefined;
        cachedResponse = cache.get(`${poolId}/${tokenId}`);
        if (cachedResponse) {
          res.json({ imageUrl: cachedResponse });
          return;
        } else {
          let image = null;
          try {
            const options = {
              method: "GET",
              url: `https://deep-index.moralis.io/api/v2/nft/${contracts[poolId]}/${tokenId}`,
              params: {
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

            const response = await axios.request(options);
            let url = JSON.parse(response.data.metadata).image;
            if (url.slice(0, 7) === "ipfs://") {
              url = `https://ipfs.moralis.io:2053/ipfs/${url.slice(7, url.length)}`;
            }
            image = url;
            cache.put(`${poolId}/${tokenId}`, image, 24 * 1000 * 60 * 60); //24 hours
            res.json({ imageUrl: image });
          } catch (_error) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return getImage();
          }
        }
      }
      await getImage();
      break;
    default:
      res.setHeader("Allow", ["GET"]);
  }
}
