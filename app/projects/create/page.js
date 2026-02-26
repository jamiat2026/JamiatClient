"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save, Plus, X, Pencil, Image as ImageIcon, Upload, Globe, Tag, Clock, TrendingUp, Users, FileText, Settings, Video, UserCircle } from "lucide-react";
import { IoIosCloseCircle } from "react-icons/io";
import { AiOutlineEdit } from "react-icons/ai";

import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

const Input = ({ className, ...props }) => (
  <input
    className={`border border-gray-200 px-4 py-2.5 rounded-xl text-sm w-full bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none ${className || ""}`}
    {...props}
  />
);

const Select = ({ className, children, ...props }) => (
  <select
    className={`border border-gray-200 px-4 py-2.5 rounded-xl text-sm w-full bg-white text-gray-700 appearance-none cursor-pointer outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all ${className || ""}`}
    {...props}
  >
    {children}
  </select>
);

const Textarea = ({ className, ...props }) => (
  <textarea
    className={`border border-gray-200 px-4 py-2.5 rounded-xl text-sm w-full bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none resize-none ${className || ""}`}
    {...props}
  />
);

const SectionCard = ({ title, subtitle, icon: Icon, children }) => (
  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
      {Icon && (
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-100 text-emerald-600">
          <Icon size={16} />
        </div>
      )}
      <div>
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
    <div className="p-6 space-y-4">{children}</div>
  </div>
);

const FieldLabel = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
    {children}
  </label>
);

const ChipTag = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 py-1 pl-3 pr-2 rounded-full text-xs font-medium text-emerald-700">
    {label}
    <button
      type="button"
      className="cursor-pointer hover:text-red-500 transition-colors"
      onClick={onRemove}
    >
      <X size={14} />
    </button>
  </span>
);

