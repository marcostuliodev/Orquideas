"use client";

import Link from "next/link";
import { useState } from "react";
import { logoutAction } from "@/lib/actions/auth";
import { Badge } from "@/components/ui";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export function MobileNav({ nav, unread }: { nav: NavItem[]; unread: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Abrir menu"
        onClick={() => setOpen(true)}
        className="rounded-lg p-2 text-orchid-800 hover:bg-orchid-50 md:hidden"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 max-w-[82%] flex-col bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between px-2">
              <span className="text-lg font-bold text-orchid-800">🌸 Orquídeas</span>
              <button
                type="button"
                aria-label="Fechar menu"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-orchid-700 hover:bg-orchid-50"
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-orchid-700 hover:bg-orchid-50"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.href === "/notificacoes" && unread > 0 && (
                    <Badge tone="bloom" className="ml-auto">
                      {unread}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
            <form action={logoutAction} className="mt-4">
              <button
                type="submit"
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-orchid-600 hover:bg-orchid-50"
              >
                Sair
              </button>
            </form>
          </aside>
        </div>
      )}
    </>
  );
}
