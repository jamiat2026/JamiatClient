"use client";

import { useEffect, useState } from "react";
import { TbTrash, TbPlus, TbDeviceFloppy, TbCloudUpload } from "react-icons/tb";

export default function AboutLeadershipSectionEditor() {
  const [data, setData] = useState({
    title: "",
    subtitle: "",
    members: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/aboutleadershipsection");
      if (res.ok) {
        const json = await res.json();
        if (json) {
          setData({
            title: json.title || "",
            subtitle: json.subtitle || "",
            members: json.members || [],
          });
        }
      }
    } catch (err) {
      console.error("Error fetching leadership section:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/aboutleadershipsection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to save data.");
      }
      alert("Leadership section updated successfully!");
    } catch (err) {
      console.error("Error saving data:", err);
      setError("Failed to save data.");
    } finally {
      setSaving(false);
    }
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...data.members];
    updatedMembers[index][field] = value;
    setData({ ...data, members: updatedMembers });
  };

  const handleFileUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.url) {
        handleMemberChange(index, "image", result.url);
      } else {
        alert("Upload failed. No URL returned.");
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image.");
    }
  };

  const addMember = () => {
    setData({
      ...data,
      members: [
        ...data.members,
        {
          name: "",
          role: "",
          description: "",
          initials: "",
          color: "blue",
          icon: "shield",
          image: "",
        },
      ],
    });
  };

  const removeMember = (index) => {
    const updatedMembers = data.members.filter((_, i) => i !== index);
    setData({ ...data, members: updatedMembers });
  };

  if (loading) {
    return <div className="p-6">Loading editor...</div>;
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Leadership Section Editor</h2>
          <p className="text-sm text-gray-500">
            Manage the titles and members of the leadership section.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <TbDeviceFloppy size={20} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white p-5 border rounded-lg shadow-sm space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Header Configuration</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Title
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Leadership"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Subtitle
            </label>
            <input
              type="text"
              value={data.subtitle}
              onChange={(e) => setData({ ...data, subtitle: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Meet the dedicated individuals..."
            />
          </div>
        </div>

        <div className="bg-white p-5 border rounded-lg shadow-sm">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h3 className="font-semibold text-lg">Leadership Members</h3>
            <button
              onClick={addMember}
              className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-1.5 rounded-md hover:bg-gray-200"
            >
              <TbPlus size={16} />
              Add Member
            </button>
          </div>

          <div className="space-y-6">
            {data.members.map((member, index) => (
              <div key={index} className="flex gap-4 p-4 border rounded-md bg-gray-50 relative">
                <button
                  onClick={() => removeMember(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 bg-white rounded-md shadow-sm"
                  title="Remove Member"
                >
                  <TbTrash size={18} />
                </button>
                
                <div className="flex flex-col gap-4 w-full pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                        placeholder="e.g., Ahmed Khan"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => handleMemberChange(index, "role", e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                        placeholder="e.g., Executive Director"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Initials</label>
                      <input
                        type="text"
                        value={member.initials}
                        onChange={(e) => handleMemberChange(index, "initials", e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                        placeholder="e.g., AK"
                        maxLength={3}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Background Color</label>
                      <select
                        value={member.color}
                        onChange={(e) => handleMemberChange(index, "color", e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                      >
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="purple">Purple</option>
                        <option value="yellow">Yellow</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Icon</label>
                      <select
                        value={member.icon}
                        onChange={(e) => handleMemberChange(index, "icon", e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                      >
                        <option value="shield">Shield Check</option>
                        <option value="trending">Trending Up</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Member Image URL</label>
                      <input
                        type="text"
                        readOnly
                        value={member.image || ""}
                        className="w-full border border-gray-300 bg-gray-100 rounded-md p-2 text-sm text-gray-500 placeholder-gray-400"
                        placeholder="No image uploaded"
                      />
                    </div>
                    <div>
                      <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors text-sm h-[38px]">
                        <TbCloudUpload size={16} className="text-blue-600" />
                        Upload Image
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, index)} />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={member.description}
                      onChange={(e) => handleMemberChange(index, "description", e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                      rows={2}
                      placeholder="e.g., Former management consultant with 15 years..."
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {data.members.length === 0 && (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md border border-dashed">
                No leadership members added yet. Click "Add Member" to start.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
