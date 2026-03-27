const mongoose = require("mongoose");

const IslamicKnowledgeHubSchema = new mongoose.Schema({
  qaTitle: { type: String, default: "Islamic Q&A" },
  qaSubtitle: { type: String, default: "FREQUENTLY ASKED" },
  qaItems: [{
    question: { type: String, default: "" },
    answer: { type: String, default: "" }
  }],
  button2Text: { type: String, default: "Watch Q&A" },
  button2Url: { type: String, default: "" },
  videoSectionTitle: { type: String, default: "Recent Bayans" },
  videoSectionSubtitle: { type: String, default: "LATEST VIDEOS" },
  videoTitle: { type: String, default: "" },
  videoSubtitle: { type: String, default: "" },
  videoUrl: { type: String, default: "" }
}, {
  timestamps: true,
});

module.exports = mongoose.models.IslamicKnowledgeHub || mongoose.model("IslamicKnowledgeHub", IslamicKnowledgeHubSchema);
