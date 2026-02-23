// lib/models/footerSettings.js
import mongoose from '../mongoose';

const FooterSettingsSchema = new mongoose.Schema({
  orgName: String,

  quickLinks: [
    {
      label: String,
      path: String,
    },
  ],
  termsLinks: [
    {
      label: String,
      path: String,
    },
  ],
  volunteering: {
    heading: String,
    description: String,
    linkLabel: String,
    linkPath: String,
  },
  socialLinks: {
    facebook: String,
    instagram: String,
    linkedin: String,
    twitter: String,
  },
  contact: {
    email: {
      type: String,
      default: "info@jamiat.org.in",
    },
    phone: {
      type: String,
      default: "+91 9480389296",
    },
    address: {
      type: String,
      default: "Paramount Avenue, 63/1, 3rd floor,\nMosque road cross, Frazer town,\nBangalore 560005",
    },
  },
  copyrightText: {
    type: String,
    default: `All rights reserved - © ${new Date().getFullYear()}`
  },
}, { timestamps: true });

export default mongoose.models.FooterSettings || mongoose.model('FooterSettings', FooterSettingsSchema);
