"use client"
import { useEffect, useState } from "react"
import { TbEdit, TbTrash, TbPlus, TbX, TbLink, TbVideo, TbQuestionMark, TbDeviceFloppy, TbBrandYoutube } from "react-icons/tb"

import { HelpCircle, Video, Layout, Info } from "lucide-react"

export default function IslamicKnowledgeHubEditor() {
  const [data, setData] = useState({
    qaTitle: "Islamic Q&A",
    qaSubtitle: "FREQUENTLY ASKED",
    qaItems: [],
    button2Text: "Watch Q&A",
    button2Url: "",
    videoSectionTitle: "Recent Bayans",
    videoSectionSubtitle: "LATEST VIDEOS",
    videoTitle: "",
    videoSubtitle: "",
    videoUrl: ""
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const res = await fetch("/api/islamic-knowledge-hub")
      const result = await res.json()
      if (result && result._id) {
        setData(result)
      }
    } catch (error) {
      console.error("Failed to fetch data", error)
    }
    setLoading(false)
  }

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleQAItemChange = (index, field, value) => {
    const updatedItems = [...data.qaItems]
    updatedItems[index][field] = value
    setData(prev => ({ ...prev, qaItems: updatedItems }))
  }

  const addQAItem = () => {
    setData(prev => ({
      ...prev,
      qaItems: [...prev.qaItems, { question: "", answer: "" }]
    }))
  }

  const removeQAItem = (index) => {
    const updatedItems = data.qaItems.filter((_, i) => i !== index)
    setData(prev => ({ ...prev, qaItems: updatedItems }))
  }


  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/islamic-knowledge-hub", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        alert("Knowledge Hub updated successfully!")
      }
    } catch (error) {
      console.error("Failed to save", error)
      alert("Failed to save changes.")
    }
    setSaving(false)
  }

  const getYouTubeID = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeID(data.videoUrl);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading Knowledge Hub...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Layout size={20} className="text-emerald-500" />
            Knowledge Hub Editor
          </h2>
          <p className="text-sm text-gray-500">
            Configure the Q&A section and recent bayan video.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer border border-emerald-500/50 disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <TbDeviceFloppy className="text-lg" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Q&A Section */}
        <div className="space-y-6">
          <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100/60 space-y-5">
            <div className="flex items-center gap-2 text-emerald-800 font-bold mb-2">
              <HelpCircle size={18} />
              Q&A Section Settings
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Section Title</label>
                <input
                  type="text"
                  value={data.qaTitle}
                  onChange={(e) => handleChange("qaTitle", e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-400 outline-none transition"
                  placeholder="e.g. Islamic Q&A"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Section Subtitle</label>
                <input
                  type="text"
                  value={data.qaSubtitle}
                  onChange={(e) => handleChange("qaSubtitle", e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-400 outline-none transition"
                  placeholder="e.g. FREQUENTLY ASKED"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Accordion Items</label>
                <button
                  onClick={addQAItem}
                  className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:text-emerald-700 transition"
                >
                  <TbPlus /> Add Item
                </button>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {data.qaItems.map((item, index) => (
                  <div key={index} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-3 relative group">
                    <button
                      onClick={() => removeQAItem(index)}
                      className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                    >
                      <TbTrash size={16} />
                    </button>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) => handleQAItemChange(index, "question", e.target.value)}
                        className="w-full text-sm font-semibold border-none bg-emerald-50/30 rounded-lg px-3 py-2 outline-none"
                        placeholder="Enter Question..."
                      />
                      <textarea
                        value={item.answer}
                        onChange={(e) => handleQAItemChange(index, "answer", e.target.value)}
                        className="w-full text-xs text-gray-600 border-none bg-gray-50 rounded-lg px-3 py-2 outline-none min-h-[60px]"
                        placeholder="Enter Answer..."
                      />
                    </div>
                  </div>
                ))}
                {data.qaItems.length === 0 && (
                  <div className="text-center py-6 text-gray-400 text-xs italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    No accordion items added yet.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-100">
              <div className="space-y-3 max-w-md mx-auto">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Action Button (e.g. Watch Q&A)</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={data.button2Text}
                    onChange={(e) => handleChange("button2Text", e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-emerald-400 outline-none"
                    placeholder="Button Text"
                  />
                  <input
                    type="text"
                    value={data.button2Url}
                    onChange={(e) => handleChange("button2Url", e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-emerald-400 outline-none"
                    placeholder="URL (e.g. /videos)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Video Section */}
        <div className="space-y-6">
          <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100/60 space-y-5">
            <div className="flex items-center gap-2 text-indigo-800 font-bold mb-2">
              <Video size={18} />
              Video Section Settings
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Section Title</label>
                <input
                  type="text"
                  value={data.videoSectionTitle}
                  onChange={(e) => handleChange("videoSectionTitle", e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 outline-none transition"
                  placeholder="e.g. Recent Bayans"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Section Subtitle</label>
                <input
                  type="text"
                  value={data.videoSectionSubtitle}
                  onChange={(e) => handleChange("videoSectionSubtitle", e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 outline-none transition"
                  placeholder="e.g. LATEST VIDEOS"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Video Content</label>

              <div className="relative group aspect-video rounded-2xl border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center overflow-hidden transition-all hover:border-indigo-400">
                {data.videoUrl ? (
                  <>
                    {videoId ? (
                      <iframe
                        className="w-full h-full border-0"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video src={data.videoUrl} controls className="w-full h-full object-cover" />
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={() => handleChange("videoUrl", "")}
                        className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm text-red-500 hover:bg-white transition opacity-0 group-hover:opacity-100"
                      >
                        <TbTrash size={18} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-gray-400 py-10">
                    <TbVideo size={48} className="text-gray-200" />
                    <div className="text-center">
                      <span className="text-sm font-bold uppercase tracking-widest block">No Video Selected</span>
                      <span className="text-[10px] text-gray-400">Paste a YouTube link below</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">YouTube Video URL</label>
                <div className="relative flex-1">
                  <TbBrandYoutube className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-500 text-lg" />
                  <input
                    type="text"
                    value={data.videoUrl}
                    onChange={(e) => handleChange("videoUrl", e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 outline-none transition"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              </div>

              <div className="space-y-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Video Display Title</label>
                  <input
                    type="text"
                    value={data.videoTitle}
                    onChange={(e) => handleChange("videoTitle", e.target.value)}
                    className="w-full border-none bg-gray-50 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-indigo-100"
                    placeholder="e.g. Importance of Sabr in Islam"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Video Display Subtitle</label>
                  <textarea
                    value={data.videoSubtitle}
                    onChange={(e) => handleChange("videoSubtitle", e.target.value)}
                    className="w-full border-none bg-gray-50 rounded-xl px-4 py-2.5 text-xs text-gray-600 outline-none focus:ring-1 focus:ring-indigo-100 min-h-[80px]"
                    placeholder="e.g. A profound reminder on maintaining patience..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  )
}
