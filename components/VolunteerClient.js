"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  Heart,
  Users,
  GraduationCap,
  Globe,
  UserPlus,
  MapPin,
  Home,
  ArrowRight,
  ChevronDown,
  Clock,
  Laptop
} from "lucide-react";

export const VolunteerPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    interest: "Event Organization",
    message: "",
    newsletter: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      toast.success("Registration successful! We'll be in touch soon.");
      setLoading(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        interest: "Event Organization",
        message: "",
        newsletter: false,
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header/Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            Community Service
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#064E3B] font-bold leading-tight">
            Give Your Time for a Greater Cause
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Join our dedicated team of volunteers and help us make a lasting impact. Your skills and time are the most valuable donation you can give.
          </p>
        </div>

        {/* Main Content: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50 flex items-center gap-3">
                <div className="bg-emerald-50 p-2 rounded-lg">
                  <UserPlus className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Volunteer Registration</h2>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="e.g. Yusuf"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="e.g. Khan"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="yusuf@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Area of Interest</label>
                  <div className="relative">
                    <select
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-gray-700"
                    >
                      <option>Event Organization</option>
                      <option>Teaching & Education</option>
                      <option>Community Outreach</option>
                      <option>Medical Support</option>
                      <option>Administrative Tasks</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Why do you want to volunteer?</label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Tell us a little about yourself..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none resize-none"
                  />
                </div>                <div className="p-4 bg-gray-50 rounded-2xl flex items-start gap-4">
                  <div
                    onClick={() => setFormData(prev => ({ ...prev, newsletter: !prev.newsletter }))}
                    className="flex items-center h-5 mt-1 cursor-pointer"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.newsletter ? 'border-[#10B981] bg-[#10B981]' : 'border-gray-300 bg-white'}`}>
                      {formData.newsletter && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <label
                      onClick={() => setFormData(prev => ({ ...prev, newsletter: !prev.newsletter }))}
                      className="text-sm font-bold text-gray-900 cursor-pointer block"
                    >
                      Keep me updated on future opportunities
                    </label>
                    <p className="text-sm text-gray-500">Receive occasional emails about new volunteer events.</p>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? "Registering..." : "Sign Up to Volunteer"}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Why Volunteer & Opportunities */}
          <div className="lg:col-span-5 space-y-10">

            {/* Why Volunteer Card */}
            <div className="bg-[#ECFDF5] rounded-3xl p-8 space-y-8">
              <h2 className="text-2xl font-serif text-[#064E3B] font-bold">Why Volunteer?</h2>

              <div className="space-y-6">
                {[
                  {
                    icon: Users,
                    title: "Build Community",
                    desc: "Connect with like-minded individuals and strengthen the bonds of our ummah."
                  },
                  {
                    icon: GraduationCap,
                    title: "Learn New Skills",
                    desc: "Gain valuable experience in leadership, organization, and social work."
                  },
                  {
                    icon: Heart,
                    title: "Earn Rewards",
                    desc: "Seek the pleasure of Allah through service to His creation."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <item.icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#064E3B]">{item.title}</h3>
                      <p className="text-emerald-800/70 text-sm leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Opportunities */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 px-2">Upcoming Opportunities</h2>

              <div className="space-y-4">
                {[
                  {
                    badge: "Next Weekend",
                    title: "Food Drive Distribution",
                    location: "Community Center hall B",
                    desc: "Help sort and distribute food packages to families in need for the upcoming month.",
                    icon: MapPin,
                    badgeColor: "bg-emerald-100 text-emerald-700"
                  },
                  {
                    badge: "Urgent",
                    title: "Youth Mentorship Program",
                    location: "Jamiat Youth Wing",
                    desc: "We need mentors to help guide high school students with college applications and career advice.",
                    icon: MapPin,
                    badgeColor: "bg-orange-100 text-orange-700"
                  },
                  {
                    badge: "Remote",
                    title: "Graphic Design Support",
                    location: "Work from home",
                    desc: "Assist our media team in creating flyers and social media posts for upcoming charity events.",
                    icon: Home,
                    badgeColor: "bg-blue-100 text-blue-700"
                  }
                ].map((opp, idx) => (
                  <div
                    key={idx}
                    className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-md transition-all cursor-pointer relative"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${opp.badgeColor}`}>
                        {opp.badge}
                      </span>
                      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-1">{opp.title}</h3>
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-3">
                      <opp.icon className="w-4 h-4" />
                      {opp.location}
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {opp.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerPage;
