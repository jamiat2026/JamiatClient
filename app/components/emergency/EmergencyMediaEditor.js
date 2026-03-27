"use client";
import { useState } from "react";
import { TbTrash, TbPlus, TbCloudUpload, TbBrandYoutube, TbVideo } from "react-icons/tb";

export default function EmergencyMediaEditor({ data, onSave, saving }) {
  const [media, setMedia] = useState(data?.media || []);
  const imageCount = media.filter(m => m.type === "image").length;
  const videoCount = media.filter(m => m.type === "video").length;

  const handleAddMedia = () => {
    if (media.length < 3) {
      if (imageCount < 2) {
        setMedia([...media, { type: "image", url: "" }]);
      } else if (videoCount < 1) {
        setMedia([...media, { type: "video", url: "" }]);
      }
    }
  };

  const handleRemoveMedia = (index) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...media];
    updated[index][field] = value;
    setMedia(updated);
  };

  const handleUpload = async (e, index) => {
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
        handleChange(index, "url", result.url);
      }
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const getYouTubeID = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
          Photos & Youtube Videos <span className="text-xs font-medium bg-gray-100 px-2.5 py-1 rounded-full text-gray-400">(Images: {imageCount}/2, Video: {videoCount}/1)</span>
        </label>
        {media.length < 3 && (imageCount < 2 || videoCount < 1) && (
          <button
            onClick={handleAddMedia}
            className="flex items-center gap-2 text-emerald-600 text-sm font-bold bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100/50 hover:bg-emerald-100 transition-all active:scale-95"
          >
            <TbPlus size={18} /> Add Media
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {media.map((item, index) => {
          const videoId = item.type === "video" ? getYouTubeID(item.url) : null;
          
          return (
            <div key={index} className={`relative group border rounded-2xl p-4 transition-all duration-300 ${item.type === 'video' ? 'bg-red-50/10 border-red-100' : 'bg-gray-50/50 border-gray-100'} hover:border-emerald-200 hover:shadow-sm`}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                  <button
                    onClick={() => {
                        if (item.type === "image") return;
                        if (imageCount < 2) {
                            handleChange(index, "type", "image");
                            handleChange(index, "url", "");
                        }
                    }}
                    disabled={item.type !== 'image' && imageCount >= 2}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${item.type === 'image' ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-not-allowed'}`}
                    style={item.type === 'image' ? {} : { cursor: imageCount >= 2 ? 'not-allowed' : 'pointer' }}
                  >
                    Image
                  </button>
                  <button
                    onClick={() => {
                        if (item.type === "video") return;
                        if (videoCount < 1) {
                            handleChange(index, "type", "video");
                            handleChange(index, "url", "");
                        }
                    }}
                    disabled={item.type !== 'video' && videoCount >= 1}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${item.type === 'video' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-not-allowed'}`}
                    style={item.type === 'video' ? {} : { cursor: videoCount >= 1 ? 'not-allowed' : 'pointer' }}
                  >
                    Video
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveMedia(index)}
                  className="bg-white text-red-500 hover:bg-red-50 border border-red-100 p-2 rounded-xl transition-all shadow-sm active:scale-90"
                >
                  <TbTrash size={18} />
                </button>
              </div>
              
              <div className="relative aspect-video rounded-xl border-2 border-dashed border-gray-200 bg-white flex items-center justify-center overflow-hidden transition-colors">
                {item.url ? (
                  <>
                    {item.type === "image" ? (
                      <>
                        <img src={item.url} alt="Media Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <label className="cursor-pointer text-white text-xs font-bold flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full bg-white/10 backdrop-blur-md">
                            <TbCloudUpload size={18} /> Change Image
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => handleUpload(e, index)} 
                            />
                            </label>
                        </div>
                      </>
                    ) : (
                      videoId ? (
                        <iframe
                          className="w-full h-full border-0"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <TbBrandYoutube size={48} className="text-red-100" />
                          <span className="text-xs font-bold">Invalid YouTube Link</span>
                        </div>
                      )
                    )}
                  </>
                ) : (
                  item.type === "image" ? (
                    <label className="cursor-pointer flex flex-col items-center gap-3 text-gray-400 hover:text-emerald-500 transition-all w-full h-full justify-center group-hover:bg-emerald-50/20">
                      <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-emerald-50 transition-colors">
                        <TbCloudUpload size={28} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">Upload Image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleUpload(e, index)} 
                      />
                    </label>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <div className="p-3 bg-gray-50 rounded-2xl">
                        <TbVideo size={28} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">YouTube Video</span>
                    </div>
                  )
                )}
              </div>

              {item.type === "video" && (
                <div className="mt-4 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5 ml-1">
                    <TbBrandYoutube className="text-red-500" /> Video URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                    value={item.url}
                    onChange={(e) => handleChange(index, "url", e.target.value)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {media.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30 text-gray-400 gap-3">
          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <TbPlus size={24} />
          </div>
          <span className="text-sm font-semibold">No media items added yet</span>
        </div>
      )}

      <div className="flex justify-end pt-6 border-t border-gray-100">
        <button
          onClick={() => onSave({ media })}
          disabled={saving}
          className="bg-emerald-600 text-white px-10 py-3 rounded-2xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2"
        >
          {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {saving ? "Saving Changes..." : "Save Gallery"}
        </button>
      </div>
    </div>
  );
}
