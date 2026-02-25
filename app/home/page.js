"use client"
import { useEffect, useRef, useState } from "react"
import HomeHeroSectionEditor from "../components/homeherosection"
import HomeImpactSectionEditor from "../components/homeimpactsection"
import HomeQuoteSectionEditor from "../components/homequotesection"
import { ChevronDown, Layout } from "lucide-react";

const sections = [
  { name: "Hero Section", key: "hero" },
  { name: "Impact Stats", key: "impact" },
  { name: "Quote Section", key: "tag" },
]

export default function HomeCMSPage() {
  const [activeSection, setActiveSection] = useState("hero");
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

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

  return (
    <div className="min-h-full space-y-8 bg-gray-50/50 rounded-3xl p-4 sm:p-8 border border-gray-200/60 shadow-sm transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Home Page Editor</h1>
          <p className="text-sm text-gray-500 font-normal">Manage the content and layout of your landing page sections.</p>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden sm:block">
          <div className="inline-flex p-1 bg-gray-100/80 rounded-xl border border-gray-200/50">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${activeSection === section.key
                  ? "bg-white text-emerald-600 shadow-sm ring-1 ring-gray-200/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                  }`}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Dropdown Trigger */}
        <div className="sm:hidden relative">
          <button
            ref={buttonRef}
            onClick={() => setShowDropdown((prev) => !prev)}
            className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Layout size={16} className="text-emerald-600" />
              {sections.find(s => s.key === activeSection)?.name}
            </span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute top-full mt-2 left-0 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg ring-1 ring-black/5 overflow-hidden"
            >
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => {
                    setActiveSection(section.key)
                    setShowDropdown(false)
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${activeSection === section.key
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  {section.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor Container */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-6 sm:p-10">
          {activeSection === "hero" ? (
            <HomeHeroSectionEditor />
          ) : activeSection === "impact" ? (
            <HomeImpactSectionEditor />
          ) : (
            <HomeQuoteSectionEditor />
          )}
        </div>
      </div>
    </div>
  )
}
