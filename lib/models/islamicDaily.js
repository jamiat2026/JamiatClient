const mongoose = require("mongoose");

const IslamicDailySchema = new mongoose.Schema({
  dailyHadith: { type: String, default: "" },
  quranicVerse: { type: String, default: "" },
  dailyQuote: { type: String, default: "" }
}, {
  timestamps: true,
});

module.exports = mongoose.models.IslamicDaily || mongoose.model("IslamicDaily", IslamicDailySchema);
