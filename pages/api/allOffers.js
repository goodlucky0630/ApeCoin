import client from "../../lib/prismadb";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "../../lib/config";
import { prisma } from "@prisma/client";

const handler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const result = await client.offers.findMany();

        res.send(result);
      } catch (_error) {
        console.log(_error);
        res.json({ message: false });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withIronSessionApiRoute(handler, ironOptions);
