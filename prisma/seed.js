async function main() {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();
  const data1 = {
    owner: "0x734136Cb869f349aF65561Ab0B8B12396851E6e0",
    vault: "0x734136Cb869f349aF65561Ab0B8B1239685VAULT",
    signature: "0xSig",
    nonce: "1234",
    duratoin: "168456",
    deadline: "6543",
    numOfInstalments: "3",
    intrestRate: "10",
    principle: "1000",
    collateralAddress: "0x734136Cb869f349aF65561Ab0B8B1239685APECO",
    itemsHash: "0xItemHash",
    experation: "2023-12-11T20:41:16.609Z", //date and time used for sorting in ISO 8601 format
  };
  const data = {
    vault: "0x734136Cb869f349aF65561Ab0B8B1239685VAULT",
    inventory: {
      create: [
        {
          contract: "0x734136Cb869f349aF65561Ab0B8B1239685APECO",
          tokenId: "1234",
        },
      ],
    },
  };

  // const testOffer = await prisma.offers.update({
  //     where: {
  //         id:
  //     },
  //     data

  // });
  // const vaultInventory = await prisma.vaultInventory.create({
  //     data
  // })
  // const vault = await prisma.vaultInventory.findUnique({
  //     where: {
  //         vault: "0x734136Cb869f349aF65561Ab0B8B1239685VAULT"
  //     },
  //     include:{
  //         inventory: true
  //     }
  // })

//   const deleteItems = prisma.item.deleteMany({
//     where: {
//       vaultInventoryVault: "0x734136Cb869f349aF65561Ab0B8B1239685VAULT",
//     },
//   });

//   const deleteVault = prisma.vaultInventory.delete({
//     where: {
//       vault: "0x734136Cb869f349aF65561Ab0B8B1239685VAULT",
//     },
//   });

//   const transaction = await prisma.$transaction([deleteItems, deleteVault]);

const result = await prisma.vaultInventory.update({
    where: {
      vault: "0x734136Cb869f349aF65561Ab0B8B1239685VAULT",
    },
    data:{
    inventory: {
        create: [
            {
            
            contract: "0x734136Cb869f349aF65561Ab0B8B1239685APECn",
            tokenId: "1234",
            },
        ],
        },
    },
  });

  console.log(result);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
// .finally(async () => {
//   await prisma.$disconnect();
// });
