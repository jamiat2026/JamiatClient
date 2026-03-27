"use client";

import { useEffect, useState } from "react";
import { TbDeviceFloppy, TbCloudUpload } from "react-icons/tb";

export default function AboutFinancialSectionEditor() {
  const [data, setData] = useState({
    tagline: "",
    title: "",
    description: "",
    button1: { label: "", pdfUrl: "" },
    button2: { label: "", pdfUrl: "" },
    totalRevenue: "",
    programServices: 0,
    fundraising: 0,
    administration: 0,
    footerText: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/aboutfinancialsection");
      if (res.ok) {
        const json = await res.json();
        if (json) {
          setData(json);
        }
      }
    } catch (err) {
      console.error("Error fetching financial section:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/aboutfinancialsection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to save data.");
      }
      alert("Financial section updated successfully!");
    } catch (err) {
      console.error("Error saving data:", err);
      setError("Failed to save data.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleButtonChange = (button, field, value) => {
    setData((prev) => ({
      ...prev,
      [button]: { ...prev[button], [field]: value },
    }));
  };

  const handleFileUpload = async (e, button) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      // You can add a loading state for the button here if needed
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.url) {
        handleButtonChange(button, "pdfUrl", result.url);
      } else {
        alert("Upload failed. No URL returned.");
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload file.");
    }
  };

  if (loading) {
    return <div className="p-6">Loading editor...</div>;
  }

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Financial Section Editor</h2>
          <p className="text-sm text-gray-500">Manage the financial transparency section and upload reports.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          <TbDeviceFloppy size={20} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>
      )}

      {/* Main Content Info */}
      <div className="bg-white p-5 border rounded-lg shadow-sm space-y-4">
        <h3 className="font-semibold text-lg border-b pb-2">Main Content</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
            <input
              type="text"
              value={data.tagline || ""}
              onChange={(e) => handleChange("tagline", e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., Financial Transparency"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., Your Trust is Our Amanah"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={data.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g., We believe in complete transparency..."
          />
        </div>
      </div>

      {/* Reports / Buttons */}
      <div className="bg-white p-5 border rounded-lg shadow-sm space-y-4">
        <h3 className="font-semibold text-lg border-b pb-2">Reports (Buttons & PDFs)</h3>
        
        {/* Button 1 */}
        <div className="flex flex-col md:flex-row gap-4 items-end mb-4 p-4 border rounded bg-gray-50">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Button 1 Label</label>
            <input
              type="text"
              value={data.button1?.label || ""}
              onChange={(e) => handleButtonChange("button1", "label", e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., 2023 Annual Report"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Current PDF URL</label>
            <input
              type="text"
              readOnly
              value={data.button1?.pdfUrl || ""}
              className="w-full border border-gray-300 bg-gray-100 rounded-md p-2 text-sm text-gray-500 placeholder-gray-400"
              placeholder="No file uploaded"
            />
          </div>
          <div>
            <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors">
              <TbCloudUpload size={18} className="text-emerald-600" />
              Upload PDF
              <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileUpload(e, "button1")} />
            </label>
          </div>
        </div>

        {/* Button 2 */}
        <div className="flex flex-col md:flex-row gap-4 items-end p-4 border rounded bg-gray-50">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Button 2 Label</label>
            <input
              type="text"
              value={data.button2?.label || ""}
              onChange={(e) => handleButtonChange("button2", "label", e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., View Past Reports"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Current PDF URL</label>
            <input
              type="text"
              readOnly
              value={data.button2?.pdfUrl || ""}
              className="w-full border border-gray-300 bg-gray-100 rounded-md p-2 text-sm text-gray-500 placeholder-gray-400"
              placeholder="No file uploaded"
            />
          </div>
          <div>
            <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors">
              <TbCloudUpload size={18} className="text-emerald-600" />
              Upload PDF
              <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileUpload(e, "button2")} />
            </label>
          </div>
        </div>
      </div>

      {/* Revenue & Allocations */}
      <div className="bg-white p-5 border rounded-lg shadow-sm space-y-4">
        <h3 className="font-semibold text-lg border-b pb-2">Revenue & Allocations</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Revenue</label>
          <input
            type="text"
            value={data.totalRevenue || ""}
            onChange={(e) => handleChange("totalRevenue", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g., $2.4 Million"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program Services (%)</label>
            <input
              type="number"
              value={data.programServices || 0}
              onChange={(e) => handleChange("programServices", Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fundraising (%)</label>
            <input
              type="number"
              value={data.fundraising || 0}
              onChange={(e) => handleChange("fundraising", Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Administration (%)</label>
            <input
              type="number"
              value={data.administration || 0}
              onChange={(e) => handleChange("administration", Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Footer Text</label>
          <input
            type="text"
            value={data.footerText || ""}
            onChange={(e) => handleChange("footerText", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g., Audited by independent third-party firms annually."
          />
        </div>
      </div>
    </div>
  );
}
