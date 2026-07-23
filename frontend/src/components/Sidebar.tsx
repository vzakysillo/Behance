import { Link, useLocation } from "react-router-dom";
import {
  User,
  Home,
  MessageCircle,
  Briefcase,
  Bell,
  BarChart3,
  ShoppingBag,
  Newspaper,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { routes } from "../routes";

interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
  match?: string[];
}

const menuItems: MenuItem[] = [
  { icon: User, label: "Profile", path: routes.profile.root(), match: ["/profile"] },
  { icon: Home, label: "Home", path: routes.home(), match: ["/feed", "/", "/projects", "/users"] },
  { icon: Briefcase, label: "Vacancies", path: "#" },
  { icon: MessageCircle, label: "Chat", path: "#" },
  { icon: Bell, label: "Notifications", path: "#" },
  { icon: BarChart3, label: "Ranking", path: "#" },
  { icon: ShoppingBag, label: "Marketplace", path: "#" },
  { icon: Newspaper, label: "News", path: "#" },
  { icon: Settings, label: "Settings", path: "#" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 w-[200px] h-screen bg-[#e7e7e7] overflow-y-auto overflow-x-hidden">
      {/* Logo */}
      <Link
        to={routes.home()}
        className="absolute top-[10px] left-0 w-[240px] px-[10px] pr-5 py-[10px] flex items-center gap-[10px] no-underline focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]"
      >
        <div className="w-[18px] h-[18px] rounded-full border-2 border-black" />
        <span className="text-base font-medium font-['Inter',sans-serif] text-black">LOGO</span>
      </Link>

      {/* Nav */}
      <nav className="flex flex-col pt-[98px]">
        {menuItems.map((item) => {
          const isActive = item.match
            ? item.match.some((m) => location.pathname === m || location.pathname.startsWith(m + "/"))
            : location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={[
                "flex items-center gap-[10px] px-5 py-[10px] no-underline text-black/80 transition-colors w-[240px] box-border focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:-outline-offset-2",
                isActive ? "bg-[#b4b4b4]" : "hover:bg-[#d8d7d7]",
              ].join(" ")}
            >
              <Icon size={18} strokeWidth={2} className="shrink-0 text-black" />
              <span className="text-base font-medium font-['Inter',sans-serif] leading-6 whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
