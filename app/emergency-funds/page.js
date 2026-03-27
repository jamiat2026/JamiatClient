"use client";
import { useEffect, useState, useRef } from "react";
import EmergencyAboutEditor from "../components/emergency/EmergencyAboutEditor";
import EmergencyMediaEditor from "../components/emergency/EmergencyMediaEditor";
import EmergencyUpdatesEditor from "../components/emergency/EmergencyUpdatesEditor";
import EmergencyDonationEditor from "../components/emergency/EmergencyDonationEditor";
import { ChevronDown, Layout, Info, Image, RefreshCw, Heart } from "lucide-react";

const sections = [
  { name: "About Campaign", key: "about", icon: <Info size={16} /> },
  { name: "Media Gallery", key: "media", icon: <Image size={16} /> },
  { name: "Live Updates", key: "updates", icon: <RefreshCw size={16} /> },
  { name: "Donation Status", key: "status", icon: <Heart size={16} /> },
];

export default function EmergencyFundsCMS() {
  const [activeSection, setActiveSection] = useState("about");
  const [showDropdown, setShowDropdown] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fundRes, toggleRes] = await Promise.all([
          fetch("/api/emergency-fund"),
          fetch("/api/emergency-fund/toggle")
        ]);
        const fundData = await fundRes.json();
        const toggleData = await toggleRes.json();

        setData(fundData || {});
        setIsActive(toggleData.isActive ?? true);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = async (updatedFields) => {
    setSaving(true);
    try {
      const res = await fetch("/api/emergency-fund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ...updatedFields }),
      });
      const updated = await res.json();
      setData(updated);
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
    setToggleLoading(true);
    try {
      const newState = !isActive;
      const res = await fetch("/api/emergency-fund/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newState }),
      });
      if (res.ok) {
        setIsActive(newState);
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Toggle update error:", error);
      alert("Error updating status.");
    } finally {
      setToggleLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-8 bg-gray-50/50 rounded-3xl p-4 sm:p-8 border border-gray-200/60 shadow-sm transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bolcd tracking-tight text-gray-900">Emergency Funds Editor</h1>
          <p className="text-sm text-gray-500 font-normal">Manage the content, updates, and donation status for emergency campaigns.</p>
        </div>

        <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm p-2 px-5 rounded-2xl border border-gray-200/80 shadow-sm border-b-4 border-b-transparent hover:border-b-emerald-500/10 transition-all duration-300 group">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Visibility</span>
            <span className={`text-[11px] font-bold flex items-center gap-1.5 ${isActive ? 'text-emerald-600' : 'text-gray-500'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></span>
              {isActive ? 'Live' : 'Hidden'}
            </span>
          </div>
          <button
            onClick={handleToggle}
            disabled={toggleLoading}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-500 focus:outline-none ${isActive
                ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                : 'bg-gray-300/80 shadow-inner'
              } ${toggleLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'}`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isActive ? 'translate-x-6 scale-110' : 'translate-x-1 scale-90'}`} />
          </button>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden lg:block">
          <div className="inline-flex p-1.5 bg-gray-100/50 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-inner">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${activeSection === section.key
                    ? "bg-white text-emerald-600 shadow-[0_2px_10px_rgba(0,0,0,0.06)] scale-[1.02] ring-1 ring-gray-200/30"
                    : "text-gray-500 hover:text-gray-900 hover:bg-white/40"
                  }`}
              >
                <div className={`${activeSection === section.key ? 'text-emerald-500 scale-110' : 'text-gray-400'} transition-all duration-300`}>
                  {section.icon}
                </div>
                {section.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet Dropdown Trigger */}
        <div className="lg:hidden relative">
          <button
            ref={buttonRef}
            onClick={() => setShowDropdown((prev) => !prev)}
            className="flex items-center justify-between w-full px-5 py-3 bg-white border border-gray-200/80 rounded-2xl text-sm font-bold text-gray-700 shadow-sm active:scale-[0.98] transition-all"
          >
            <span className="flex items-center gap-2.5">
              <div className="p-1.5 bg-emerald-50 rounded-lg">
                <Layout size={16} className="text-emerald-600" />
              </div>
              {sections.find(s => s.key === activeSection)?.name}
            </span>
            <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute top-full mt-2 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-2xl shadow-xl ring-1 ring-black/5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
            >
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => {
                    setActiveSection(section.key)
                    setShowDropdown(false)
                  }}
                  className={`flex items-center gap-3 w-full text-left px-5 py-3.5 text-sm font-bold transition-all ${activeSection === section.key
                      ? "bg-emerald-50 text-emerald-700 border-r-4 border-emerald-500"
                      : "text-gray-600 hover:bg-gray-50 hover:pl-6"
                    }`}
                >
                  <span className={`${activeSection === section.key ? 'text-emerald-500' : 'text-gray-400'}`}>
                    {section.icon}
                  </span>
                  {section.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor Container */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px] transition-all duration-500 ease-in-out">
        <div className="p-6 sm:p-10">
          {activeSection === "about" && (
            <EmergencyAboutEditor data={data} onSave={handleSave} saving={saving} />
          )}
          {activeSection === "media" && (
            <EmergencyMediaEditor data={data} onSave={handleSave} saving={saving} />
          )}
          {activeSection === "updates" && (
            <EmergencyUpdatesEditor data={data} onSave={handleSave} saving={saving} />
          )}
          {activeSection === "status" && (
            <EmergencyDonationEditor data={data} onSave={handleSave} saving={saving} />
          )}
        </div>
      </div>
    </div>
  );
}
