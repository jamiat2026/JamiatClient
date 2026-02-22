import mongoose from "mongoose";
import { auditLogPlugin } from "./auditLog";

if (!mongoose._auditLogGlobalPlugin) {
  mongoose._auditLogGlobalPlugin = true;
  mongoose.plugin(auditLogPlugin, { mongoose });
}

export default mongoose;
