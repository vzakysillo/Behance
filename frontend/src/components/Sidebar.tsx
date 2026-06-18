import { Link, useLocation } from "react-router-dom";
import { routes } from "../routes";

const menuItems = [
  { icon: "profile", label: "Profile", path: routes.profile.root() },
  { icon: "home", label: "Home", path: routes.home() },
  { icon: "chat", label: "Chat", path: "#" },
  { icon: "vacancies", label: "Vacancies", path: "#" },
  { icon: "notifications", label: "Notifications", path: "#" },
  { icon: "ranking", label: "Ranking", path: "#" },
  { icon: "marketplace", label: "Marketplace", path: "#" },
  { icon: "news", label: "News", path: "#" },
  { icon: "settings", label: "Settings", path: "#" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 w-[200px] h-screen bg-[#e7e7e7] overflow-y-auto overflow-x-hidden">
      {/* Logo */}
      <div className="absolute top-[10px] left-0 w-[240px] px-[10px] pr-5 py-[10px] flex items-center gap-[10px]">
        <div className="w-[18px] h-[18px] rounded-full border-2 border-black" />
        <span className="text-base font-medium font-['Inter',sans-serif] text-black">LOGO</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col pt-[98px]">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={[
                "flex items-center gap-[10px] px-5 py-[10px] no-underline text-black/80 transition-colors w-[240px] box-border",
                isActive ? "bg-[#b4b4b4]" : "hover:bg-[#d8d7d7]",
              ].join(" ")}
            >
              <div className="w-[18px] h-[18px] flex items-center justify-center shrink-0">
                {item.icon === "profile" && (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="6" r="3" fill="black" />
                    <path d="M3 17C3 13.13 5.13 11 9 11C12.87 11 15 13.13 15 17" stroke="black" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                {item.icon === "home" && (
                  <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
                    <path d="M9 1L1 7V15H7V10H11V15H17V7L9 1Z" stroke="black" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                )}
                {item.icon === "vacancies" && (
                  <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
                    <rect x="1" y="1" width="16" height="14" rx="2" stroke="black" strokeWidth="2" />
                    <path d="M5 5H13M5 8H13M5 11H10" stroke="black" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                {item.icon === "chat" && (
                  <svg width="18" height="17" viewBox="0 0 18 17" fill="none">
                    <path d="M1 14.5V2C1 1.45 1.45 1 2 1H16C16.55 1 17 1.45 17 2V12C17 12.55 16.55 13 16 13H5L1 14.5Z" stroke="black" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                )}
                {item.icon === "notifications" && (
                  <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                    <path d="M9 2C5.13 2 2 5.13 2 9V14L1 15V16H17V15L16 14V9C16 5.13 12.87 2 9 2Z" stroke="black" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M7 17C7 17.55 7.45 18 8 18H10C10.55 18 11 17.55 11 17" stroke="black" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                {item.icon === "ranking" && (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="1" y="1" width="4" height="6" rx="1" stroke="black" strokeWidth="2" />
                    <rect x="7" y="4" width="4" height="10" rx="1" stroke="black" strokeWidth="2" />
                    <rect x="13" y="7" width="4" height="7" rx="1" stroke="black" strokeWidth="2" />
                  </svg>
                )}
                {item.icon === "marketplace" && (
                  <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
                    <path d="M1 1H17L16 15H2L1 1Z" stroke="black" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M6 6C6 6 7.5 4 9 4C10.5 4 12 6 12 6" stroke="black" strokeWidth="2" strokeLinecap="round" />
                    <path d="M6 10C6 10 7.5 8 9 8C10.5 8 12 10 12 10" stroke="black" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                {item.icon === "news" && (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="8" stroke="black" strokeWidth="2" />
                    <circle cx="9" cy="9" r="3" stroke="black" strokeWidth="2" />
                    <path d="M9 1V3M9 15V17M1 9H3M15 9H17" stroke="black" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                {item.icon === "settings" && (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="3" stroke="black" strokeWidth="2" />
                    <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.22 3.22l1.42 1.42M13.36 13.36l1.42 1.42M3.22 14.78l1.42-1.42M13.36 4.64l1.42-1.42" stroke="black" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
              </div>
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
