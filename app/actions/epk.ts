"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const EPK_PASSWORD = process.env.EPK_PASSWORD || "press123";

export async function loginToEpk(formData: FormData) {
  const password = formData.get("password") as string;

  if (password === EPK_PASSWORD) {
    const cookieStore = await cookies();
    // Set a simple cookie for session
    cookieStore.set("epk_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });
    redirect("/epk");
  } else {
    return { error: "Invalid password" };
  }
}

export async function checkEpkSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("epk_session");
  return !!session;
}

export async function logoutEpk() {
  const cookieStore = await cookies();
  cookieStore.delete("epk_session");
  redirect("/epk/login");
}
