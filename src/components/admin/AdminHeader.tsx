"use client";

import { signOut } from "next-auth/react";

export default function AdminHeader({ userEmail }: { userEmail: string }) {
  return (
    <header className="sticky top-0 z-10 bg-surface/90 backdrop-blur-sm border-b border-border-dim">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold text-neon-cyan text-glow-cyan tracking-wider">
            &gt; VERTECH ADMIN
          </span>
          <span className="font-mono text-[10px] text-text-dim hidden sm:inline">
            [ANALYTICS DASHBOARD]
          </span>
        </div>

        {/* User + signout */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-text-dim hidden sm:inline">
            {userEmail}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="font-mono text-[10px] text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider"
          >
            [Sign Out]
          </button>
        </div>
      </div>
    </header>
  );
}
