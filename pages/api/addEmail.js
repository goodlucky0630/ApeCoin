// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../lib/prismadb"

export default async function handler(req, res) {
  const { emailAddress } = req.body;
  try {
    const result = await prisma.EmailList.create({
      data: { email: emailAddress }
    })
    if(result.email === emailAddress){
      res.status(200).json({ created: true });
    }
  } catch(e) {
    if(e.message.includes("Unique constraint failed")){
      res.status(400).json({ created: false });
    }else {
      res.status(500).json({ created: false });
    }
  }
}
ds