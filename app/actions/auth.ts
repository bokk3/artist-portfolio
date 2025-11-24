"use server";

import { login, logout } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(password: string) {
  const formData = new FormData();
  formData.append("password", password);

  const success = await login(formData);
  return success;
}

export async function logoutAction() {
  await logout();
  redirect("/login");
}
