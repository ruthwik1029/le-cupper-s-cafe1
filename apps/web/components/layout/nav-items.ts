import {
  CalendarClock,
  Clock,
  Truck,
  Users,
  Landmark,
  BarChart3,
  Megaphone,
  Wrench,
  ChefHat,
  LayoutDashboard,
  ClipboardList,
  LayoutGrid,
  Package,
  Settings,
  ShoppingCart,
  UsersRound,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

export type NavSection = "service" | "catalog" | "crm" | "management";

export interface NavItem {
  labelKey: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
  section?: NavSection;
}

export const NAV_ITEMS: NavItem[] = [
  // Service & Floor Operations
  { labelKey: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard.sales.view", section: "service" },
  { labelKey: "nav.pos", href: "/pos", icon: ShoppingCart, permission: "orders.create", section: "service" },
  { labelKey: "nav.orders", href: "/orders", icon: ClipboardList, permission: "orders.create", section: "service" },
  { labelKey: "nav.tables", href: "/tables", icon: LayoutGrid, permission: "tables.view", section: "service" },
  { labelKey: "nav.reservations", href: "/reservations", icon: CalendarClock, permission: "reservations.manage", section: "service" },
  { labelKey: "nav.kds", href: "/kds", icon: ChefHat, permission: "kds.manage", section: "service" },

  // Menu & Catalog
  { labelKey: "nav.menu", href: "/menu", icon: UtensilsCrossed, permission: "menu.view", section: "catalog" },
  { labelKey: "nav.inventory", href: "/inventory", icon: Package, permission: "inventory.manage", section: "catalog" },

  // Guest CRM & Delivery
  { labelKey: "nav.customers", href: "/customers", icon: UsersRound, permission: "customers.manage", section: "crm" },
  { labelKey: "nav.delivery", href: "/delivery", icon: Truck, permission: "delivery.manage", section: "crm" },
  { labelKey: "nav.marketing", href: "/marketing", icon: Megaphone, permission: "marketing.manage", section: "crm" },

  // Management & Back Office
  { labelKey: "nav.team", href: "/team", icon: Users, permission: "staff.manage", section: "management" },
  { labelKey: "nav.attendance", href: "/attendance", icon: Clock, section: "management" },
  { labelKey: "nav.accounting", href: "/accounting", icon: Landmark, permission: "accounting.manage", section: "management" },
  { labelKey: "nav.reports", href: "/reports", icon: BarChart3, permission: "reports.access", section: "management" },
  { labelKey: "nav.operations", href: "/operations", icon: Wrench, permission: "operations.manage", section: "management" },
  { labelKey: "nav.settings", href: "/settings", icon: Settings, permission: "settings.manage", section: "management" },
];
