import axios from "axios";
import { ethers } from "ethers";
import cache from "memory-cache";

export default async function handler(req, res) {
  const { poolId } = req.query;

  let floorPrice = null;
  let cachedResponse = undefined;
  switch (poolId) {
    case "1":
      async function getFloor1() {
        cachedResponse = cache.get(`historicalFloor/${poolId}`);
        if (cachedResponse) {
          res.json({ historicalFloor: cachedResponse });
          return;
        } else {
          try {
            //bored ape
            let cursor = null;
            let options = {
              method: "GET",
              url: `https://deep-index.moralis.io/api/v2/nft/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D/trades?chain=eth&marketplace=opensea`,
              params: {
                cursor: cursor,
              },
              headers: {
                "accept-encoding": null,
                accept: "application/json",
                "X-API-Key": process.env.MORALIS_API_KEY,
              },
            };
            let data = [];
            let count = 0;
            do {
              const response = await axios.request(options);
              response.data.result.forEach((element) => {
                data.push(element);
              });
              options.params.cursor = response.data.cursor;
              count += 1;
            } while (options.params.cursor !== null && count < 5);

            floorPrice = data?.map((i) => {
              return {
                price: ethers.utils.formatEther(i.price),
                time: i.block_timestamp,
              };
            });
            cache.put(`historicalFloor/${poolId}`, floorPrice, 1 * 1000 * 60 * 60); //1 hour
            res.json({ historicalFloor: floorPrice });
          } catch (_error) {
            console.log(_error);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return getFloor1();
          }
        }
      }
      await getFloor1();
      break;
    case "2":
      async function getFloor2() {
        cachedResponse = cache.get(`historicalFloor/${poolId}`);
        if (cachedResponse) {
          res.json({ historicalFloor: cachedResponse });
          return;
        } else {
          try {
            //bored ape
            let cursor = null;
            let options = {
              method: "GET",
              url: `https://deep-index.moralis.io/api/v2/nft/0x60E4d786628Fea6478F785A6d7e704777c86a7c6/trades?chain=eth&marketplace=opensea`,
              params: {
                cursor: cursor,
              },
              headers: {
                "accept-encoding": null,
                accept: "application/json",
                "X-API-Key": process.env.MORALIS_API_KEY,
              },
            };
            let data = [];
            let count = 0;
            do {
              const response = await axios.request(options);
              response.data.result.forEach((element) => {
                data.push(element);
              });
              options.params.cursor = response.data.cursor;
              count += 1;
            } while (options.params.cursor !== null && count < 5);

            floorPrice = data?.map((i) => {
              return {
                price: ethers.utils.formatEther(i.price),
                time: i.block_timestamp,
              };
            });
            cache.put(`historicalFloor/${poolId}`, floorPrice, 1 * 1000 * 60 * 60); //1 hour
            res.json({ historicalFloor: floorPrice });
          } catch (_error) {
            console.log(_error);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return getFloor2();
          }
        }
      }
      await getFloor2();
      break;
    case "3":
      async function getFloor3() {
        cachedResponse = cache.get(`historicalFloor/${poolId}`);
        if (cachedResponse) {
          res.json({ historicalFloor: cachedResponse });
          return;
        } else {
          try {
            //bored ape
            let cursor = null;
            let options = {
              method: "GET",
              url: `https://deep-index.moralis.io/api/v2/nft/0xba30E5F9Bb24caa003E9f2f0497Ad287FDF95623/trades?chain=eth&marketplace=opensea`,
              params: {
                cursor: cursor,
              },
              headers: {
                "accept-encoding": null,
                accept: "application/json",
                "X-API-Key": process.env.MORALIS_API_KEY,
              },
            };
            let data = [];
            let count = 0;
            do {
              const response = await axios.request(options);
              response.data.result.forEach((element) => {
                data.push(element);
              });
              options.params.cursor = response.data.cursor;
              count += 1;
            } while (options.params.cursor !== null && count < 5);

            floorPrice = data?.map((i) => {
              return {
                price: ethers.utils.formatEther(i.price),
                time: i.block_timestamp,
              };
            });
            cache.put(`historicalFloor/${poolId}`, floorPrice, 1 * 1000 * 60 * 60); //1 hour
            res.json({ historicalFloor: floorPrice });
          } catch (_error) {
            console.log(_error);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return getFloor3();
          }
        }
      }
      await getFloor3();
      break;
    default:
      res.setHeader("Allow", ["GET"]);
  }
}
