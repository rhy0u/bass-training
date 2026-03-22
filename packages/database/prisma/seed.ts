import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ┌──────────────────────────────────────────────────────────────┐
// │  Seed users – passwords listed below for dev/testing         │
// │  (min 8 chars, uppercase, lowercase, digit, special char)    │
// │                                                              │
// │  alice@example.local   →  password: "Alice123!"              │
// │  bob@example.local     →  password: "Bob12345!"              │
// └──────────────────────────────────────────────────────────────┘

const SEED_USERS = [
  { email: "alice@example.local", name: "Alice Martin", password: "Alice123!" },
  { email: "bob@example.local", name: "Bob Dupont", password: "Bob12345!" },
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
