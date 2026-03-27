"use client";
import { useEffect, useRef, useState } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import * as LucideIcons from "lucide-react";

// Curated list of commonly used Lucide icon names for categories
const ICON_NAMES = [
  "Heart", "Star", "Home", "Book", "BookOpen", "GraduationCap", "School",
  "Users", "User", "UserCheck", "Baby", "HandHeart", "Handshake",
  "Building", "Building2", "Church", "Landmark", "Hospital",
  "Stethoscope", "Pill", "Syringe", "Activity", "HeartPulse",
  "Apple", "Utensils", "CookingPot", "Wheat", "Droplets", "Droplet",
  "Trees", "TreePine", "Leaf", "Sprout", "Flower2", "Sun", "Moon",
  "Globe", "Globe2", "Map", "MapPin", "Compass", "Navigation",
  "Briefcase", "Wallet", "Banknote", "Coins", "PiggyBank", "TrendingUp",
  "BarChart3", "PieChart", "LineChart", "Target", "Award", "Trophy", "Medal",
  "Shield", "ShieldCheck", "Lock", "Unlock", "Key",
  "Lightbulb", "Zap", "Flame", "Sparkles", "Gem",
  "Music", "Palette", "Paintbrush", "Camera", "Film", "Mic",
  "Phone", "Mail", "MessageCircle", "Send", "Bell", "Megaphone",
  "Laptop", "Monitor", "Smartphone", "Wifi", "Signal", "Bluetooth",
  "Cloud", "CloudRain", "CloudSun", "Umbrella", "Wind", "Snowflake",
  "Car", "Bus", "Train", "Plane", "Ship", "Bike",
  "Package", "Gift", "ShoppingBag", "ShoppingCart", "Store",
  "Wrench", "Hammer", "Settings", "Cog", "CircleDot",
  "FileText", "File", "FolderOpen", "ClipboardList", "Newspaper",
  "Calendar", "Clock", "Timer", "Hourglass", "AlarmClock",
  "Eye", "EyeOff", "Search", "Scan", "Focus",
  "ArrowRight", "ArrowUp", "CheckCircle", "XCircle", "AlertCircle", "Info",
  "LayoutGrid", "Grid3X3", "List", "Rows3", "Columns3",
  "Link", "ExternalLink", "Share2", "Download", "Upload",
  "Recycle", "RefreshCw", "RotateCcw", "Repeat", "Infinity",
  "Smile", "Frown", "ThumbsUp", "ThumbsDown", "HeartHandshake",
  "Cross", "Scale", "Gavel", "ScrollText", "BookMarked",
  "Microscope", "TestTube", "Atom", "Dna", "Brain",
  "Mountain", "Waves", "Fish", "Bird", "PawPrint",
  "Tent", "Backpack", "Flag", "Crown", "Rocket",
];

// Filter to only icons that actually exist in the installed lucide-react version
const AVAILABLE_ICONS = ICON_NAMES.filter((name) => LucideIcons[name]);

export default function LucideIconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = AVAILABLE_ICONS.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  const SelectedIcon = value ? LucideIcons[value] : null;

  return (
    <div className="relative">
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
        Icon
      </label>

      {/* Trigger button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white hover:border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none cursor-pointer"
      >
        <span className="flex items-center gap-2 text-gray-700">
          {SelectedIcon ? (
            <>
              <SelectedIcon size={16} className="text-emerald-600" />
              <span>{value}</span>
            </>
          ) : (
            <span className="text-gray-400">Select an icon...</span>
          )}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={pickerRef}
          className="absolute z-50 mt-2 w-full sm:w-[420px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
          style={{ maxHeight: "380px" }}
        >
          {/* Search */}
          <div className="sticky top-0 bg-white border-b border-gray-100 p-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search icons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                autoFocus
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {value && (
              <button
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className="mt-2 text-xs text-red-500 hover:text-red-600 cursor-pointer font-medium"
              >
                ✕ Clear selection
              </button>
            )}
          </div>

          {/* Icon Grid */}
          <div
            className="p-3 overflow-y-auto grid grid-cols-8 gap-1"
            style={{ maxHeight: "290px" }}
          >
            {filtered.length === 0 && (
              <p className="col-span-8 text-center text-xs text-gray-400 py-6">
                No icons found for &ldquo;{search}&rdquo;
              </p>
            )}
            {filtered.map((name) => {
              const Icon = LucideIcons[name];
              const isSelected = value === name;
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => {
                    onChange(name);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`flex items-center justify-center w-full aspect-square rounded-lg cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500 shadow-sm"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                >
                  <Icon size={18} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
