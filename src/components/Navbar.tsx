"use client";

import Link from "next/link";
import { Home, Settings } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-indigo-900"
        >
          <Home className="h-5 w-5" />
          <span>عقاري</span>
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <Settings className="h-4 w-4" />
          <span>الإعدادات</span>
        </Link>
      </div>
    </nav>
  );
}
