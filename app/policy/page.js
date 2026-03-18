"use client";

import { Playfair_Display } from "next/font/google";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Lock, Eye, Database, Bell, UserCheck, ShieldAlert } from "lucide-react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-emerald-100">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-50/50 to-transparent pointer-events-none" />
        <div className="absolute top-20 right-[-10%] w-72 h-72 bg-emerald-200/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-40 left-[-5%] w-64 h-64 bg-slate-200/30 blur-[80px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <nav className="flex items-center justify-center gap-2 mb-6 text-sm font-medium text-slate-500 animate-fade-in">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-emerald-700">Privacy Policy</span>
          </nav>
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Lock className="h-3.5 w-3.5" />
            Data Protection
          </div>
          
          <h1 className={`${playfair.className} text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6`}>
            Privacy <span className="text-emerald-600">Policy</span>
          </h1>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            At Jamiat Foundation, we value your trust and are committed to protecting your personal information. This policy outlines how we handle your data.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-24 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[2.5rem] p-8 md:p-12">
            <div className="prose prose-slate max-w-none text-justify leading-relaxed text-slate-600">
              <p className="text-lg mb-10 text-slate-700 italic border-l-4 border-emerald-500 pl-6 py-2 bg-emerald-50/30 rounded-r-2xl">
                This Privacy Policy outlines how Jamiat Foundation collects, stores, and uses your data. By using our platform, you consent to the practices described in this policy.
              </p>

              <div className="space-y-12">
                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-200">1</div>
                  <h3 className={`${playfair.className} text-2xl font-bold text-slate-900 mb-4`}>Information We Collect</h3>
                  <ul className="list-none space-y-4 mt-4">
                    {[
                      "Full name, phone number, and email address",
                      "PAN Card Number (mandatory for Indian donors under tax regulations)",
                      "Donation details (amount, frequency, method—note: no card or banking data is stored)",
                      "Location or IP address (for analytics and fraud prevention)",
                      "Any data submitted via contact or beneficiary forms"
                    ].map((item, i) => (
                      <li key={i} className="flex gap-4">
                        <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-200">2</div>
                  <h3 className={`${playfair.className} text-2xl font-bold text-slate-900 mb-4`}>How We Use Your Information</h3>
                  <ul className="list-none space-y-4 mt-4">
                    {[
                      "Process donations and issue official receipts",
                      "Meet legal and regulatory requirements",
                      "Share impact updates, newsletters, and reports",
                      "Communicate project-related information and respond to queries",
                      "Improve our website and engagement based on anonymized analytics"
                    ].map((item, i) => (
                      <li key={i} className="flex gap-4">
                        <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-200">3</div>
                  <h3 className={`${playfair.className} text-2xl font-bold text-slate-900 mb-4`}>Zakat Compliance</h3>
                  <p>Zakat donations are tracked and managed separately. We verify eligibility of Zakat beneficiaries through a transparent and Shariah-compliant due diligence process.</p>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-200">4</div>
                  <h3 className={`${playfair.className} text-2xl font-bold text-slate-900 mb-4`}>Data Sharing</h3>
                  <ul className="list-none space-y-4 mt-4">
                    {[
                      "We do not sell or rent your data to third parties.",
                      "We may share data with third-party vendors (e.g., payment gateways, cloud tools) strictly for operational use and under confidentiality agreements.",
                      "We may disclose data to comply with legal obligations or government requests."
                    ].map((item, i) => (
                      <li key={i} className="flex gap-4">
                        <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-200">5</div>
                  <h3 className={`${playfair.className} text-2xl font-bold text-slate-900 mb-4`}>Cookies and Tracking</h3>
                  <p>Our website uses cookies to personalize content and track user interactions. You can manage cookie settings in your browser at any time.</p>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-200">6</div>
                  <h3 className={`${playfair.className} text-2xl font-bold text-slate-900 mb-4`}>Data Security</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {[
                      { icon: ShieldCheck, text: "SSL encryption for all data transfers" },
                      { icon: Lock, text: "Strict access controls for personal data" },
                      { icon: Eye, text: "Regular security audits and monitoring" },
                      { icon: Database, text: "Secured cloud storage environments" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <item.icon className="h-5 w-5 text-emerald-600" />
                        <span className="text-sm font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-200">7</div>
                  <h3 className={`${playfair.className} text-2xl font-bold text-slate-900 mb-4`}>Data Retention</h3>
                  <p>We retain data only for as long as required for legal, regulatory, and operational purposes.</p>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-200">8</div>
                  <h3 className={`${playfair.className} text-2xl font-bold text-slate-900 mb-4`}>Your Rights</h3>
                  <ul className="list-none space-y-4 mt-4">
                    {[
                      "Request to view or update your personal data",
                      "Unsubscribe from any marketing or impact communications",
                      "Request deletion of your data (subject to legal retention requirements)"
                    ].map((item, i) => (
                      <li key={i} className="flex gap-4">
                        <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-200">9</div>
                  <h3 className={`${playfair.className} text-2xl font-bold text-slate-900 mb-4`}>Children’s Privacy</h3>
                  <p>We do not knowingly collect personal data from individuals under 13 years of age. If you are a parent or guardian, please contact us if you believe your child has provided us with personal information.</p>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-200">10</div>
                  <h3 className={`${playfair.className} text-2xl font-bold text-slate-900 mb-4`}>Updates to Privacy Policy</h3>
                  <p>We may revise this policy from time to time. Any changes will be published on this page with a revised effective date.</p>
                </div>
              </div>
            </div>

            {/* Footer of the card */}
            <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col items-center text-center">
              <div className="p-4 bg-slate-50 rounded-2xl mb-6">
                <ShieldAlert className="h-8 w-8 text-slate-400" />
              </div>
              <h4 className={`${playfair.className} text-xl font-bold text-slate-900 mb-2`}>Privacy concerns?</h4>
              <p className="text-slate-600">If you have any questions regarding your privacy, please contact the Jamiat Foundation team directly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
