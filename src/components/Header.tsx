import Link from "next/link";

import { Nav } from "./Nav";
import { Sparkle } from "./Sparkle";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        <Link href="/" className="flex items-center gap-3">
          <Sparkle size={22} color="#1D2F5E" />
          <div className="flex items-baseline gap-3">
            <span className="font-display text-[22px] leading-none tracking-tightest text-ink-900">
              Axialent
            </span>
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-400">
              Impact Record
            </span>
          </div>
        </Link>
        <Nav />
      </div>
    </header>
  );
}
