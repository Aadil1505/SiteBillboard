"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/sign-in");
  }

  return session;
}

// Alternative: Check auth without automatic redirect
export async function getAuthSession() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  return session;
}

// For role-based access
// export async function requireRole(requiredRole: string) {
//   const session = await requireAuth();
  
//   if (!session.user.role || session.user.role !== requiredRole) {
//     redirect("/unauthorized");
//   }
  
//   return session;
// }