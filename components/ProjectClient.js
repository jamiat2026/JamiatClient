"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import ProjectCardsSection from "./ProjectCardsSection";
import { Filter, Search, ChevronDown, Heart, Droplets, GraduationCap, UtensilsCrossed, Gift, Coins, Target, Briefcase, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import useResponsiveLimit from "../app/hooks/useResponsiveLimit";
import useDebounce from "../app/hooks/useDebounce";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"], // choose weights you want
});


function Projects({ title }) {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput);

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [donationTypeFilter, setDonationTypeFilter] = useState(title || "all");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("Most Urgent");

  // Fetch categories with cleanup
  useEffect(() => {
    const controller = new AbortController();

    async function fetchCategories() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          { signal: controller.signal }
        );
        const data = await res.json();

        const cats = Array.isArray(data)
          ? data
          : Array.isArray(data.categories)
            ? data.categories
            : [];

        setCategories(cats);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch categories", error);
        }
      }
    }

    fetchCategories();

    return () => controller.abort();
  }, []);

  // Map icons to categories (mockup counts representing the image)
  const categoryData = useMemo(() => {
    const defaultIcons = {
      "Education": GraduationCap,
      "Social Welfare": Heart,
      "Emergency Relief": Plus,
      "Water Wells": Droplets,
      "Orphan Care": Gift,
      "Healthcare": Plus,
      "Religious": Coins
    };

    const counts = {
      "All Projects": 42,
      "Education": 12,
      "Social Welfare": 8,
      "Emergency Relief": 5,
      "Water Wells": 15,
      "Orphan Care": 7
    };

    return [
      { name: "All Projects", count: counts["All Projects"], icon: Briefcase },
      ...(categories.length > 0 ? categories : [
        { name: "Education" },
        { name: "Social Welfare" },
        { name: "Emergency Relief" },
        { name: "Water Wells" },
        { name: "Orphan Care" }
      ]).map(cat => ({
        name: cat.name,
        count: counts[cat.name] || Math.floor(Math.random() * 10) + 1,
        icon: defaultIcons[cat.name] || Briefcase
      }))
    ];
  }, [categories]);

  return (
    <div className="min-h-screen bg-[#f8fafb] text-[#1e293b]">
      {/* Search and Categories Layout */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 pt-32">
        <div className="flex flex-col lg:flex-row gap-16">

          {/* Sidebar */}
          <aside className="w-full lg:w-[320px] shrink-0 space-y-10">

            {/* Find Projects Card */}
            <div className="bg-[#D1FAE5] rounded-[2rem] p-8 border border-transparent">
              <h2 className="text-[1.2rem] font-bold mb-6 text-[#1e293b]">Find Projects</h2>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-white pl-11 pr-4 py-3.5 rounded-2xl border border-gray-100 focus:outline-none focus:ring-1 focus:ring-[#0fd38d] text-[0.9rem] text-gray-700 placeholder:text-gray-400 font-medium shadow-sm shadow-emerald-50"
                />
              </div>
            </div>

            {/* Categories Card */}
            <div className="bg-[#D1FAE5] rounded-[2rem] p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                  <Filter className="h-4 w-4 text-[#0fd38d]" />
                </div>
                <h2 className="text-[1.2rem] font-bold text-[#1e293b]">Categories</h2>
              </div>
              <div className="space-y-2">
                {categoryData.map((choice) => (
                  <button
                    key={choice.name}
                    onClick={() => setCategoryFilter(choice.name === "All Projects" ? "all" : choice.name)}
                    className={`flex items-center justify-between w-full px-5 py-4 rounded-xl transition-all duration-300 ${(categoryFilter === "all" && choice.name === "All Projects") || categoryFilter === choice.name
                      ? "bg-white shadow-lg shadow-emerald-50 text-[#0fd38d]"
                      : "text-gray-500 hover:text-[#0fd38d]"
                      }`}
                  >
                    <span className="text-[0.935rem] font-bold">
                      {choice.name}
                    </span>
                    <span className={`text-[0.65rem] font-black px-2.5 py-1 rounded-full ${(categoryFilter === "all" && choice.name === "All Projects") || categoryFilter === choice.name
                      ? "bg-[#effdf8] text-[#0fd38d]"
                      : "bg-gray-200/50 text-gray-400"
                      }`}>
                      {choice.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Impact CTA Card */}
            <div className="bg-[#059669] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-xl shadow-emerald-50">
              <h2 className={`${playfair.className} text-[1.6rem] font-black leading-tight mb-4 relative z-10`}>Make an Impact Today</h2>
              <p className="text-emerald-50 text-[0.85rem] leading-relaxed mb-10 relative z-10 opacity-90">
                Your Sadaqah Jariyah continues to benefit you even after you're gone.
              </p>
              <button className="w-full bg-white text-[#2ebc94] font-black py-4 rounded-2xl hover:bg-emerald-50 transition-colors duration-300 relative z-10 text-[0.9rem] shadow-lg shadow-emerald-900/10">
                Donate Generally
              </button>
              {/* Decorative circle */}
              <div className="absolute top-[-40px] right-[-40px] w-32 h-32 bg-white opacity-10 rounded-full"></div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
              <div>
                <h1 className={`${playfair.className} text-4xl md:text-[2.5rem]  font-bold text-[#1e293b] mb-3`}>Our Ongoing Projects</h1>
                <p className="text-gray-500 font-medium text-[0.95rem]">Discover causes that need your urgent support.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-[0.85rem] font-medium whitespace-nowrap">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-xl py-2.5 pl-5 pr-12 text-[0.85rem] font-bold text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#2ebc94]/20 cursor-pointer shadow-sm min-w-[140px]"
                  >
                    <option>Most Urgent</option>
                    <option>Newest</option>
                    <option>Popular</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </header>

            {/* Projects Grid */}
            <ProjectCardsSection
              searchTerm={debouncedSearch}
              categoryFilter={categoryFilter}
              donationTypeFilter={donationTypeFilter}
              initialLimit={useResponsiveLimit()}
              infiniteScroll={true}
              sortBy={sortBy}
            />

            {/* Pagination */}
            <div className="mt-24 flex items-center justify-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-100 text-gray-400 hover:bg-white transition-all">
                <ChevronLeft className="h-4 w-4" />
              </button>
              {[1, 2, 3, "...", 10].map((page, idx) => (
                page === "..." ? (
                  <span key={idx} className="px-2 text-gray-300 font-bold">...</span>
                ) : (
                  <button
                    key={idx}
                    className={`w-10 h-10 rounded-lg text-[0.85rem] font-bold transition-all duration-300 ${page === 1
                      ? "bg-[#2ebc94] text-white shadow-lg shadow-emerald-100 border-none"
                      : "text-gray-500 border border-gray-100 hover:bg-white"
                      }`}
                  >
                    {page}
                  </button>
                )
              ))}
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-100 text-gray-400 hover:bg-white transition-all">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Projects;
