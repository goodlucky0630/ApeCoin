import client from "../../lib/prismadb";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "../../lib/config";
import { prisma } from "@prisma/client";
const handler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "DELETE":
            try {
                const { contractAddress, tokenId } = req.query;
                const result = await client.item.delete({
                  where: {
                    contract: contractAddress,
                    tokenId: tokenId
                  },
                });
                console.log(result);
                res.send({itemUpdated: true, result});
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