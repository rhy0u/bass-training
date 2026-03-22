"use server";

import { destroySession, getSession } from "@/lib/session";
import { db } from "@boilerplate/database";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ProfileResult = {
  error?: string;
  success?: boolean;
};

export async function updateProfile(
  _prev: ProfileResult | null,
  formData: FormData,
): Promise<ProfileResult> {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!name || !email) {
    return { error: "Name and email are required" };
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing && existing.id !== session.userId) {
    return { error: "This email is already in use" };
  }

  await db.user.update({
    where: { id: session.userId },
    data: { name, email },
  });

  revalidatePath("/profile");
  return { success: true };
}

export async function updatePassword(
  _prev: ProfileResult | null,
  formData: FormData,
): Promise<ProfileResult> {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!currentPassword || !newPassword) {
    return { error: "Both fields are required" };
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return {
      error:
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
    };
  }

  const user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/sign-in");

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    return { error: "Current password is incorrect" };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await db.user.update({
    where: { id: session.userId },
    data: { passwordHash },
  });

  return { success: true };
}

export async function updateAvatar(
  _prev: ProfileResult | null,
  formData: FormData,
): Promise<ProfileResult> {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const file = formData.get("avatar") as File | null;
  if (!file || file.size === 0) {
    return { error: "No file provided" };
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { error: "Only JPEG, PNG, and WebP images are allowed" };
  }

  if (file.size > 2 * 1024 * 1024) {
    return { error: "File must be smaller than 2MB" };
  }

  // Store avatar as base64 data URI for simplicity
  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  await db.user.update({
    where: { id: session.userId },
    data: { avatar: dataUri },
  });

  revalidatePath("/profile");
  revalidatePath("/");
  return { success: true };
}

export async function deleteAccount() {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  await db.user.delete({ where: { id: session.userId } });
  await destroySession();
  redirect("/sign-in");
}
