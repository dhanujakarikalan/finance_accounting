import { Link, useLocation } from "react-router-dom";
import { cn } from "../../utils/cn";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  PieChart,
  TrendingUp,
  MessageSquare,
  Bell,
  Settings,
  BookOpen,
  RefreshCcw
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Ledger", href: "/ledger", icon: BookOpen },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Reconciliation", href: "/reconciliation", icon: RefreshCcw },
  { name: "Reports", href: "/reports", icon: PieChart },
  { name: "Forecast", href: "/forecast", icon: TrendingUp },
  { name: "AI Copilot", href: "/copilot", icon: MessageSquare },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar text-white shadow-xl">
      <div className="flex h-16 items-center px-6 border-b border-white/10">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">FinCopilot</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/20 text-primary border-r-2 border-primary"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-primary" : "text-slate-400"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 rounded-md bg-white/5 p-3">
          <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-sm font-medium">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">John Doe</span>
            <span className="text-xs text-slate-400 text-ellipsis overflow-hidden">Acme Corp</span>
          </div>
        </div>
      </div>
    </div>
  );
}
