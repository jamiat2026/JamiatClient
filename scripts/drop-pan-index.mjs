import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { dbConnect } from "../lib/dbConnect.js";

function loadEnvIfPresent() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;

  const contents = fs.readFileSync(envPath, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

async function main() {
  loadEnvIfPresent();

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is missing. Add it to .env or export it before running this script.");
    process.exit(1);
  }

  await dbConnect();

  const collection = mongoose.connection.collection("donors");
  const indexes = await collection.indexes();
  const indexNames = indexes.map((i) => i.name);

  if (!indexNames.includes("pancardNumber_1")) {
    console.log("Index pancardNumber_1 not found. Nothing to drop.");
    await mongoose.disconnect();
    return;
  }

  await collection.dropIndex("pancardNumber_1");
  console.log("Dropped index pancardNumber_1 successfully.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Failed to drop index:", err);
  mongoose.disconnect().catch(() => {});
  process.exit(1);
});
