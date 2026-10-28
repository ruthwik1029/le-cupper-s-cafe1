import { CalendarPlus, ChefHat, LayoutGrid, ShoppingCart, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ACTIONS = [
  { href: "/pos", label: "New order", icon: ShoppingCart },
  { href: "/tables", label: "Tables", icon: LayoutGrid },
  { href: "/reservations", label: "New reservation", icon: CalendarPlus },
  { href: "/kds", label: "Kitchen display", icon: ChefHat },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
];

// One-tap jumps into the flows staff reach for most during service — sits
// right under the header so it's the first thing visible, not buried below
// the stat cards.
export function QuickActions() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {ACTIONS.map((action) => (
        <Button
          key={action.href}
          variant={action.href === "/pos" ? "default" : "outline"}
          size="sm"
          className="rounded-xl shadow-xs transition-all hover:-translate-y-0.5 active:translate-y-0"
          render={<Link href={action.href} />}
        >
          <action.icon className="h-4 w-4" />
          {action.label}
        </Button>
      ))}
    </div>
  );
}
