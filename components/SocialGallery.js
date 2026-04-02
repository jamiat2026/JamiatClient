"use client";

import { motion } from "framer-motion";
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

export default function SocialGallery({ data }) {
  const displayItems = data?.items || galleryImages;
  const sectionTitle = data?.title || "Social Highlighting Workss";



  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 px-4">

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`${playfair.className} text-3xl md:text-4xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight`}
          >
            {sectionTitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            {data?.subtitle}
          </motion.p>
        </div>
      </div>

      <div className="w-full relative overflow-hidden flex pb-8">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          className="flex flex-nowrap w-max"
        >
          {[...displayItems, ...displayItems].map((item, index) => (
            <div key={index} className="px-4 md:px-6">
              <motion.div
                whileHover={{ y: -10 }}
                className="relative group overflow-hidden rounded-[2rem] shadow-xl aspect-[4/5] bg-slate-100 w-[280px] md:w-[320px] lg:w-[350px] flex-shrink-0"
              >
                <img
                  src={item.image || item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end transform transition-transform duration-500">
                  <div className="overflow-hidden">
                    <span className="inline-block px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                      {item.tag}
                    </span>
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
