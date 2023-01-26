import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "../../lib/config";
import client from "../../lib/prismadb";

const handler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET": //unauthenticated
      const { vault } = req.query;
      try {
        // const timeNow = Math.round(Date.now() / 1000);
        //all offers for a given vault
        const result = await client.offers.findMany({
          where: {
            vault: vault,
          },
        });

        res.send(result);
      } catch (_error) {
        console.log(_error);
        res.json({ message: false });
      }
      break;
    case "POST": //create offer require signed in
      const { offer } = req.body;
      try {
        if (req.session.siwe?.address === null) {
          return res.status(401).json({ message: "Plese sign in" });
        }

        const newOffer = await client.offers.create({
          data: {
            owner: offer.owner,
            signersAddress: offer.signersAddress,
            vault: offer.vault,
            signature: offer.signature,
            nonce: offer.nonce,
            duration: offer.duration,
            deadline: offer.deadline,
            numOfInstallments: offer.numOfInstallments,
            interestRate: offer.interestRate,
            principal: offer.principal,
            status: "",
            vaultTokenId: offer.vaultTokenId,
            repayment: offer.repayment,
            collateralAddress: offer.collateralAddress,
            itemsHash: offer.itemsHash,
            lendersAddress: offer.lendersAddress,
            status: offer.status,
          },
        });
        res.json({ offerAccepted: true, data: newOffer });
      } catch (_error) {
        console.log(_error);
        res.json({ offerAccepted: false });
      }
      break;
    case "DELETE": //create offer require signed in
      const { signersAddress, id } = req.query;
      console.log(signersAddress);
      try {
        if (req.session.siwe?.address.toLowerCase() !== signersAddress.toLowerCase()) {
          return res.status(401).json({ offerDeleted: false });
        }
        await client.offers.delete({
          where: {
            id: Number(id),
          },
        });

        res.json({ offerDeleted: true });
      } catch (_error) {
        console.log(_error);
        res.json({ offerDeleted: false });
      }
      break;
    case "PUT":
      const { offerId, status, lendersAddress, sender } = req.body;
      console.log(offerId, status, lendersAddress, sender);
      try {
        if (
          req.session.siwe?.address.toLowerCase() !== sender.toLowerCase() &&
          req.session.siwe?.address.toLowerCase() !== lendersAddress.toLowerCase()
        ) {
          return res.status(401).json({ offerUpdated: false });
        }
        await client.offers.update({
          where: {
            id: Number(offerId),
          },
          data: {
            status: status,
            lendersAddress: lendersAddress,
          },
        });

        res.json({ offerUpdated: true });
      } catch (_error) {
        console.log(_error);
        res.json({ offerUpdated: false });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"], ["POST"], ["DELETE"], ["PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withIronSessionApiRoute(handler, ironOptions);
