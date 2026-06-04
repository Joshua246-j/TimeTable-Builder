"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  "timetable-builder": "Timetable Builder",
  faculty: "Faculty",
  rooms: "Rooms",
  analytics: "Analytics",
  preview: "Preview",
  settings: "Settings",
};

export default function Breadcrumbs() {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center"
    >
      <ol className="flex items-center gap-2">
        <li>
          <Link
            href="/dashboard"
            className="
              flex
              items-center
              gap-2
              rounded-lg
              px-2
              py-1
              text-sm
              font-medium
              text-slate-500
              transition-colors
              hover:bg-slate-100
              hover:text-slate-900
            "
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>

        {segments.map((segment, index) => {
          const href =
            "/" + segments.slice(0, index + 1).join("/");

          const isLast =
            index === segments.length - 1;

          const label =
            routeLabels[segment] ||
            segment
              .replace(/-/g, " ")
              .replace(/\b\w/g, (char) =>
                char.toUpperCase()
              );

          return (
            <li
              key={href}
              className="flex items-center gap-2"
            >
              <ChevronRight className="h-4 w-4 text-slate-400" />

              {isLast ? (
                <span
                  className="
                    text-sm
                    font-semibold
                    text-slate-900
                  "
                >
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="
                    text-sm
                    font-medium
                    text-slate-500
                    transition-colors
                    hover:text-slate-900
                  "
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}