export default function CreateProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: {},
    category: [],
    location: "",
    totalRequired: "",
    collected: 0,
    beneficiaries: "",
    completion: "",
    daysLeft: "",
    status: "Active",
    mainImage: "",
    cardImage: "",
    photoGallery: [],
    youtubeIframe: "",
    overview: "",
    zakat_eligible: false,
    interest_earnings_eligible: false,
    projectManager: {
      name: "",
      email: "",
      phone: "",
    },
    donationOptions: [
      { type: "General Donation", isEnabled: false },
      { type: "Zakat", isEnabled: false },
      { type: "Sadqa", isEnabled: false },
      { type: "Interest Earnings", isEnabled: false },
    ],
    minDonationAmount: 365,
    donationFrequency: "One Time",
    og: {
      title: "",
      description: "",
      image: "",
      url: "",
    },
    impact: [],
    timeline: [],
    scheme: [],
    updates: [],
    slug: "",
    target_keywords: [],
    metatitle: "",
    metadescription: "",
  });

  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingCard, setUploadingCard] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingOgImage, setUploadingOgImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [cardPreview, setCardPreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [ogImagePreview, setOgImagePreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [newImpact, setNewImpact] = useState({
    type: "Direct",
    title: "",
    description: "",
  });
  const [newTimelineEvent, setNewTimelineEvent] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    status: "Pending",
  });
  const [newScheme, setNewScheme] = useState(
    `{ name: "", description: "", link: "" }`
  );
  const [newUpdate, setNewUpdate] = useState({
    version: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [newKeyword, setNewKeyword] = useState("");

  const [editingImpactIndex, setEditingImpactIndex] = useState(null);
  const [editingTimelineEventIndex, setEditingTimelineEventIndex] =
    useState(null);
  const [editingUpdateIndex, setEditingUpdateIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("projectManager.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        projectManager: { ...prev.projectManager, [field]: value },
      }));
    } else if (name.startsWith("og.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        og: { ...prev.og, [field]: value },
      }));
    } else if (name.startsWith("donationOptions.")) {
      const index = parseInt(name.split(".")[1]);
      const updated = [...form.donationOptions];
      updated[index].isEnabled = checked;
      setForm((prev) => ({
        ...prev,
        donationOptions: updated,
      }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e, type) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (type === "main") setUploadingMain(true);
    if (type === "gallery") setUploadingGallery(true);
    if (type === "ogImage") setUploadingOgImage(true);
    if (type === "card") setUploadingCard(true);

    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.url;
    });

    const urls = await Promise.all(uploadPromises);

    if (type === "gallery") {
      setForm((prev) => ({
        ...prev,
        photoGallery: [...prev.photoGallery, ...urls],
      }));
      setGalleryPreviews((prev) => [...prev, ...urls]);
      setUploadingGallery(false);
    } else if (type === "main") {
      setForm((prev) => ({ ...prev, mainImage: urls[0] }));
      setImagePreview(urls[0]);
      setUploadingMain(false);
    } else if (type === "ogImage") {
      setForm((prev) => ({
        ...prev,
        og: { ...prev.og, image: urls[0] },
      }));
      setOgImagePreview(urls[0]);
      setUploadingOgImage(false);
    } else if (type === "card") {
      setForm((prev) => ({ ...prev, cardImage: urls[0] }));
      setCardPreview(urls[0]);
      setUploadingCard(false);
    }
  };

  const handleAddImpact = () => {
    if (newImpact.title && newImpact.description) {
      setForm((prev) => ({
        ...prev,
        impact: [...prev.impact, newImpact],
      }));
      setNewImpact({ type: "Direct", title: "", description: "" });
    }
  };

  const handleEditImpact = (idx) => {
    setEditingImpactIndex(idx);
    setNewImpact(form.impact[idx]);
  };

  const handleSaveImpact = () => {
    if (editingImpactIndex !== null) {
      const updated = [...form.impact];
      updated[editingImpactIndex] = newImpact;
      setForm((prev) => ({ ...prev, impact: updated }));
      setEditingImpactIndex(null);
      setNewImpact({ type: "Direct", title: "", description: "" });
    }
  };

  const handleCancelImpactEdit = () => {
    setEditingImpactIndex(null);
    setNewImpact({ type: "Direct", title: "", description: "" });
  };

  const handleAddTimelineEvent = () => {
    if (
      newTimelineEvent.title &&
      newTimelineEvent.date &&
      newTimelineEvent.status
    ) {
      setForm((prev) => ({
        ...prev,
        timeline: [...prev.timeline, newTimelineEvent],
      }));
      setNewTimelineEvent({
        title: "",
        date: new Date().toISOString().split("T")[0],
        status: "Pending",
      });
    }
  };

  const handleEditTimelineEvent = (idx) => {
    setEditingTimelineEventIndex(idx);
    setNewTimelineEvent(form.timeline[idx]);
  };

  const handleSaveTimelineEvent = () => {
    if (editingTimelineEventIndex !== null) {
      const updated = [...form.timeline];
      updated[editingTimelineEventIndex] = newTimelineEvent;
      setForm((prev) => ({ ...prev, timeline: updated }));
      setEditingTimelineEventIndex(null);
      setNewTimelineEvent({
        title: "",
        date: new Date().toISOString().split("T")[0],
        status: "Pending",
      });
    }
  };

  const handleCancelTimelineEventEdit = () => {
    setEditingTimelineEventIndex(null);
    setNewTimelineEvent({
      title: "",
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
    });
  };

  const handleAddUpdate = () => {
    if (newUpdate.version && newUpdate.content) {
      setForm((prev) => ({
        ...prev,
        updates: [...prev.updates, newUpdate],
      }));
      setNewUpdate({
        version: "",
        content: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  };

  const handleEditUpdate = (idx) => {
    setEditingUpdateIndex(idx);
    setNewUpdate(form.updates[idx]);
  };

  const handleSaveUpdate = () => {
    if (editingUpdateIndex !== null) {
      const updated = [...form.updates];
      updated[editingUpdateIndex] = newUpdate;
      setForm((prev) => ({ ...prev, updates: updated }));
      setEditingUpdateIndex(null);
      setNewUpdate({
        version: "",
        content: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  };

  const handleCancelUpdateEdit = () => {
    setEditingUpdateIndex(null);
    setNewUpdate({
      version: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleAddScheme = () => {
    if (newScheme.name) {
      setForm((prev) => ({
        ...prev,
        scheme: [...prev.scheme, newScheme],
      }));
      setNewScheme({ name: "", description: "", link: "" });
    }
  };

  const handleAddKeyword = () => {
    if (newKeyword) {
      setForm((prev) => ({
        ...prev,
        target_keywords: [...prev.target_keywords, newKeyword],
      }));
      setNewKeyword("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleAddScheme();
    setSubmitting(true);
    const res = await fetch("/api/projects", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });
    setSubmitting(false);

    if (res.ok) {
      router.push("/projects");
    } else {
      alert("Error creating project");
    }
  };

  async function fetchCategories() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const statusBadge = (status) => {
    const styles = {
      Completed: "bg-green-100 text-green-700",
      "In-Progress": "bg-amber-100 text-amber-700",
      Pending: "bg-gray-100 text-gray-600",
      Direct: "bg-green-100 text-green-700",
      Indirect: "bg-amber-100 text-amber-700",
      "Long-term": "bg-emerald-100 text-emerald-700",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-600"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-full w-full bg-gray-50/50 p-4 sm:p-8 rounded-3xl border border-gray-200/60 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/projects")}
            className="flex items-center justify-center h-10 w-10 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create New Project</h1>
            <p className="text-sm text-gray-500">Fill in the details to create a new project.</p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="flex flex-row text-sm sm:text-base gap-2 items-center font-semibold bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 cursor-pointer text-white transition-all duration-200 rounded-xl shadow-sm hover:shadow-md active:scale-95"
          disabled={submitting}
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
          Save Project
        </button>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Basic Information */}
          <SectionCard title="Basic Information" subtitle="Project title, description, and core details" icon={FileText}>
            <div>
              <FieldLabel>Title</FieldLabel>
              <Input
                name="title"
                placeholder="Enter project title"
                onChange={handleChange}
              />
            </div>
            <div>
              <FieldLabel>Description</FieldLabel>
              <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <ReactQuill
                  value={form.description || ""}
                  onChange={(val) =>
                    handleChange({ target: { name: "description", value: val } })
                  }
                  className="[&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-200 [&_.ql-toolbar]:bg-gray-50/50 [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[120px]"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                />
              </div>
            </div>
            <div>
              <FieldLabel>Category</FieldLabel>
              <Select
                name="category"
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map(
                    (opt) => opt.value
                  );
                  setForm((prev) => ({
                    ...prev,
                    category: Array.from(
                      new Set([...prev.category, ...selected])
                    ),
                  }));
                }}
              >
                <option value={""} disabled>
                  Choose category
                </option>
                {categories.map((cat, idx) => (
                  <option value={cat.name} key={idx}>
                    {cat.name}
                  </option>
                ))}
              </Select>
              {form.category.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.category.map((cat) => (
                    <ChipTag
                      key={cat}
                      label={cat}
                      onRemove={() =>
                        setForm((prev) => ({
                          ...prev,
                          category: prev.category.filter((c) => c !== cat),
                        }))
                      }
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Location</FieldLabel>
                <Input
                  name="location"
                  placeholder="Enter location"
                  onChange={handleChange}
                />
              </div>
              <div>
                <FieldLabel>Status</FieldLabel>
                <Select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Draft">Draft</option>
                </Select>
              </div>
            </div>
            <div>
              <FieldLabel>Slug</FieldLabel>
              <Input
                name="slug"
                placeholder="enter-project-slug"
                onChange={handleChange}
              />
            </div>
          </SectionCard>

          {/* Financials & Progress */}
          <SectionCard title="Financials & Progress" subtitle="Budget, beneficiaries, and completion tracking" icon={TrendingUp}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Total Required (₹)</FieldLabel>
                <Input
                  name="totalRequired"
                  type="number"
                  min="0"
                  placeholder="0"
                  onChange={handleChange}
                />
              </div>
              <div>
                <FieldLabel>Collected (₹)</FieldLabel>
                <Input
                  name="collected"
                  type="number"
                  min="0"
                  placeholder="0"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <FieldLabel>Beneficiaries</FieldLabel>
                <Input
                  name="beneficiaries"
                  min="0"
                  type="number"
                  placeholder="0"
                  onChange={handleChange}
                />
              </div>
              <div>
                <FieldLabel>Completion %</FieldLabel>
                <Input
                  name="completion"
                  type="number"
                  min="0"
                  placeholder="0"
                  onChange={handleChange}
                />
              </div>
              <div>
                <FieldLabel>Days Left</FieldLabel>
                <Input
                  name="daysLeft"
                  type="number"
                  min="0"
                  placeholder="0"
                  onChange={handleChange}
                />
              </div>
            </div>
          </SectionCard>

          {/* Media Section */}
          <SectionCard title="Media" subtitle="Upload images and embed videos" icon={ImageIcon}>
            <div className="space-y-4">
              {/* Main Image */}
              <div>
                <FieldLabel>Main Image (1440 × 750)</FieldLabel>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => document.getElementById("mainImageInput").click()}
                    className="cursor-pointer flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                  >
                    {uploadingMain ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      <Upload size={16} />
                    )}
                    Upload Main Image
                  </button>
                  <input
                    id="mainImageInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "main")}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                    />
                  )}
                </div>
              </div>

              {/* Card Image */}
              <div>
                <FieldLabel>Card Image (1440 × 750)</FieldLabel>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => document.getElementById("cardImageInput").click()}
                    className="cursor-pointer flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                  >
                    {uploadingCard ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      <Upload size={16} />
                    )}
                    Upload Card Image
                  </button>
                  <input
                    id="cardImageInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "card")}
                  />
                  {cardPreview && (
                    <img
                      src={cardPreview}
                      className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                    />
                  )}
                </div>
              </div>

              {/* Gallery */}
              <div>
                <FieldLabel>Photo Gallery (450 × 350)</FieldLabel>
                <button
                  type="button"
                  onClick={() => document.getElementById("galleryInput").click()}
                  className="cursor-pointer flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                >
                  {uploadingGallery ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <Upload size={16} />
                  )}
                  Upload Gallery Images
                </button>
                <input
                  id="galleryInput"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, "gallery")}
                />
                {galleryPreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {galleryPreviews.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* YouTube */}
              <div>
                <FieldLabel>YouTube Embed</FieldLabel>
                <Input
                  name="youtubeIframe"
                  placeholder="Paste YouTube iframe embed code"
                  onChange={handleChange}
                />
              </div>
            </div>
          </SectionCard>

          {/* SEO & Meta */}
          <SectionCard title="SEO & Meta" subtitle="Search engine optimization settings" icon={Globe}>
            <div>
              <FieldLabel>Meta Title</FieldLabel>
              <Input
                name="metatitle"
                placeholder="Enter meta title"
                onChange={handleChange}
              />
            </div>
            <div>
              <FieldLabel>Meta Description</FieldLabel>
              <Textarea
                name="metadescription"
                placeholder="Enter meta description"
                onChange={handleChange}
                rows={3}
              />
            </div>
            <div>
              <FieldLabel>Target Keywords</FieldLabel>
              <div className="flex gap-2">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Enter keyword"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddKeyword())}
                />
                <button
                  type="button"
                  onClick={handleAddKeyword}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <Plus size={16} />
                </button>
              </div>
              {form.target_keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.target_keywords.map((keyword, idx) => (
                    <ChipTag
                      key={idx}
                      label={keyword}
                      onRemove={() =>
                        setForm((prev) => ({
                          ...prev,
                          target_keywords: prev.target_keywords.filter(
                            (k) => k !== keyword
                          ),
                        }))
                      }
                    />
                  ))}
                </div>
              )}
            </div>
            <div>
              <FieldLabel>Schema Markup (JSON-LD)</FieldLabel>
              <Textarea
                placeholder='{"name": "Name", "description": "Description", "link": "https://"}'
                value={newScheme}
                onChange={(e) => setNewScheme(e.target.value)}
                rows={4}
                className="font-mono text-xs"
              />
              <div className="mt-2 p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono text-gray-600 break-all">
                {newScheme}
              </div>
            </div>
          </SectionCard>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Project Manager */}
          <SectionCard title="Project Manager" subtitle="Contact details for the project lead" icon={UserCircle}>
            <div>
              <FieldLabel>Name</FieldLabel>
              <Input
                name="projectManager.name"
                placeholder="Manager name"
                onChange={handleChange}
              />
            </div>
            <div>
              <FieldLabel>Email</FieldLabel>
              <Input
                name="projectManager.email"
                placeholder="Manager email"
                onChange={handleChange}
              />
            </div>
            <div>
              <FieldLabel>Phone</FieldLabel>
              <Input
                name="projectManager.phone"
                placeholder="Manager phone"
                onChange={handleChange}
              />
            </div>
          </SectionCard>

          {/* OG Metadata */}
          <SectionCard title="Open Graph Metadata" subtitle="Social media sharing preview" icon={Globe}>
            <div>
              <FieldLabel>OG Title</FieldLabel>
              <Input
                name="og.title"
                placeholder="OG Title"
                onChange={handleChange}
              />
            </div>
            <div>
              <FieldLabel>OG Description</FieldLabel>
              <Textarea
                name="og.description"
                placeholder="OG Description"
                onChange={handleChange}
                rows={3}
              />
            </div>
            <div>
              <FieldLabel>OG Image</FieldLabel>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => document.getElementById("ogImageInput").click()}
                  className="cursor-pointer flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                >
                  {uploadingOgImage ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <Upload size={16} />
                  )}
                  Upload OG Image
                </button>
                <input
                  id="ogImageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, "ogImage")}
                />
                {ogImagePreview && (
                  <img
                    src={ogImagePreview}
                    className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                  />
                )}
              </div>
            </div>
            <div>
              <FieldLabel>OG URL</FieldLabel>
              <Input
                name="og.url"
                placeholder="https://example.com/project"
                onChange={handleChange}
              />
            </div>
          </SectionCard>

          {/* Impact */}
          <SectionCard title="Impact" subtitle="Define the project's direct and indirect impact" icon={TrendingUp}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Type</FieldLabel>
                <Select
                  value={newImpact.type}
                  onChange={(e) =>
                    setNewImpact((prev) => ({ ...prev, type: e.target.value }))
                  }
                >
                  <option value="Direct">Direct</option>
                  <option value="Indirect">Indirect</option>
                  <option value="Long-term">Long-term</option>
                </Select>
              </div>
              <div>
                <FieldLabel>Title</FieldLabel>
                <Input
                  value={newImpact.title}
                  onChange={(e) =>
                    setNewImpact((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Impact Title"
                />
              </div>
            </div>
            <div>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                value={newImpact.description}
                onChange={(e) =>
                  setNewImpact((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Impact Description"
                rows={2}
              />
            </div>
            <button
              type="button"
              onClick={handleAddImpact}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-all active:scale-95 cursor-pointer"
            >
              <Plus size={16} /> Add Impact
            </button>

            {form.impact.length > 0 && (
              <div className="space-y-2 mt-2">
                {form.impact.map((imp, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 p-4 rounded-xl"
                  >
                    {editingImpactIndex === idx ? (
                      <div className="space-y-3">
                        <Select
                          value={newImpact.type}
                          onChange={(e) =>
                            setNewImpact({ ...newImpact, type: e.target.value })
                          }
                        >
                          <option value="Direct">Direct</option>
                          <option value="Indirect">Indirect</option>
                          <option value="Long-term">Long-term</option>
                        </Select>
                        <Input
                          value={newImpact.title}
                          onChange={(e) =>
                            setNewImpact({ ...newImpact, title: e.target.value })
                          }
                        />
                        <Textarea
                          value={newImpact.description}
                          onChange={(e) =>
                            setNewImpact({
                              ...newImpact,
                              description: e.target.value,
                            })
                          }
                          rows={2}
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={handleCancelImpactEdit}
                            className="px-3 py-1.5 text-sm font-medium cursor-pointer border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveImpact}
                            className="px-3 py-1.5 text-sm font-medium cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {statusBadge(imp.type)}
                          </div>
                          <p className="font-semibold text-sm text-gray-900">{imp.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{imp.description}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => handleEditImpact(idx)}
                            className="text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg p-1.5 cursor-pointer transition-all"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                impact: prev.impact.filter((_, i) => i !== idx),
                              }))
                            }
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-1.5 cursor-pointer transition-all"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Timeline */}
          <SectionCard title="Timeline Events" subtitle="Track project milestones and progress" icon={Clock}>
            <div>
              <FieldLabel>Event Title</FieldLabel>
              <Input
                value={newTimelineEvent.title}
                onChange={(e) =>
                  setNewTimelineEvent((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Event Title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Status</FieldLabel>
                <Select
                  value={newTimelineEvent.status}
                  onChange={(e) =>
                    setNewTimelineEvent((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="In-Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </Select>
              </div>
              <div>
                <FieldLabel>Date</FieldLabel>
                <Input
                  value={newTimelineEvent.date}
                  onChange={(e) =>
                    setNewTimelineEvent((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  type="date"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddTimelineEvent}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-all active:scale-95 cursor-pointer"
            >
              <Plus size={16} /> Add Event
            </button>

            {form.timeline.length > 0 && (
              <div className="space-y-2 mt-2">
                {form.timeline.map((event, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 p-4 rounded-xl"
                  >
                    {editingTimelineEventIndex === idx ? (
                      <div className="space-y-3">
                        <Select
                          value={newTimelineEvent.status}
                          onChange={(e) =>
                            setNewTimelineEvent({
                              ...newTimelineEvent,
                              status: e.target.value,
                            })
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="In-Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </Select>
                        <Input
                          value={newTimelineEvent.title}
                          onChange={(e) =>
                            setNewTimelineEvent({
                              ...newTimelineEvent,
                              title: e.target.value,
                            })
                          }
                        />
                        <Input
                          type="date"
                          value={newTimelineEvent.date}
                          onChange={(e) =>
                            setNewTimelineEvent({
                              ...newTimelineEvent,
                              date: e.target.value,
                            })
                          }
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={handleCancelTimelineEventEdit}
                            className="px-3 py-1.5 text-sm font-medium cursor-pointer border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveTimelineEvent}
                            className="px-3 py-1.5 text-sm font-medium cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {statusBadge(event.status)}
                            <span className="text-xs text-gray-400">{event.date}</span>
                          </div>
                          <p className="font-semibold text-sm text-gray-900">{event.title}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => handleEditTimelineEvent(idx)}
                            className="text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg p-1.5 cursor-pointer transition-all"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                timeline: prev.timeline.filter((_, i) => i !== idx),
                              }))
                            }
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-1.5 cursor-pointer transition-all"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Updates */}
          <SectionCard title="Updates" subtitle="Log project versions and progress notes" icon={FileText}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Version</FieldLabel>
                <Input
                  value={newUpdate.version}
                  onChange={(e) =>
                    setNewUpdate((prev) => ({ ...prev, version: e.target.value }))
                  }
                  placeholder="v1.0"
                />
              </div>
              <div>
                <FieldLabel>Date</FieldLabel>
                <Input
                  value={newUpdate.date}
                  onChange={(e) =>
                    setNewUpdate((prev) => ({ ...prev, date: e.target.value }))
                  }
                  type="date"
                />
              </div>
            </div>
            <div>
              <FieldLabel>Content</FieldLabel>
              <Textarea
                value={newUpdate.content}
                onChange={(e) =>
                  setNewUpdate((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Update Content"
                rows={3}
              />
            </div>
            <button
              type="button"
              onClick={handleAddUpdate}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-all active:scale-95 cursor-pointer"
            >
              <Plus size={16} /> Add Update
            </button>

            {form.updates.length > 0 && (
              <div className="space-y-2 mt-2">
                {form.updates.map((upd, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 p-4 rounded-xl"
                  >
                    {editingUpdateIndex === idx ? (
                      <div className="space-y-3">
                        <Input
                          value={newUpdate.version}
                          onChange={(e) =>
                            setNewUpdate({
                              ...newUpdate,
                              version: e.target.value,
                            })
                          }
                        />
                        <Textarea
                          value={newUpdate.content}
                          onChange={(e) =>
                            setNewUpdate({
                              ...newUpdate,
                              content: e.target.value,
                            })
                          }
                          rows={2}
                        />
                        <Input
                          type="date"
                          value={newUpdate.date}
                          onChange={(e) =>
                            setNewUpdate({
                              ...newUpdate,
                              date: e.target.value,
                            })
                          }
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={handleCancelUpdateEdit}
                            className="px-3 py-1.5 text-sm font-medium cursor-pointer border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveUpdate}
                            className="px-3 py-1.5 text-sm font-medium cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                              {upd.version}
                            </span>
                            <span className="text-xs text-gray-400">{upd.date}</span>
                          </div>
                          <p className="text-sm text-gray-700 mt-0.5">{upd.content}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => handleEditUpdate(idx)}
                            className="text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg p-1.5 cursor-pointer transition-all"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                updates: prev.updates.filter((_, i) => i !== idx),
                              }))
                            }
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-1.5 cursor-pointer transition-all"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Donation Options */}
          <SectionCard title="Donation Options" subtitle="Configure available donation types" icon={Settings}>
            <div className="grid grid-cols-2 gap-3">
              {form.donationOptions.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${option.isEnabled
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                >
                  <input
                    type="checkbox"
                    className="accent-emerald-600 w-4 h-4"
                    name={`donationOptions.${index}`}
                    checked={option.isEnabled}
                    onChange={handleChange}
                  />
                  <span className="text-sm font-medium text-gray-700">{option.type}</span>
                </label>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
