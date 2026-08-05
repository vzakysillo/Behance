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
import { Logo } from "./ui";

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
    <aside className="peer group fixed left-0 top-0 h-screen bg-white overflow-y-auto overflow-x-hidden transition-[width] duration-200 ease-out w-[64px] hover:w-[200px]">
      {/* Logo */}
      <Link
        to={routes.home()}
        className="absolute top-[10px] left-0 w-full pl-5 pr-2.5 py-2.5 flex items-center gap-[10px] no-underline focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]"
      >
        <Logo size="md" wordClassName="hidden group-hover:inline" />
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
                "flex items-center gap-[10px] px-5 py-2.5 no-underline transition-colors w-full box-border focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:-outline-offset-2 rounded-tr-[15px] rounded-br-[15px]",
                isActive ? "bg-[#6146ea] text-white" : "text-[#1b1b1b] hover:bg-[#f0f0f0]",
              ].join(" ")}
            >
              <Icon size={24} strokeWidth={2} className={`shrink-0 ${isActive ? "text-white" : "text-[#1b1b1b]"}`} />
              <span className="hidden group-hover:inline text-base font-medium font-sans leading-6 whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
