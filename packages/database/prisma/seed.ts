import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ┌──────────────────────────────────────────────────────────┐
// │  Seed users – passwords listed below for dev/testing     │
// │                                                          │
// │  alice@friends.local   →  password: "alice123"           │
// │  bob@friends.local     →  password: "bob12345"           │
// │  charlie@friends.local →  password: "charlie1"           │
// └──────────────────────────────────────────────────────────┘

const SEED_USERS = [
  { email: "alice@friends.local", name: "Alice Martin", password: "alice123" },
  { email: "bob@friends.local", name: "Bob Dupont", password: "bob12345" },
  { email: "charlie@friends.local", name: "Charlie Leroy", password: "charlie1" },
];

async function main() {
  for (const { email, name, password } of SEED_USERS) {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.upsert({
      where: { email },
      update: { name, passwordHash },
      create: { email, name, passwordHash },
    });
    console.log(`Seeded user: ${user.name} (${user.email})`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
