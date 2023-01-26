import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "../../lib/config";
import client from "../../lib/prismadb";

const handler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET": // get invetory of a vault
      try {
        const { vault } = req.query;
        const inventory = await client.item.findMany({
          where: {
            vault: vault.toLowerCase(),
          },
        });
        res.send(inventory);
      } catch (_error) {
        console.log(_error);
        res.json({ message: false });
      }
      break;
    case "POST": //add item to vault
      try {
        const { contractAddress, tokenId, vault } = req.body;
        //need help adding item once one item already created since vault is unique constraint
        const result = await client.item.create({
          data: {
            contract: contractAddress.toLowerCase(),
            tokenId: tokenId,
            vault: vault.toLowerCase(),
          },
        });
        res.json({ inventoryUpdated: true, result });
      } catch (_error) {
        console.log(_error);
        res.json({ message: false });
      }
      break;
    case "DELETE": //break vault
      try {
        const { contractAddress, tokenId } = req.query;
        await client.item.delete({
          where: {
            contract_tokenId: {
              contract: contractAddress,
              tokenId: tokenId,
            },
          },
        });

        res.json({ inventoryUpdated: true });
      } catch (_error) {
        console.log(_error);
        res.json({ message: false });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"], ["POST"], ["DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withIronSessionApiRoute(handler, ironOptions);
