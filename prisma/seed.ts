import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo123", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@orquideas.com" },
    update: {},
    create: {
      email: "demo@orquideas.com",
      name: "Cultivador Demo",
      passwordHash,
      plan: "pro",
    },
  });

  const count = await prisma.orchid.count({ where: { userId: user.id } });
  if (count === 0) {
    await prisma.orchid.createMany({
      data: [
        {
          userId: user.id,
          name: "Phal. branca da varanda",
          species: "Phalaenopsis",
          hybrid: "amabilis",
          stage: "blooming",
          origin: "compra",
          location: "Estufa A",
          notes: "Floriu em primavera.",
          photos: [],
        },
        {
          userId: user.id,
          name: "Cattleya rosa",
          species: "Cattleya",
          stage: "adult",
          origin: "troca",
          location: "Bancada 2",
          parentInfo: "Pai A x Mãe B",
          photos: [],
        },
      ],
    });
  }

  const obs = await prisma.observation.count({ where: { userId: user.id } });
  if (obs === 0) {
    await prisma.observation.create({
      data: {
        userId: user.id,
        region: "sudeste",
        city: "São Paulo",
        date: new Date(),
        tempMin: 16,
        tempMax: 27,
        humidity: 62,
        rainfall: 0,
        note: "Dia seco e ensolarado.",
      },
    });
  }

  console.log("Seed concluído. Login: demo@orquideas.com / demo123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
