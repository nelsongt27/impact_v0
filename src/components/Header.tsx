import Image from "next/image";
import Link from "next/link";

import { Nav } from "./Nav";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/brand/logo-primary.png"
            alt="Axialent"
            width={2801}
            height={663}
            priority
            className="h-7 w-auto"
          />
          <span className="hidden border-l border-ink-200 pl-4 font-mono text-[10px] uppercase tracking-eyebrow text-ink-400 md:inline">
            Impact Record
          </span>
        </Link>
        <Nav />
      </div>
    </header>
  );
}
