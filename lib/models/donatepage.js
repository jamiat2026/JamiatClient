import mongoose from "../mongoose";

const DonatePageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Make Your Donation",
    },
    subtitle: {
      type: String,
      required: true,
      default:
        "Your generosity creates lasting change. Every rupee counts in building a better tomorrow.",
    },
    stats: {
      activeDonors: {
        label: { type: String, default: "Active Donors" },
        value: { type: String, default: "10K+" },
      },
      livesImpacted: {
        label: { type: String, default: "Lives Impacted" },
        value: { type: String, default: "25K+" },
      },
      statesReached: {
        label: { type: String, default: "States Reached" },
        value: { type: String, default: "14" },
      },
    },
    lastUpdatedBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const DonatePage =
  mongoose.models.DonatePage ||
  mongoose.model("DonatePage", DonatePageSchema);

export default DonatePage;
