"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Terminal frame */}
        <div className="bg-surface border border-border-dim rounded-lg overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border-dim">
            <span className="w-2 h-2 rounded-full bg-red-500/60" />
            <span className="w-2 h-2 rounded-full bg-neon-amber/60" />
            <span className="w-2 h-2 rounded-full bg-neon-green/60" />
            <span className="font-mono text-[10px] text-text-dim ml-2">
              admin@vertech-news
            </span>
          </div>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-mono text-xl font-bold text-neon-cyan text-glow-cyan tracking-wider">
                SYSTEM ACCESS
              </h1>
              <p className="font-mono text-[10px] text-text-dim mt-2 tracking-widest uppercase">
                Authorized personnel only
              </p>
            </div>

            {/* Terminal prompt */}
            <div className="font-mono text-xs text-text-dim mb-6">
              <span className="text-neon-green">&gt;</span> authenticate_
              <span className="animate-pulse text-neon-cyan">|</span>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 px-4 py-3 rounded border border-red-500/30 bg-red-500/10">
                <p className="font-mono text-xs text-red-400">
                  {error === "AccessDenied"
                    ? "> ERROR: Unauthorized email. Access denied."
                    : "> ERROR: Authentication failed. Try again."}
                </p>
              </div>
            )}

            {/* Sign in button */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/admin" })}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan font-mono text-sm hover:bg-neon-cyan/15 hover:border-neon-cyan/60 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>

            {/* Footer note */}
            <p className="font-mono text-[10px] text-text-dim mt-6 text-center">
              Authorized personnel only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-void flex items-center justify-center">
          <span className="font-mono text-sm text-text-dim animate-pulse">
            Loading...
          </span>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
