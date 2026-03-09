import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "hello@friends.local" },
    update: {},
    create: {
      email: "hello@friends.local",
      name: "Friend",
    },
  });

  console.log("Seeded user:", user);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
