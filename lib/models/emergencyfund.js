import mongoose from '../mongoose';

const EmergencyFundSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, default: "Emergency Relief Fund" },
    isActive: { type: Boolean, default: true },
    aboutContent: { type: String, default: "" }, // 1. About the event
    linkedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    
    // Legacy manual donation stats (can be kept for fallback)
    goalAmount: { type: Number, default: 2500000 },
    raisedAmount: { type: Number, default: 1245000 },
    donorsCount: { type: Number, default: 1240 },
    
    // 2. Photos and Videos
    media: [
      {
        type: { type: String, enum: ["image", "video"], default: "image" },
        url: { type: String },
      },
    ],

    // 3. Live Updates
    liveUpdates: [
      {
        title: { type: String },
        content: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],

    // Donation Card related (recent donations)
    recentDonations: [
      {
        name: { type: String },
        amount: { type: Number },
        timestamp: { type: Date, default: Date.now },
        isAnonymous: { type: Boolean, default: false },
      },
    ],

    // SEO
    metatitle: { type: String },
    metadescription: { type: String },
    og: {
      title: { type: String },
      description: { type: String },
      url: { type: String },
    },
    target_keywords: [{ type: String }],
    schemaMarkup: { type: Object, default: {} },
    lastUpdatedBy: { type: String, default: null },
  },
  { timestamps: true }
);

const EmergencyFund =
  mongoose.models.EmergencyFund ||
  mongoose.model("EmergencyFund", EmergencyFundSchema);

export default EmergencyFund;
