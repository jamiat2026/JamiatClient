"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  ChevronUp,
  Users,
  LayoutDashboard,
  FolderKanban,
  Handshake,
  BookOpen,
  Settings as SettingsIcon,
  Database,
  User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Logo from "../../public/logo.png";
import { TbCategory } from "react-icons/tb";
import { RiPagesLine } from "react-icons/ri";
import { VscLayoutPanelJustify } from "react-icons/vsc";
import { FcAbout } from "react-icons/fc";

const cmsNavItems = [
  { name: "Home", key: "dashboard", href: "/home", icon: <LayoutDashboard size={18} /> },
  { name: "Projects", key: "cms", href: "/projects", icon: <FolderKanban size={18} /> },
  { name: "Impact", key: "cms", href: "/impact", icon: <BookOpen size={18} /> },
  { name: "About", key: "about", href: "/about", icon: <FcAbout size={18} /> },
  { name: "Donate Page", key: "cms", href: "/donatepage", icon: <Handshake size={18} /> },
  { name: "Volunteers", key: "cms", href: "/volunteers/list", icon: <Users size={18} /> },
  { name: "Blogs", key: "blogs", href: "/blogs", icon: <RiPagesLine size={18} /> },
  { name: "Categories", key: "categories", href: "/categories", icon: <TbCategory size={18} /> },
  { name: "Footer", key: "footer", href: "/footer", icon: <VscLayoutPanelJustify size={18} /> },
];

const navItems = [
  { name: "Dashboard", key: "dashboard", href: "/", icon: <LayoutDashboard size={18} /> },
  { name: "CMS", key: "cms", icon: <Database size={18} /> },
  { name: "Donation", key: "donations", href: "/donation", icon: <Handshake size={18} /> },
  { name: "Donors", key: "donors", href: "/donors", icon: <Users size={18} /> },
  { name: "Settings", key: "settings", href: "/settings", icon: <SettingsIcon size={18} /> },
];

export default function Sidebar({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cmsDropdown, setCmsDropdown] = useState(false);
  const [access, setAccess] = useState([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");

  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const isCmsActive = cmsNavItems.some((item) => pathname.startsWith(item.href));

  const fetchAccess = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${encodeURIComponent(user.email)}`);
      if (!res.ok) throw new Error("Access fetch failed");
      const data = await res.json();
      setAccess(data.access || []);
      setRole(data.role || "");
    } catch (err) {
      console.error("Failed to load user access:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccess();
  }, [user]);

  const show = (key) => access.includes(key);

  const navLinkClass = (href) => `
    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
    ${pathname === href
      ? "bg-emerald-600/15 text-emerald-400 ring-1 ring-emerald-500/20"
      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"}
  `;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0b0f1a] text-slate-300 border-r border-slate-800/60 overflow-hidden custom-scroll">
      {/* Branding Section */}
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 px-2">
          <div className="flex items-center justify-center p-2 rounded-xl bg-emerald-600 ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-500/20">
            <Image src={Logo} alt="Logo" className="h-6 w-auto brightness-110" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white uppercase" translate="no">Jamiat</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-hide">
        {loading ? (
          <div className="space-y-4 px-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full h-10 rounded-xl bg-slate-800/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <p className="px-4 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Core</p>
            {show("dashboard") && (
              <Link href="/" onClick={() => setIsOpen(false)} className={navLinkClass("/")}>
                {navItems[0].icon} {navItems[0].name}
              </Link>
            )}

            {show("cms") && (
              <div className="space-y-1">
                <button
                  onClick={() => setCmsDropdown(!cmsDropdown)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 
                    ${isCmsActive ? "text-emerald-400 bg-emerald-600/5" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"}`}
                >
                  <div className="flex items-center gap-3">
                    <Database size={18} /> CMS
                  </div>
                  {cmsDropdown || isCmsActive ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {(cmsDropdown || isCmsActive) && (
                  <div className="ml-4 pl-4 border-l border-slate-800/60 space-y-1 my-2">
                    {cmsNavItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`
                          flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200
                          ${pathname.startsWith(item.href) ? "text-emerald-400 font-semibold" : "text-slate-500 hover:text-slate-200"}
                        `}
                      >
                        {item.icon} {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {show("donations") && (
              <Link href="/donation" onClick={() => setIsOpen(false)} className={navLinkClass("/donation")}>
                {navItems[2].icon} {navItems[2].name}
              </Link>
            )}

            {show("donors") && (
              <Link href="/donors" onClick={() => setIsOpen(false)} className={navLinkClass("/donors")}>
                {navItems[3].icon} {navItems[3].name}
              </Link>
            )}

            <div className="pt-4">
              <p className="px-4 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">System</p>
              {show("settings") && (
                <Link href="/settings" onClick={() => setIsOpen(false)} className={navLinkClass("/settings")}>
                  {navItems[4].icon} {navItems[4].name}
                </Link>
              )}
            </div>
          </>
        )}
      </div>

      {/* User Profile Footer Section */}
      {user && (
        <div className="px-4 py-6 border-t border-slate-800/40 bg-[#0b0f1a]/80 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-slate-900/40 border border-slate-800/60 ring-1 ring-white/5 shadow-inner">
            <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 flex-1 min-w-0 group">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform duration-200">
                <User size={20} />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] uppercase font-black tracking-wider text-slate-500 group-hover:text-emerald-500 transition-colors">{role || 'User'}</p>
              </div>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 group/logout"
              title="Logout"
            >
              <LogOut size={16} className="group-hover/logout:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* Desktop Sidebar (Static) */}
      <aside className="hidden md:block w-72 lg:w-64 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden flex">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={() => setIsOpen(false)} />
          <div className="relative w-80 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-300 ease-out">
            <SidebarContent />
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 -right-14 p-2.5 bg-emerald-600 text-white rounded-full shadow-lg ring-4 ring-emerald-500/20 hover:scale-110 active:scale-95 transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main Layout Area */}
      <div className="flex flex-col flex-1 min-w-0 bg-[#f8fafc]">
        {/* Mobile Header (Only visible on small screens) */}
        <header className="flex items-center justify-between px-6 py-4 md:hidden bg-[#0b0f1a] border-b border-slate-800 shadow-xl">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsOpen(true)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center p-1.5 ring-1 ring-white/10">
                <Image src={Logo} alt="Logo" className="brightness-125" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white uppercase" translate="no">Jamiat</span>
            </div>
          </div>
          {user && (
            <Link href="/profile" className="h-10 w-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 ring-1 ring-white/5 active:scale-95 transition-transform">
              <User size={20} />
            </Link>
          )}
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-0 md:p-4 lg:p-6">
          <div className="h-full w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
