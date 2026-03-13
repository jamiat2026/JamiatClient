"use client";
import React from 'react';
import { Playfair_Display } from "next/font/google";
import { Heart, Activity, Image as ImageIcon, Info, Share2, AlertCircle } from "lucide-react";

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "700"],
});

const EmergencyDonation = () => {
    return (
        <div className="bg-white min-h-screen pb-24">
            {/* Hero / Header Section */}
            <section className="bg-[#ECFDF5] py-16 lg:py-32 flex flex-col items-center px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[60%] bg-emerald-100/50 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[60%] bg-emerald-50/50 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-4xl w-full text-center space-y-6">
                    <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 px-4 py-1.5 rounded-full shadow-sm mb-2">
                        <AlertCircle className="w-4 h-4 animate-pulse" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Urgent Appeal</span>
                    </div>
                    <h1 className={`${playfair.className} text-4xl md:text-6xl font-bold text-[#1a2e35] leading-tight tracking-tight px-2`}>
                        Emergency Relief Fund
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                        Help us provide immediate assistance, food, and medical supplies to those affected by the recent crisis. Your support can save lives today.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 relative z-20 mt-8 flex flex-col lg:flex-row gap-8">

                {/* Left Content Area */}
                <div className="flex-1 space-y-12">

                    {/* About the Event */}
                    <div className="bg-white p-8 lg:p-12 rounded-[32px] border border-gray-100 shadow-[0_15px_50px_-12px_rgba(0,0,0,0.08)]">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                <Info className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h2 className={`${playfair.className} text-3xl font-bold text-[#1a2e35]`}>About the Event</h2>
                        </div>
                        <div className="prose max-w-none text-gray-600 leading-relaxed text-lg">
                            <p className="mb-4">
                                In light of recent tragic events, thousands of families have been displaced and are in urgent need of basic necessities. This emergency donation drive is organized to gather immediate relief funds that will be deployed directly on the ground.
                            </p>
                            <p>
                                We are working closely with local partners to provide shelter, clean drinking water, hot meals, and medical attention. Time is critical, and every moment counts in preventing further loss of life and restoring hope.
                            </p>
                        </div>
                    </div>

                    {/* Photos & Videos */}
                    <div className="bg-white p-8 lg:p-12 rounded-[32px] border border-gray-100 shadow-[0_15px_50px_-12px_rgba(0,0,0,0.08)]">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h2 className={`${playfair.className} text-3xl font-bold text-[#1a2e35]`}>Photos & Videos</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-gray-200 rounded-2xl aspect-square w-full overflow-hidden relative group cursor-pointer bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593113565694-c6e09f5db184?q=80&w=600&auto=format&fit=crop')" }}>
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-white font-medium text-sm">Relief distribution center</p>
                                </div>
                            </div>
                            <div className="bg-gray-200 rounded-2xl aspect-square w-full overflow-hidden relative group cursor-pointer bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=600&auto=format&fit=crop')" }}>
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-white font-medium text-sm">Medical camp setup</p>
                                </div>
                            </div>
                            <div className="sm:col-span-2 bg-gray-200 rounded-2xl h-80 md:h-96 w-full overflow-hidden relative group cursor-pointer flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1200&auto=format&fit=crop')" }}>
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                                <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                                    <div className="w-0 h-0 border-y-8 border-y-transparent border-l-[16px] border-l-white ml-1"></div>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-10">
                                    <p className="text-white font-medium text-sm">Ground report video overview</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Live Updates */}
                    <div className="bg-[#F8FAFC] p-8 lg:p-12 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-100/40 rounded-full blur-[80px]" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                        <Activity className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <h2 className={`${playfair.className} text-3xl font-bold text-[#1a2e35]`}>Live Updates</h2>
                                </div>
                                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 tracking-wider uppercase">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Live
                                </span>
                            </div>

                            <div className="space-y-8 relative pl-6 border-l-2 border-emerald-100">
                                {/* Update Item 1 */}
                                <div className="relative">
                                    <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full border-4 border-white bg-emerald-500 shadow-sm"></div>
                                    <div className="bg-white p-6 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-50 hover:shadow-md transition-shadow">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                            <h3 className="font-bold text-gray-900 text-lg">Food Trucks Arrived</h3>
                                            <time className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit">10 mins ago</time>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">Two trucks carrying non-perishable food items have reached the southern camp. Distribution will start shortly. Thanks to our volunteers on the ground!</p>
                                    </div>
                                </div>
                                {/* Update Item 2 */}
                                <div className="relative">
                                    <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full border-4 border-white bg-gray-300 shadow-sm"></div>
                                    <div className="bg-white p-6 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-50 hover:shadow-md transition-shadow">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                            <h3 className="font-bold text-gray-900 text-lg">Initial Goal Met!</h3>
                                            <time className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-full w-fit">2 hours ago</time>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">Thanks to your incredible generosity, we've crossed our first milestone of ₹5,00,000! We are scaling up our medial camp setup.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Fundraising Amount */}
                <div className="lg:w-[400px] flex-shrink-0">
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-[0_15px_50px_-12px_rgba(0,0,0,0.08)]">
                        <div className="text-center mb-8">
                            <p className="text-emerald-700 font-bold text-xs tracking-[0.1em] uppercase mb-3">Fundraising Status</p>
                            <h3 className={`${playfair.className} text-5xl font-bold text-gray-900 mb-2`}>₹12,45,000</h3>
                            <p className="text-gray-500 text-sm font-medium">raised of ₹25,00,000 goal</p>
                        </div>

                        <div className="mb-8">
                            <div className="relative h-3 w-full overflow-hidden rounded-full bg-emerald-50 mb-3">
                                <div className="h-full bg-emerald-600 w-[50%] rounded-full relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-[#1a2e35]">50% Funded</span>
                                <span className="text-gray-500">1,240 Donors</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button className="w-full bg-emerald-600 text-white py-4 rounded-full font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                                <Heart className="w-5 h-5 fill-current" />
                                Donate Now
                            </button>
                            <button className="w-full bg-emerald-50 text-emerald-700 py-4 rounded-full font-bold hover:bg-emerald-100 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                                <Share2 className="w-5 h-5" />
                                Share Appeal
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Recent Donations</h4>
                            <div className="flex flex-col gap-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 text-gray-400 font-bold shadow-sm">
                                        <Heart className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900">Anonymous</p>
                                        <p className="text-xs text-gray-500 mt-0.5"><span className="text-emerald-600 font-bold">₹5,000</span> • 2 mins ago</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold shadow-sm">
                                        SM
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900">Sarah M.</p>
                                        <p className="text-xs text-gray-500 mt-0.5"><span className="text-emerald-600 font-bold">₹10,000</span> • 15 mins ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmergencyDonation;