"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const galleryImages = [
  {
    src: "/gallery/education.png",
    title: "Empowering Education",
    tag: "Education",
  },
  {
    src: "/gallery/healthcare.png",
    title: "Medical Relief",
    tag: "Healthcare",
  },
  {
    src: "/gallery/community.png",
    title: "Community Unity",
    tag: "Social Service",
  },
  {
    src: "/gallery/relief.png",
    title: "Disaster Support",
    tag: "Relief",
  },
  {
    src: "/gallery/empowerment.png",
    title: "Skill Development",
    tag: "Empowerment",
  },
  {
    src: "/gallery/food.png",
    title: "Food for Everyone",
    tag: "Food Drive",
  },
];

export default function SocialGallery() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <span className="text-emerald-700 font-bold tracking-widest uppercase text-sm">
              Impact Gallery
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`${playfair.className} text-4xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight`}
          >
            Social Highlighting Work
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            A glimpse into our ongoing efforts to uplift communities through education, healthcare, and humanitarian support across the nation.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative group overflow-hidden rounded-[2rem] shadow-xl aspect-[4/5] bg-slate-100"
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end transform transition-transform duration-500">
                <div className="overflow-hidden">
                  <motion.span 
                    className="inline-block px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full mb-3 uppercase tracking-wider"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {image.tag}
                  </motion.span>
                </div>
                <div className="overflow-hidden">
                  <motion.h3 
                    className="text-2xl font-bold text-white mb-2 leading-tight"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    {image.title}
                  </motion.h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
