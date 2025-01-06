"use server";

import { cookies } from "next/headers";
import { APP_COOKIES } from "./constants";
import { redirect } from "next/navigation";
import { getMe } from "./apis/auth";

export async function signIn(token: string) {
  cookies().set(APP_COOKIES.APP_USER_SESSION, token);
}

export async function signOut() {
  cookies().delete(APP_COOKIES.APP_USER_SESSION);
  cookies().delete(APP_COOKIES.APP_LOGGED_USER);
  redirect("/login");
}

export async function getSession() {
  const token = cookies().get(APP_COOKIES.APP_USER_SESSION)?.value;
  const profile = await getMe();
  if (!profile) {
    return null;
  }
  return {
    user: profile,
    token,
  };
}
