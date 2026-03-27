import mongoose from '../mongoose';

const AboutFinancialSectionSchema = new mongoose.Schema(
  {
    tagline: { type: String, default: "Financial Transparency" },
    title: { type: String, required: true, default: "Your Trust is Our Amanah" },
    description: {
      type: String,
      required: true,
      default: "We believe in complete transparency. Every year, we publish detailed reports so you can see exactly how your contributions are making a difference. We maintain low administrative costs to maximize impact.",
    },
    button1: {
      label: { type: String, default: "2023 Annual Report" },
      pdfUrl: { type: String, default: "" },
    },
    button2: {
      label: { type: String, default: "View Past Reports" },
      pdfUrl: { type: String, default: "" },
    },
    totalRevenue: { type: String, default: "$2.4 Million" },
    programServices: { type: Number, default: 88 },
    fundraising: { type: Number, default: 8 },
    administration: { type: Number, default: 4 },
    footerText: {
      type: String,
      default: "Audited by independent third-party firms annually.",
    },
  },
  {
    timestamps: true,
  }
);

const AboutFinancialSection =
  mongoose.models.AboutFinancialSection ||
  mongoose.model("AboutFinancialSection", AboutFinancialSectionSchema);

export default AboutFinancialSection;
