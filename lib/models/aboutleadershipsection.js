import mongoose from '../mongoose';

const LeadershipMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  description: { type: String, required: true },
  initials: { type: String, required: true },
  color: { type: String, default: "blue" },
  icon: { type: String, default: "shield" }
});

const AboutLeadershipSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, default: "Leadership" },
    subtitle: {
      type: String,
      required: true,
      default: "Meet the dedicated individuals guiding our mission forward.",
    },
    members: [LeadershipMemberSchema],
  },
  {
    timestamps: true,
  }
);

const AboutLeadershipSection =
  mongoose.models.AboutLeadershipSection ||
  mongoose.model("AboutLeadershipSection", AboutLeadershipSectionSchema);

export default AboutLeadershipSection;
