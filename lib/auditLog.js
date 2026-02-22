import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    model: { type: String, required: true },
    operation: { type: String, enum: ["create", "update", "delete"], required: true },
    docId: { type: mongoose.Schema.Types.Mixed },
    query: { type: Object },
    update: { type: Object },
    document: { type: Object },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "audit_logs" }
);

const AuditLog =
  mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);

function shouldSkipSchema(schema) {
  return schema?.options?.collection === "audit_logs";
}

async function writeAudit(mongooseInstance, payload) {
  try {
    const Model =
      mongooseInstance.models.AuditLog ||
      mongooseInstance.model("AuditLog", AuditLogSchema);
    await Model.create(payload);
  } catch (err) {
    // Do not break primary operations if audit logging fails.
    console.error("Audit log write failed:", err?.message || err);
  }
}

export function auditLogPlugin(schema, pluginOptions = {}) {
  if (shouldSkipSchema(schema)) return;

  const modelName =
    pluginOptions.modelName || schema?.options?.collection || "Unknown";
  const mongooseInstance = pluginOptions.mongoose || mongoose;

  schema.pre("save", function (next) {
    this._auditWasNew = this.isNew;
    next();
  });

  schema.post("save", async function (doc) {
    const operation = this._auditWasNew ? "create" : "update";
    await writeAudit(mongooseInstance, {
      model: modelName,
      operation,
      docId: doc?._id,
      document: doc?.toObject?.({ depopulate: true }) || doc,
    });
  });

  function captureUpdate(next) {
    this._auditQuery =
      typeof this.getQuery === "function" ? this.getQuery() : { _id: this._id };
    this._auditUpdate =
      typeof this.getUpdate === "function" ? this.getUpdate() : undefined;
    next();
  }

  async function logUpdate() {
    await writeAudit(mongooseInstance, {
      model: modelName,
      operation: "update",
      query: this._auditQuery,
      update: this._auditUpdate,
    });
  }

  schema.pre("updateOne", captureUpdate);
  schema.post("updateOne", logUpdate);
  schema.pre("updateMany", captureUpdate);
  schema.post("updateMany", logUpdate);
  schema.pre("findOneAndUpdate", captureUpdate);
  schema.post("findOneAndUpdate", logUpdate);

  function captureDelete(next) {
    this._auditQuery =
      typeof this.getQuery === "function" ? this.getQuery() : { _id: this._id };
    next();
  }

  async function logDelete(doc) {
    await writeAudit(mongooseInstance, {
      model: modelName,
      operation: "delete",
      docId: doc?._id,
      query: this._auditQuery,
      document: doc?.toObject?.({ depopulate: true }) || doc,
    });
  }

  schema.pre("deleteOne", captureDelete);
  schema.post("deleteOne", logDelete);
  schema.pre("deleteMany", captureDelete);
  schema.post("deleteMany", logDelete);
  schema.pre("findOneAndDelete", captureDelete);
  schema.post("findOneAndDelete", logDelete);
  schema.pre("findOneAndRemove", captureDelete);
  schema.post("findOneAndRemove", logDelete);
}

const APPLIED_SYMBOL = Symbol.for("auditLogPluginApplied");

export function applyAuditLogPlugin(mongooseInstance) {
  if (!mongooseInstance?.modelNames) return;

  for (const name of mongooseInstance.modelNames()) {
    if (name === "AuditLog") continue;
    const model = mongooseInstance.model(name);
    const schema = model.schema;
    if (schema[APPLIED_SYMBOL]) continue;
    schema[APPLIED_SYMBOL] = true;
    schema.plugin(auditLogPlugin, { modelName: name, mongoose: mongooseInstance });
  }

  if (!mongooseInstance._auditLogGlobalPlugin) {
    mongooseInstance._auditLogGlobalPlugin = true;
    mongooseInstance.plugin(auditLogPlugin, { mongoose: mongooseInstance });
  }
}

export { AuditLog };
