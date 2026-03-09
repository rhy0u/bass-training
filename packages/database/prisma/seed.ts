import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ┌──────────────────────────────────────────────────────────┐
// │  Seed users – passwords listed below for dev/testing     │
// │                                                          │
// │  alice@friends.local   →  password: "alice123"           │
// │  bob@friends.local     →  password: "bob12345"           │
// │  charlie@friends.local →  password: "charlie1"           │
// │  diana@friends.local   →  password: "diana123"           │
// │  eric@friends.local    →  password: "eric1234"           │
// └──────────────────────────────────────────────────────────┘

const SEED_USERS = [
  { email: "alice@friends.local", name: "Alice Martin", password: "alice123" },
  { email: "bob@friends.local", name: "Bob Dupont", password: "bob12345" },
  { email: "charlie@friends.local", name: "Charlie Leroy", password: "charlie1" },
  { email: "diana@friends.local", name: "Diana Moreau", password: "diana123" },
  { email: "eric@friends.local", name: "Eric Bernard", password: "eric1234" },
];

const SEED_GROUPS = [
  {
    name: "Weekend Hikers",
    ownerEmail: "alice@friends.local",
    memberEmails: ["bob@friends.local", "charlie@friends.local"],
  },
  {
    name: "Book Club",
    ownerEmail: "bob@friends.local",
    memberEmails: ["alice@friends.local", "diana@friends.local", "eric@friends.local"],
  },
  {
    name: "Game Night",
    ownerEmail: "charlie@friends.local",
    memberEmails: ["alice@friends.local", "bob@friends.local", "diana@friends.local"],
  },
];

async function main() {
  const users: Record<string, string> = {};

  for (const { email, name, password } of SEED_USERS) {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.upsert({
      where: { email },
      update: { name, passwordHash },
      create: { email, name, passwordHash },
    });
    users[email] = user.id;
    console.log(`Seeded user: ${user.name} (${user.email})`);
  }

  for (const { name, ownerEmail, memberEmails } of SEED_GROUPS) {
    const ownerId = users[ownerEmail]!;
    const group = await prisma.group.create({
      data: {
        name,
        ownerId,
        members: {
          create: [
            { userId: ownerId },
            ...memberEmails.map((email) => ({ userId: users[email]! })),
          ],
        },
      },
    });
    console.log(
      `Seeded group: ${group.name} (owner: ${ownerEmail}, members: ${memberEmails.length + 1})`,
    );
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
