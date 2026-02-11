import {
  LayoutDashboard,
  CreditCard,
  Users,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";

export const sidebarLinks = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "billing",
    label: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    id: "customers",
    label: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    id: "invoices",
    label: "Invoices",
    href: "/dashboard/invoices",
    icon: FileText,
  },
  {
    id: "reports",
    label: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/dashboard/settings/profile",
    icon: Settings,
  },
];
