import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "../../lib/config";
import client from "../../lib/prismadb";

const handler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "PUT":
      const { allOffers, owner, lendersAddress, newStatus } = req.body;
      try {
        if (
          req.session.siwe?.address.toLowerCase() !== owner.toLowerCase() &&
          req.session.siwe?.address.toLowerCase() !== lendersAddress.toLowerCase()
        ) {
          return res.status(401).json({ offerUpdated: false });
        }

        for (let i = 0; i < allOffers.length; i++) {
          await client.offers.update({
            where: {
              id: Number(allOffers[i].id),
            },
            data: {
              status: allOffers[i].status === "ACCEPTED" ? newStatus : "UNUSED",
            },
          });
        }

        res.json({ offerDeleted: true });
      } catch (_error) {
        console.log(_error);
        res.json({ offerDeleted: false });
      }
      break;
    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withIronSessionApiRoute(handler, ironOptions);
