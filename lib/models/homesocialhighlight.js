import mongoose from '../mongoose';

const cardSchema = new mongoose.Schema({
  image: { type: String, required: true },
  tag: { type: String, required: true },
  title: { type: String, required: true },
});

const HomeSocialHighlightSchema = new mongoose.Schema({
  title: { type: String, default: "Social Highlighting Work" },
  subtitle: { type: String, default: "Manage your social highlights and gallery items." },
  items: [cardSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.HomeSocialHighlight || mongoose.model("HomeSocialHighlight", HomeSocialHighlightSchema);
