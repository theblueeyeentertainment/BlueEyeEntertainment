import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";

/** Redirects unauthenticated users to login; non-admins to switch-account. */
export async function requireAdmin(callbackPath = "/admin") {
  const session = await getServerSession(authOptions);
  const callbackUrl = encodeURIComponent(callbackPath);

  if (!session) {
    redirect(`/login?callbackUrl=${callbackUrl}`);
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "admin") {
    redirect(`/switch-account?callbackUrl=${callbackUrl}`);
  }

  return session;
}
