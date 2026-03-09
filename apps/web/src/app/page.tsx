import { db } from "@friends/database";

export default async function Home() {
  const userCount = await db.user.count();

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Friends</h1>
      <p>Welcome to the Friends project.</p>
      <p>Users in database: {userCount}</p>
    </main>
  );
}
