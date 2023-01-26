import axios from "axios";
import cache from "memory-cache";
import moment from "moment";

export default async function handler(req, res) {
  const { poolId } = req.query;

  let floorPrice = null;
  let cachedResponse = undefined;
  switch (poolId) {
    case "1":
      cachedResponse = cache.get(`smart-floor/${poolId}`);
      if (cachedResponse) {
        res.json({ floor: cachedResponse });
        break;
      } else {
        //bored ape
        const options = {
          method: "GET",
          url: `https://deep-index.moralis.io/api/v2/nft/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D/trades?chain=eth&from_date=${moment().subtract(30,'days').calendar()}&to_date=${moment().format('l')}&marketplace=opensea`,
          headers: {
            "accept-encoding": null,
            accept: "application/json",
            "X-API-Key": process.env.MORALIS_API_KEY,
          },
        };
        try {
          const response = await axios.request(options);
          let dataprice = []
          response.data.result.forEach((element) => {
            if (element.price.length > 17) {dataprice.push(element.price)} // only above 0.01ETH
          })
          floorPrice = Math.min(...dataprice).toString();
          cache.put(`smart-floor/${poolId}`, floorPrice, 24 * 1000 * 60 * 60); //24 hours
          res.json({ floor: floorPrice });
        } catch (_error) {
          if (_error.response.status = 404) {
            options.url = `https://deep-index.moralis.io/api/v2/nft/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D/trades?chain=eth&from_date=${moment().subtract(60,'days').calendar()}&to_date=${moment().format('l')}&marketplace=opensea`
            try {
              const response = await axios.request(options);
              let dataprice = []
              floorPrice = Math.min(...dataprice).toString();
              cache.put(`smart-floor/${poolId}`, floorPrice, 24 * 1000 * 60 * 60); //24 hours
              res.json({ floor: floorPrice });
            }
            catch (_error) {
              console.log(_error);
              res.json({ ok: false });
            }
          }
        }
        break;
      }
    case "2":
      cachedResponse = cache.get(`smart-floor/${poolId}`);
      if (cachedResponse) {
        res.json({ floor: cachedResponse });
        break;
      } else {
        //mutant
        const options = {
          method: "GET",
          url: `https://deep-index.moralis.io/api/v2/nft/0x60E4d786628Fea6478F785A6d7e704777c86a7c6/trades?chain=eth&from_date=${moment().subtract(30,'days').calendar()}&to_date=${moment().format('l')}&marketplace=opensea`,
          headers: {
            "accept-encoding": null,
            accept: "application/json",
            "X-API-Key": process.env.MORALIS_API_KEY,
          },
        };
        try {
          const response = await axios.request(options);
          let dataprice = []
          response.data.result.forEach((element) => {
            if (element.price.length > 17) {dataprice.push(element.price)} // only above 0.01ETH
          })
          floorPrice = Math.min(...dataprice).toString();
          cache.put(`smart-floor/${poolId}`, floorPrice, 24 * 1000 * 60 * 60); //24 hours
          res.json({ floor: floorPrice });
        } catch (_error) {
          if (_error.response.status = 404) {
            options.url = `https://deep-index.moralis.io/api/v2/nft/0x60E4d786628Fea6478F785A6d7e704777c86a7c6/trades?chain=eth&from_date=${moment().subtract(60,'days').calendar()}&to_date=${moment().format('l')}&marketplace=opensea`
            try {
              const response = await axios.request(options);
              let dataprice = []
              floorPrice = Math.min(...dataprice).toString();
              cache.put(`smart-floor/${poolId}`, floorPrice, 24 * 1000 * 60 * 60); //24 hours
              res.json({ floor: floorPrice });
            }
            catch (_error) {
              console.log(_error);
              res.json({ ok: false });
            }
          }
        }
        break;
      }
    case "3":
      cachedResponse = cache.get(`smart-floor/${poolId}`);
      if (cachedResponse) {
        res.json({ floor: cachedResponse });
        break;
      } else {
        //kennel
        const options = {
          method: "GET",
          url: `https://deep-index.moralis.io/api/v2/nft/0xba30E5F9Bb24caa003E9f2f0497Ad287FDF95623/trades?chain=eth&from_date=${moment().subtract(30,'days').calendar()}&to_date=${moment().format('l')}&marketplace=opensea`,
          headers: {
            "accept-encoding": null,
            accept: "application/json",
            "X-API-Key": process.env.MORALIS_API_KEY,
          },
        };
        try {
          const response = await axios.request(options);
          let dataprice = []
          response.data.result.forEach((element) => {
            if (element.price.length > 17) {dataprice.push(element.price)} // only above 0.01ETH
          })
          floorPrice = Math.min(...dataprice).toString();
          cache.put(`smart-floor/${poolId}`, floorPrice, 24 * 1000 * 60 * 60); //24 hours
          res.json({ floor: floorPrice });
        } catch (_error) {
          if (_error.response.status = 404) {
            options.url = `https://deep-index.moralis.io/api/v2/nft/0xba30E5F9Bb24caa003E9f2f0497Ad287FDF95623/trades?chain=eth&from_date=${moment().subtract(60,'days').calendar()}&to_date=${moment().format('l')}&marketplace=opensea`
            try {
              const response = await axios.request(options);
              let dataprice = []
              floorPrice = Math.min(...dataprice).toString();
              cache.put(`smart-floor/${poolId}`, floorPrice, 24 * 1000 * 60 * 60); //24 hours
              res.json({ floor: floorPrice });
            }
            catch (_error) {
              console.log(_error);
              res.json({ ok: false });
            }
          }
        }
        break;
      }
    default:
      res.setHeader("Allow", ["GET"]);
  }
}
