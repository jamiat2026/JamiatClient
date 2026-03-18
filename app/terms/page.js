"use client";

import { Playfair_Display } from "next/font/google";
import Link from "next/link";
import { ChevronRight, ShieldCheck, FileText, Info, Scale } from "lucide-react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

export default function TermsPage() {
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
            <span className="text-emerald-700">Terms & Conditions</span>
          </nav>
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
            <FileText className="h-3.5 w-3.5" />
            Legal Agreement
          </div>
          
          <h1 className={`${playfair.className} text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6`}>
            Terms & <span className="text-emerald-600">Conditions</span>
          </h1>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using our platform. These terms outline our mutual expectations and responsibilities.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-24 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[2.5rem] p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 mb-12 pb-8 border-b border-slate-100">
              <div className="flex-1">
                <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">Organization</p>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <p className="text-lg font-bold text-slate-800">Jamiat Foundation</p>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">Website</p>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <Info className="h-5 w-5 text-slate-600" />
                  </div>
                  <a href="https://www.jamiat.org.in" className="text-lg font-bold text-slate-800 hover:text-emerald-600 transition-colors underline decoration-emerald-200 decoration-2 underline-offset-4" target="_blank" rel="noopener noreferrer">www.jamiat.org.in</a>
                </div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none text-justify leading-relaxed text-slate-600">
              <p className="text-lg mb-10 text-slate-700 italic border-l-4 border-emerald-500 pl-6 py-2 bg-emerald-50/30 rounded-r-2xl">
                Welcome to Jamiat Foundation. By accessing our website or using our services, you agree to comply with the following Terms & Conditions. Please read them carefully before making donations or using our platform.
              </p>

              <div className="space-y-12">
                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-200">1</div>
                  <h3 className={`${playfair.className} text-2xl font-bold text-slate-900 mb-4`}>About Jamiat Foundation</h3>
                  <p>Jamiat Foundation is a registered not-for-profit organization based in India. We work for the social, educational, and economic empowerment of marginalized, backward, and minority communities across India, without discrimination.</p>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-200">2</div>
                  <h3 className={`${playfair.className} text-2xl font-bold text-slate-900 mb-4`}>Purpose</h3>
                  <p>This platform is designed to enable users to donate, engage, and stay informed about our programs. We aim to create systemic change through education, healthcare, financial inclusion, and social justice initiatives.</p>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-200">3</div>
                  <h3 className={`${playfair.className} text-2xl font-bold text-slate-900 mb-4`}>Donations</h3>
                  <ul className="list-none space-y-4 mt-4">
                    {[
                      "We accept both general charity (Sadaqah) and Zakat donations. Zakat funds are used strictly in accordance with Islamic principles.",
                      "Donations are voluntary and non-refundable, unless a proven technical error occurs.",
                      "We accept one-time and recurring (monthly/yearly) contributions.",
                      "Donors are required to submit PAN card details in compliance with Indian tax laws.",
                      "A reasonable portion of donations is allocated to operational and administrative expenses (staff, tech, outreach, compliance), as standard for non-profit operations.",
                      "Receipts are issued for all donations and can be used for personal records or tax compliance as applicable."
                    ].map((item, i) => (
                      <li key={i} className="flex gap-4">
                        <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-200">4</div>
                  <h3 className={`${playfair.className} text-2xl font-bold text-slate-900 mb-4`}>Use of Website</h3>
                  <ul className="list-none space-y-4 mt-4">
                    {[
                      "You agree to use the website only for lawful and ethical purposes.",
                      "All content (text, images, design, logos, etc.) is the property of Jamiat Foundation and may not be copied or redistributed without written consent.",
                      "Impersonation, fraud, misuse of donation systems, or spreading misinformation will lead to account suspension and possible legal action."
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
                  <h3 className={`${playfair.className} text-2xl font-bold text-slate-900 mb-4`}>Transparency and Reporting</h3>
                  <p>We maintain transparency through regular updates, impact reports, and financial disclosures available to donors via email or on the website.</p>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-200">6</div>
                  <h3 className={`${playfair.className} text-2xl font-bold text-slate-900 mb-4`}>Third-Party Services</h3>
                  <p>We may use third-party tools or platforms (for forms, payments, analytics). While we choose secure and reputable vendors, we are not responsible for their privacy practices or terms.</p>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-200">7</div>
                  <h3 className={`${playfair.className} text-2xl font-bold text-slate-900 mb-4`}>Updates to Terms</h3>
                  <p>Jamiat Foundation reserves the right to update these Terms & Conditions at any time. Any changes will be published on this page with a revised effective date.</p>
                </div>
              </div>
            </div>

            {/* Footer of the card */}
            <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col items-center text-center">
              <div className="p-4 bg-slate-50 rounded-2xl mb-6">
                <Scale className="h-8 w-8 text-slate-400" />
              </div>
              <h4 className={`${playfair.className} text-xl font-bold text-slate-900 mb-2`}>Questions about our terms?</h4>
              <p className="text-slate-600">If you have any questions regarding these Terms & Conditions, please contact the Jamiat Foundation team directly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
