"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import SwitchAccountPanel from "@/components/auth/SwitchAccountPanel";

function SwitchAccountContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const fromAdmin = callbackUrl.startsWith("/admin");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
  }, [status, router, callbackUrl]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <main
        className="section-inner"
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "calc(var(--hdr-h) + 2rem) 1rem 2rem",
        }}
      >
        <p style={{ color: "var(--text3)" }}>Loading…</p>
      </main>
    );
  }

  return (
    <main
      className="section-inner"
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "calc(var(--hdr-h) + 2rem) 1rem 2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "var(--surface)",
          padding: "2.5rem",
          borderRadius: "24px",
          border: "1px solid var(--border)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              marginBottom: "0.5rem",
            }}
          >
            Switch account
          </h1>
          <p style={{ color: "var(--text3)", fontSize: "0.9rem", lineHeight: 1.6 }}>
            {fromAdmin
              ? "This account doesn't have admin access. Sign out to sign in with an admin account."
              : "Use a different account to continue."}
          </p>
        </div>

        <SwitchAccountPanel
          callbackUrl={callbackUrl}
          description={
            fromAdmin
              ? "After signing out you'll return to the login page. Use Google or credentials for your admin account."
              : "Sign out to use another email or password, or pick a different Google account."
          }
        />
      </div>
    </main>
  );
}

export default function SwitchAccountPage() {
  return (
    <Suspense
      fallback={
        <main
          className="section-inner"
          style={{
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ color: "var(--text3)" }}>Loading…</p>
        </main>
      }
    >
      <SwitchAccountContent />
    </Suspense>
  );
}
