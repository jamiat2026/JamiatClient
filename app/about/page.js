"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Sparkles, Eye, Heart, BookOpen, Users, FileText } from "lucide-react";
import AboutHeroSectionEditor from "../components/aboutherosection";
import AboutVisionSectionEditor from "../components/aboutvisionsection";
import AboutValuesSectionEditor from "../components/aboutvaluessection";
import AboutStorySectionEditor from "../components/aboutstorysection";
import AboutLeadershipSectionEditor from "../components/aboutleadershipsection";
import AboutFinancialSectionEditor from "../components/aboutfinancialsection";

const sections = [
  { name: "Hero", key: "hero", icon: Sparkles },
  { name: "Vision & Mission", key: "vision", icon: Eye },
  { name: "Values", key: "values", icon: Heart },
  { name: "Story", key: "story", icon: BookOpen },
  { name: "Leadership", key: "leadership", icon: Users },
  { name: "Financial", key: "financial", icon: FileText },
];

export default function AboutCMSPage() {
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

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const ActiveIcon = sections.find((s) => s.key === activeSection)?.icon;

  return (
    <div className="min-h-full w-full bg-gray-50/50 p-4 sm:p-8 rounded-3xl border border-gray-200/60 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">About Page</h1>
          <p className="text-sm text-gray-500">Manage the hero, vision & mission, values, and story sections.</p>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div className="sm:hidden relative">
        <button
          ref={buttonRef}
          onClick={() => setShowDropdown((prev) => !prev)}
          className="flex items-center justify-between w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 cursor-pointer hover:border-emerald-300 transition-all shadow-sm"
        >
          <span className="flex items-center gap-2">
            {ActiveIcon && <ActiveIcon size={16} className="text-emerald-600" />}
            {sections.find((s) => s.key === activeSection)?.name}
          </span>
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
        </button>

        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-1 z-10 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
          >
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.key}
                  onClick={() => {
                    setActiveSection(section.key);
                    setShowDropdown(false);
                  }}
                  className={`flex items-center gap-2.5 w-full text-left text-sm px-4 py-3 cursor-pointer font-medium transition-all ${activeSection === section.key
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <Icon size={16} className={activeSection === section.key ? "text-emerald-600" : "text-gray-400"} />
                  {section.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Tabs */}
      <nav className="hidden sm:flex gap-1 p-1 bg-white border border-gray-200 rounded-xl shadow-sm w-fit">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg cursor-pointer text-sm font-semibold transition-all duration-200 ${activeSection === section.key
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
            >
              <Icon size={16} />
              {section.name}
            </button>
          );
        })}
      </nav>

      {/* Section Content */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {activeSection === "hero" ? (
          <AboutHeroSectionEditor />
        ) : activeSection === "vision" ? (
          <AboutVisionSectionEditor />
        ) : activeSection === "values" ? (
          <AboutValuesSectionEditor />
        ) : activeSection === "story" ? (
          <AboutStorySectionEditor />
        ) : activeSection === "leadership" ? (
          <AboutLeadershipSectionEditor />
        ) : (
          <AboutFinancialSectionEditor />
        )}
      </div>
    </div>
  );
}

