const mongoose = require("mongoose");

const IslamicToolsSchema = new mongoose.Schema({
  zakatLink: { type: String, default: "" },
  hijriLink: { type: String, default: "" }
}, {
  timestamps: true,
});

module.exports = mongoose.models.IslamicTools || mongoose.model("IslamicTools", IslamicToolsSchema);
