"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Heart, Building, Users } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const ICONS = {
  Users,
  GraduationCap,
  Heart,
  Building,
};

export default function ImpactStats() {
  const [impact, setImpact] = useState(null);

  useEffect(() => {
    async function fetchImpact() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/homeimpactsection`,
          {
            cache: "force-cache",
          }
        );
        const data = await res.json();
        setImpact(data);
      } catch (e) {
        setImpact(null);
      }
    }
    fetchImpact();
  }, []);

  if (!impact) {
    return (
      <section className="py-10 px-4 bg-white min-h-[200px] flex items-center justify-center">
        <span className="text-gray-400">Loading...</span>
      </section>
    );
  }

  return (
    <section className="bg-[#F1F5F9]/20 relative py-16 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle Background Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.03),transparent_50%)]"></div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16 lg:mb-24">
          <h2 className={`${playfair.className} text-4xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight`}>
            {impact.title}
          </h2>
          <h3 className={`${playfair.className}font-bold text-slate-900 mb-6 tracking-tight`}>
            {impact.subtitle}
          </h3>
          <div className="h-1.5 w-20 bg-emerald-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {impact.stats?.map((stat, index) => {
            const Icon = ICONS[stat.icon] || Users;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-8 lg:p-10 text-center border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="h-8 w-8" style={{ color: stat.color }} />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="font-bold text-emerald-700 text-sm uppercase tracking-wider mb-3">
                    {stat.title}
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
