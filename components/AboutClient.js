"use client";
import React, { useState, useEffect } from "react";
import {
  Star,
  Users,
  Heart,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  History,
  Briefcase,
  ChevronRight,
  Download,
  PieChart,
  Gem,
} from "lucide-react";
import { motion } from "framer-motion";

const LEADERSHIP_DATA = [
  {
    name: "Ahmed Khan",
    role: "Executive Director",
    bio: "Former management consultant with 15 years of non-profit leadership experience.",
    initials: "AK",
    color: "bg-blue-100",
    textColor: "text-blue-600",
  },
  {
    name: "Sarah Al-Fayed",
    role: "Director of Finance",
    bio: "CPA ensuring every dollar is allocated with efficiency and transparency.",
    initials: "SA",
    color: "bg-emerald-100",
    textColor: "text-emerald-600",
  },
  {
    name: "Omar Malik",
    role: "Outreach Coordinator",
    bio: "Bridging the gap between our donors and the communities we serve.",
    initials: "OM",
    color: "bg-purple-100",
    textColor: "text-purple-600",
  },
  {
    name: "Zainab Hassan",
    role: "Education Program Lead",
    bio: "Passionate educator developing curriculums for underprivileged youth.",
    initials: "ZH",
    color: "bg-amber-100",
    textColor: "text-amber-600",
  },
];

