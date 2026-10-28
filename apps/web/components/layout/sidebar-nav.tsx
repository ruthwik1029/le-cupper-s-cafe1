"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SessionUser } from "@nodedr-restaurant/types";
import { hasPermission } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { useNavBadges } from "@/hooks/use-nav-badges";
import { NavDot } from "./nav-dot";
import { NAV_ITEMS } from "./nav-items";

const SECTION_TITLES: Record<string, string> = {
  service: "Service & Floor",
  catalog: "Menu & Inventory",
  crm: "Guest & Fulfillment",
  management: "Operations & Admin",
};

export function SidebarNav({
  user,
  onNavigate,
}: {
  user?: SessionUser;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { t } = useI18n();
  const badges = useNavBadges();

  const allowedItems = NAV_ITEMS.filter(
    (item) => !item.permission || hasPermission(user, item.permission),
  );

  let lastSection = "";

  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {allowedItems.map((item) => {
        const isActive = pathname?.startsWith(item.href);
        const Icon = item.icon;
        const currentSection = item.section ?? "service";
        const isNewSection = currentSection !== lastSection;
        if (isNewSection) lastSection = currentSection;

        return (
          <div key={item.href} className="flex flex-col">
            {isNewSection && (
              <span className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                {SECTION_TITLES[currentSection] ?? currentSection}
              </span>
            )}
            <Link
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all border-l-2",
                isActive
                  ? "border-sidebar-primary bg-sidebar-accent font-semibold text-sidebar-accent-foreground shadow-sm"
                  : "border-transparent text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="truncate">{t(item.labelKey)}</span>
              {badges.nav[item.href] && !isActive ? <NavDot /> : null}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
