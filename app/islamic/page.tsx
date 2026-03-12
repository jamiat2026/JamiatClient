"use client";

import React from 'react';
import { Playfair_Display } from "next/font/google";
import { Calculator, Calendar, BookOpen, MessageCircle, Quote, HelpCircle, Youtube, Video, Play, MoonStar, ArrowRight, Users } from "lucide-react";

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "700"],
});

const Islamic = () => {
    return (
        <div className="bg-white">

            {/* Hero Section */}
            <section className="bg-[#ECFDF5] py-20 lg:py-32 flex flex-col items-center px-4 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[60%] bg-emerald-100/50 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[60%] bg-emerald-50/50 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-4xl w-full text-center space-y-6">
                    <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-emerald-100 mb-2 transition-transform hover:scale-105 cursor-default">
                        <MoonStar className="w-4 h-4 text-emerald-600 animate-pulse" />
                        <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-700">Islamic Resources</span>
                    </div>
                    <h1 className={`${playfair.className} text-4xl md:text-6xl font-bold text-[#1a2e35] leading-tight tracking-tight px-2`}>
                        Nurturing Faith & Knowledge
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                        Explore our comprehensive collection of Islamic tools, daily inspiration, and authentic knowledge designed to strengthen your spiritual journey.
                    </p>
                </div>
            </section>

            {/* Tools Section (Zakat Calculator & Hijri Calendar) - Overlapping Hero */}
            <section className="bg-white pb-24">
                <div className="max-w-5xl mx-auto w-full -mt-16 lg:-mt-24 relative z-20 px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Zakat Calculator Card */}
                        <div className="bg-[#00452E]/90 p-8 lg:p-10 rounded-[32px] group flex flex-col items-start h-full shadow-lg shadow-emerald-900/10 transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                                    <Calculator className="w-7 h-7 text-white" />
                                </div>
                                <h3 className={`${playfair.className} text-3xl font-bold text-white`}>Zakat Calculator</h3>
                            </div>

                            <p className="text-emerald-50 text-[17px] leading-relaxed mb-6 flex-grow">
                                Not sure how much you owe? Use our easy tool to calculate your obligation accurately.
                            </p>

                            <div className="bg-white/5 rounded-[24px] w-full p-6 mb-8 border border-white/10 backdrop-blur-sm">
                                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                    <span className="text-emerald-100 font-medium">Gold Nisab</span>
                                    <span className="font-bold text-white font-mono text-[17px]">87.48g</span>
                                </div>
                                <div className="flex justify-between items-center pt-4">
                                    <span className="text-emerald-100 font-medium">Silver Nisab</span>
                                    <span className="font-bold text-white font-mono text-[17px]">612.36g</span>
                                </div>
                            </div>

                            <button className="bg-white text-[#00452E] px-8 py-4 rounded-[16px] font-bold hover:bg-emerald-50 transition-all w-full active:scale-[0.98] shadow-sm text-[17px]">
                                Calculate My Zakat
                            </button>
                        </div>

                        {/* Hijri Calendar Card */}
                        <div className="bg-[#00452E]/90 p-8 lg:p-10 rounded-[32px] group flex flex-col items-start h-full shadow-lg shadow-emerald-900/10 transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                                    <Calendar className="w-7 h-7 text-white" />
                                </div>
                                <h3 className={`${playfair.className} text-3xl font-bold text-white`}>Hijri Calendar</h3>
                            </div>

                            <p className="text-emerald-50 text-[17px] leading-relaxed mb-6 flex-grow">
                                Stay updated with authentic Islamic dates, upcoming events, and religious observations.
                            </p>

                            <div className="bg-white/5 rounded-[24px] w-full p-6 mb-8 border border-white/10 backdrop-blur-sm">
                                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                    <span className="text-emerald-100 font-medium">Today's Date</span>
                                    <span className="font-bold text-white tracking-wider text-[17px]">14 Sha'ban 1447</span>
                                </div>
                                <div className="flex justify-between items-center pt-4">
                                    <span className="text-emerald-100 font-medium">Next Event</span>
                                    <span className="font-bold text-white text-[17px]">Ramadan</span>
                                </div>
                            </div>

                            <button className="bg-white text-[#00452E] px-8 py-4 rounded-[16px] font-bold hover:bg-emerald-50 transition-all w-full active:scale-[0.98] shadow-sm text-[17px]">
                                View Calendar
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Daily Inspiration Section */}
            <section className="px-4 py-24 lg:py-32 bg-white border-t border-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className={`${playfair.className} text-4xl lg:text-5xl font-bold text-[#1a2e35]`}>
                            Daily Inspiration
                        </h2>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
                            Reflect on the profound wisdom from the Quran, authentic Hadith, and Islamic quotes.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-12">
                        {/* Daily Quran */}
                        <div className="p-10 lg:p-12 rounded-[40px] border border-gray-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] relative group hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 hover:-translate-y-3 bg-[#ECFDF5]">
                            <Quote className="absolute top-10 right-10 size-10 text-[#A7F3D0] transition-colors duration-500" />

                            <div className="flex items-center gap-5 mb-10 relative z-10">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg bg-emerald-600 flex items-center justify-center text-white">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1a2e35] text-lg">Ayah of the Day</h4>
                                    <p className="text-emerald-600 text-[11px] font-extrabold tracking-[0.1em] uppercase mt-1">Surah Ash-Sharh (94:6)</p>
                                </div>
                            </div>
                            <p className={`${playfair.className} text-gray-600 leading-relaxed italic text-xl relative z-10 antialiased`}>
                                "Indeed, with hardship [will be] ease."
                            </p>
                        </div>

                        {/* Daily Hadees */}
                        <div className="p-10 lg:p-12 rounded-[40px] border border-gray-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] relative group hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 hover:-translate-y-3 bg-white">
                            <Quote className="absolute top-10 right-10 size-10 text-emerald-500 transition-colors duration-500" />

                            <div className="flex items-center gap-5 mb-10 relative z-10">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg bg-emerald-600 flex items-center justify-center text-white">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1a2e35] text-lg">Hadees of the Day</h4>
                                    <p className="text-emerald-600 text-[11px] font-extrabold tracking-[0.1em] uppercase mt-1">Sahih al-Bukhari</p>
                                </div>
                            </div>
                            <p className={`${playfair.className} text-gray-600 leading-relaxed italic text-xl relative z-10 antialiased`}>
                                "The best among you are those who have the best manners and character."
                            </p>
                        </div>

                        {/* Daily Quote */}
                        <div className="p-10 lg:p-12 rounded-[40px] border border-gray-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] relative group hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 hover:-translate-y-3 bg-[#ECFDF5]">
                            <Quote className="absolute top-10 right-10 size-10 text-[#A7F3D0] transition-colors duration-500" />

                            <div className="flex items-center gap-5 mb-10 relative z-10">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg bg-emerald-600 flex items-center justify-center text-white">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1a2e35] text-lg">Islamic Quote</h4>
                                    <p className="text-emerald-600 text-[11px] font-extrabold tracking-[0.1em] uppercase mt-1">Islamic Wisdom</p>
                                </div>
                            </div>
                            <p className={`${playfair.className} text-gray-600 leading-relaxed italic text-xl relative z-10 antialiased`}>
                                "Patience is not the ability to wait, but the ability to keep a good attitude while waiting."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Knowledge Hub (QnA & Bayans) */}
            <section className="px-4 py-24 lg:py-32 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className={`${playfair.className} text-4xl lg:text-5xl font-bold text-[#1a2e35]`}>
                            Knowledge Hub
                        </h2>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
                            Find answers to your questions, watch recent Bayans, and discover authentic Islamic knowledge.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* QnA Section */}
                        <div className="bg-white rounded-[48px] p-8 lg:p-16 border border-gray-100 shadow-[0_15px_50px_-12px_rgba(0,0,0,0.08)] flex flex-col h-full hover:-translate-y-2 transition-transform duration-500">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="bg-emerald-50 w-20 h-20 rounded-[28px] shadow-sm flex items-center justify-center flex-shrink-0 border border-emerald-100">
                                    <HelpCircle className="h-10 w-10 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className={`${playfair.className} text-3xl font-bold text-[#1a2e35]`}>Islamic Q&A</h3>
                                    <p className="text-emerald-600 font-bold text-sm tracking-wider uppercase mt-1">Frequently Asked</p>
                                </div>
                            </div>
                            <div className="space-y-4 mb-10 flex-grow pt-4 border-t border-gray-100">
                                {[
                                    "What are the conditions for Zakat to be obligatory?",
                                    "How to perform Salatul Tasbeeh?",
                                    "What is the ruling on fasting while traveling?",
                                ].map((question, i) => (
                                    <div key={i} className="flex gap-4 p-5 bg-gray-50 rounded-3xl hover:bg-emerald-50 transition-colors cursor-pointer group border border-gray-100">
                                        <HelpCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                                        <span className="text-gray-700 font-medium group-hover:text-emerald-800 transition-colors">{question}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="flex-1 bg-emerald-600 text-white px-6 py-4 rounded-full font-bold hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 transition-all text-center">
                                    Ask a Question
                                </button>
                                <button className="flex-1 border-2 border-emerald-600 text-emerald-600 px-6 py-4 rounded-full font-bold hover:bg-emerald-50 transition-all flex items-center justify-center gap-2">
                                    <Youtube className="w-5 h-5 text-red-500" /> Watch Q&A
                                </button>
                            </div>
                        </div>

                        {/* Recent Bayan Section */}
                        <div className="bg-white rounded-[48px] p-8 lg:p-16 border border-gray-100 shadow-[0_15px_50px_-12px_rgba(0,0,0,0.08)] flex flex-col h-full hover:-translate-y-2 transition-transform duration-500">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="bg-emerald-50 w-20 h-20 rounded-[28px] shadow-sm flex items-center justify-center flex-shrink-0 border border-emerald-100">
                                    <Video className="h-10 w-10 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className={`${playfair.className} text-3xl font-bold text-[#1a2e35]`}>Recent Bayans</h3>
                                    <p className="text-emerald-600 font-bold text-sm tracking-wider uppercase mt-1">Latest Videos</p>
                                </div>
                            </div>

                            <div className="relative rounded-[32px] overflow-hidden mb-8 aspect-video bg-gray-800 group cursor-pointer shadow-lg">
                                <img src="https://images.unsplash.com/photo-1579705745131-c100e00a4982?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Bayan Thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-emerald-600/90 rounded-full flex items-center justify-center backdrop-blur-md group-hover:bg-emerald-500 transition-colors shadow-2xl">
                                        <Play className="w-6 h-6 lg:w-8 lg:h-8 text-white ml-1 lg:ml-2" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <h4 className="font-bold text-[#1a2e35] text-xl mb-3">Importance of Sabr in Islam</h4>
                                <p className="text-gray-500 text-base mb-8 flex-grow leading-relaxed">A profound reminder on maintaining patience during difficult times and seeking Allah's help in our daily lives.</p>

                                <button className="w-full inline-flex items-center justify-center gap-2 text-emerald-700 font-bold hover:gap-4 transition-all">
                                    View All Bayans <ArrowRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Islamic;