const AboutClient = () => {
  const [hero, setHero] = useState(null);
  const [vision, setVision] = useState(null);
  const [values, setValues] = useState(null);
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const [heroRes, visionRes, valuesRes, storyRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/aboutherosection`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/aboutvisionsection`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/aboutvaluesection`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/aboutstorysection`),
        ]);

        const [heroData, visionData, valuesData, storyData] = await Promise.all([
          heroRes.json(),
          visionRes.json(),
          valuesRes.json(),
          storyRes.json(),
        ]);

        setHero(heroData);
        setVision(visionData);
        setValues(valuesData);
        setStory(storyData);
      } catch (err) {
        console.error("Failed to fetch about page data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 px-5 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-[5%] left-[-5%] w-[30%] h-[30%] bg-blue-50 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-6 lg:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-medium text-sm border border-emerald-100/50"
          >
            <Users className="w-4 h-4" />
            <span>Who We Are</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl lg:text-7xl font-serif font-bold tracking-tight text-slate-900 leading-[1.1]"
          >
            Serving Humanity with <br className="hidden lg:block" />
            <span className="text-emerald-600">Compassion & Ihsan</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            {hero?.subtitle ||
              "Since 1995, Jamiat has been dedicated to uplifting underserved communities through sustainable development, education, and immediate relief."}
          </motion.p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
              Our Story
            </h2>
            <div className="w-12 h-1 bg-emerald-600 rounded-full" />
          </div>
          <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
            <p>
              It <span className="font-semibold text-slate-900">started</span> with a simple vision: to provide a safety net for those who had nowhere else to turn. What began as a small food pantry in a community basement has grown into a global organization touching thousands of lives annually.
            </p>
            <p>
              Through decades of service, we have learned that true change comes not just from aid, but from empowerment. Our journey is defined by the resilience of the people we serve and the generosity of our donors who make it all possible.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 pt-4">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-emerald-600">
                {hero?.stats?.yearsOfImpact?.value || "28+"}
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                YEARS OF SERVICE
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-emerald-600">
                {hero?.stats?.livesChanged?.value || "50k+"}
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                LIVES IMPACTED
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 gap-4 lg:gap-6"
        >
          {[
            { icon: <History className="w-8 h-8" />, color: "bg-slate-100" },
            { icon: <Heart className="w-8 h-8" />, color: "bg-slate-100" },
            { icon: <Users className="w-8 h-8" />, color: "bg-slate-100" },
            { icon: <Gem className="w-8 h-8" />, color: "bg-slate-100" },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`${item.color} aspect-square rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200/50 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all duration-300 group shadow-sm`}
            >
              <div className="group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Our Core Values */}
      <section className="bg-emerald-50/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-32 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
              Our Core Values
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Guided by faith and driven by a commitment to excellence in all that we do.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                title: "Integrity (Amanah)",
                desc: "We hold ourselves accountable to the highest standards of transparency and ethical conduct.",
                icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
                bg: "bg-emerald-50",
              },
              {
                title: "Compassion (Rahmah)",
                desc: "Our work is rooted in empathy, treating every individual with dignity and respect.",
                icon: <Heart className="w-6 h-6 text-emerald-600" />,
                bg: "bg-emerald-50",
              },
              {
                title: "Excellence (Ihsan)",
                desc: "We strive for perfection in our service, ensuring effective and sustainable impact.",
                icon: <Star className="w-6 h-6 text-emerald-600" />,
                bg: "bg-emerald-50",
              },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 lg:p-12 rounded-[2rem] shadow-sm border border-emerald-100/50 flex flex-col items-center text-center space-y-6 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300"
              >
                <div className={`${value.bg} w-16 h-16 rounded-2xl flex items-center justify-center`}>
                  {value.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900">
                    {value.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-32 space-y-16">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
          <div className="space-y-4 text-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
              Leadership
            </h2>
            <p className="text-slate-500 text-lg">
              Meet the dedicated individuals guiding our mission forward.
            </p>
          </div>
          <a
            href="/board"
            className="group flex items-center gap-2 text-emerald-600 font-bold tracking-tight hover:text-emerald-700 transition-colors uppercase text-sm"
          >
            View Board of Directors
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {LEADERSHIP_DATA.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group space-y-6 text-center"
            >
              <div className="relative mx-auto w-32 h-32 lg:w-40 lg:h-40">
                <div className="absolute inset-0 bg-emerald-100 rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className={`relative w-full h-full ${member.color} rounded-full flex items-center justify-center border-4 border-white shadow-lg`}>
                  <span className={`text-2xl lg:text-3xl font-bold ${member.textColor}`}>
                    {member.initials}
                  </span>
                  <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center border border-slate-100">
                    {idx % 2 === 0 ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-xl text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-emerald-600 font-medium text-sm">
                    {member.role}
                  </p>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed px-4">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Financial Transparency Section */}
      <section className="px-5 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto w-full">
        <div className="relative bg-[#0F172A] rounded-[2.5rem] overflow-hidden p-8 lg:p-16 text-white flex flex-col lg:flex-row gap-16 items-center shadow-2xl">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]" />
          </div>

          <div className="relative z-10 lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 font-medium text-xs border border-emerald-400/20">
              <PieChart className="w-4 h-4" />
              <span>Financial Transparency</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
              Your Trust is Our Amanah
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              We believe in complete transparency. Every year, we publish detailed reports so you can see exactly how your contributions are making a difference. We maintain low administrative costs to maximize impact.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
                <Download className="w-4 h-4" />
                2023 Annual Report
              </button>
              <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold flex items-center gap-2 transition-all">
                View Past Reports
              </button>
            </div>
          </div>

          <div className="relative z-10 lg:w-1/2 w-full">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-10 space-y-10 shadow-2xl">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    TOTAL REVENUE
                  </p>
                  <p className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                    $2.4 Million
                  </p>
                </div>
                <div className="bg-emerald-500/20 p-2 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
              </div>

              <div className="space-y-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  ALLOCATION OF FUNDS
                </p>
                <div className="space-y-6">
                  {[
                    { label: "Program Services", val: 88, color: "bg-emerald-500" },
                    { label: "Fundraising", val: 8, color: "bg-blue-400" },
                    { label: "Administration", val: 4, color: "bg-slate-400" },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-300">{item.label}</span>
                        <span className="text-white font-bold">{item.val}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.val}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: idx * 0.2 }}
                          className={`h-full ${item.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 text-[10px] text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" />
                Audited by independent third-party firms annually.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing for Footer */}
      <div className="h-20 lg:h-32" />
    </div>
  );
};

export default AboutClient;

