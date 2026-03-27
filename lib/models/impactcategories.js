import mongoose from '../mongoose';

const StatSchema = new mongoose.Schema({
  label: String,
  value: String,
  progress: Number,
});

const CategorySchema = new mongoose.Schema({
  key: String,
  title: String,
  subtitle: String,
  color: String,
  description: String,
  link: String,
  icon: String,
  stats: [StatSchema],
});

const ImpactCategoriesDocSchema = new mongoose.Schema({
  section: {
    title: String,
    subtitle: String,
  },
  categories: [CategorySchema],
});

// Delete cached model so schema changes are picked up during HMR
if (mongoose.models.ImpactCategoriesDoc) {
  delete mongoose.models.ImpactCategoriesDoc;
}

export default mongoose.model("ImpactCategoriesDoc", ImpactCategoriesDocSchema);
