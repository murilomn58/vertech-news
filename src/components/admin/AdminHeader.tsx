"use client";

import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const TABS = [
  { href: "/admin", label: "Analytics" },
  { href: "/admin/sponsors", label: "Sponsors" },
];

export default function AdminHeader({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 bg-surface/90 backdrop-blur-sm border-b border-border-dim">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold text-neon-cyan text-glow-cyan tracking-wider">
            &gt; VERTECH ADMIN
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

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 flex gap-1">
        {TABS.map((tab) => {
          const isActive =
            tab.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`font-mono text-[10px] uppercase tracking-widest px-3 py-2 border-b-2 transition-colors ${
                isActive
                  ? "border-neon-cyan text-neon-cyan"
                  : "border-transparent text-text-dim hover:text-text-secondary"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
