import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "../../lib/config";
import client from "../../lib/prismadb";

const handler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET": // get invetory of a vault
      try {
        const { vaultTokenId } = req.query;
        const status = await client.offers.findMany({
          where: {
            vaultTokenId: vaultTokenId,
          },
          select: {
            status: true,
          },
        });
        res.send(status);
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
