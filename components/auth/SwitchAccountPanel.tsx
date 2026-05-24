"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SwitchAccountPanelProps = {
  callbackUrl?: string;
  description?: string;
  showGoogle?: boolean;
};

export default function SwitchAccountPanel({
  callbackUrl = "/",
  description = "You're already signed in. Sign out to use a different account, or continue with Google.",
  showGoogle = true,
}: SwitchAccountPanelProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const loginReturnUrl = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  async function handleSignOut() {
    setLoading(true);
    await signOut({ redirect: false });
    router.push(loginReturnUrl);
    router.refresh();
  }

  async function handleGoogle() {
    setLoading(true);
    await signOut({ redirect: false });
    signIn("google", { callbackUrl });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {session?.user && (
        <div
          style={{
            padding: "0.85rem 1rem",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--border)",
            fontSize: "0.875rem",
          }}
        >
          <span style={{ display: "block", fontSize: "0.72rem", color: "var(--text3)", marginBottom: "0.25rem" }}>
            Signed in as
          </span>
          <span style={{ fontWeight: 700, color: "var(--text)" }}>{session.user.name || session.user.email}</span>
          {session.user.email && session.user.name && (
            <span style={{ display: "block", marginTop: "0.2rem", color: "var(--text2)", fontSize: "0.82rem" }}>
              {session.user.email}
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        disabled={loading}
        onClick={handleSignOut}
        className="btn-primary"
        style={{ width: "100%", padding: "0.85rem", borderRadius: "12px", justifyContent: "center" }}
      >
        {loading ? "Signing out…" : "Sign out"}
      </button>

      {showGoogle && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
            <span style={{ fontSize: "0.8rem", color: "var(--text3)" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleGoogle}
            className="btn-outline"
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "12px",
              justifyContent: "center",
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="" />
            Continue with Google
          </button>
        </>
      )}

      <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text3)", textAlign: "center", lineHeight: 1.5 }}>
        {description}
      </p>
    </div>
  );
}
