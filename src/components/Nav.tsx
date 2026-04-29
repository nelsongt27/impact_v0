"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/clients", label: "Clients" },
  { href: "/programs", label: "Programs" },
  { href: "/facilitators", label: "Facilitators" },
  { href: "/coaching", label: "Coaching" },
  { href: "/voice", label: "Voice" },
  { href: "/tools", label: "Tools" },
  { href: "/wizard", label: "Wizard" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-1">
      {ITEMS.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? "relative px-3 py-2 text-sm font-semibold text-ink-900 before:absolute before:bottom-0 before:left-2 before:right-2 before:h-[2px] before:bg-amber-400"
                : "px-3 py-2 text-sm font-medium text-ink-500 transition-colors hover:text-ink-900"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
