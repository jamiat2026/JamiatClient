'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { IoIosCloseCircle } from 'react-icons/io';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function CreateBlogPage() {
  const [form, setForm] = useState({
    title: '',
    content: '',
    imageUrl: '',
    imageAlt: '',
    youtubeUrl: '',
    category: [],
    authorName: '',
    metaTitle: '',
    metaDescription: '',
    targetKeywords: [],
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    schemaMarkup: '',
  });
  const [categories, setCategories] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');

  const router = useRouter();

  async function handleImageUpload(e, field) {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: data,
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert(errorData.error || 'Upload failed');
      return;
    }

    const uploaded = await res.json();
    setForm((prev) => ({ ...prev, [field]: uploaded.url }));
  }

  async function handleSubmit() {
    console.log('Submitting form:', form);
    try {
      await axios.post('/api/blogs', {
        ...form,
        categories: form.category,
        imageUrl: form.imageUrl,
        schemaMarkup: form.schemaMarkup ? JSON.parse(form.schemaMarkup) : undefined,
      });

      alert('Blog saved!');
      router.push('/blogs');
    } catch (error) {
      alert("Couldn't Save Blog!", error);
    }
  }

  async function fetchCategories() {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !form.targetKeywords.includes(keywordInput.trim())) {
      setForm((prev) => ({
        ...prev,
        targetKeywords: [...prev.targetKeywords, keywordInput.trim()],
      }));
      setKeywordInput('');
    }
  };

  return (
    <div className="min-h-full w-full bg-gray-50/50 p-4 sm:p-8 rounded-3xl border border-gray-200/60 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create Blog</h1>
          <p className="text-sm text-gray-500">Write and publish a new blog post.</p>
        </div>
        <button
          onClick={handleSubmit}
          className="flex flex-row text-sm sm:text-base gap-2 items-center font-semibold bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 cursor-pointer text-white transition-all rounded-xl shadow-sm border border-emerald-500/50"
        >
          Save Blog
        </button>
      </div>

      {/* Primary Details Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-4 sm:p-6 space-y-6">
        {/* Title + YouTube Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Heading</label>
            <input
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-gray-500">YouTube Link</label>
            <input
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="YouTube URL"
              value={form.youtubeUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, youtubeUrl: e.target.value }))}
            />
          </div>
        </div>

        {/* Author Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Author Name</label>
          <input
            className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="Author Name"
            value={form.authorName}
            onChange={(e) => setForm((prev) => ({ ...prev, authorName: e.target.value }))}
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Category</label>
          <select
            name="category"
            multiple
            value={form.category}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(
                (opt) => opt.value
              );
              setForm((prev) => ({
                ...prev,
                category: Array.from(new Set([...prev.category, ...selected])),
              }));
            }}
            className="p-2.5 text-sm w-full sm:w-1/2 border border-gray-300 rounded-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="" disabled>
              Choose category
            </option>
            {categories.map((cat, idx) => (
              <option value={cat.name} key={idx}>
                {cat.name}
              </option>
            ))}
          </select>
          {form.category.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {form.category.map((cat) => (
                <span
                  key={cat}
                  className="bg-emerald-100 text-emerald-700 border border-emerald-200 py-1 pl-3 pr-2 rounded-full text-sm flex items-center gap-2"
                >
                  {cat}
                  <button
                    type="button"
                    className="cursor-pointer text-emerald-500 hover:text-red-500 transition-colors"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        category: prev.category.filter((c) => c !== cat),
                      }))
                    }
                  >
                    <IoIosCloseCircle size={18} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Media Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-4 sm:p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Media</h2>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Featured Image</label>
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="preview"
              className="h-40 w-40 rounded-xl border border-gray-200 object-cover"
            />
          )}
          <input
            type="file"
            onChange={(e) => handleImageUpload(e, 'imageUrl')}
            className="block w-full text-sm text-gray-700
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-emerald-100 file:text-emerald-700
              hover:file:bg-emerald-200 transition-all cursor-pointer"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Image Alt Text</label>
          <input
            className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="Image Alt Text"
            value={form.imageAlt}
            onChange={(e) => setForm((prev) => ({ ...prev, imageAlt: e.target.value }))}
          />
        </div>
      </div>

      {/* SEO Settings Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-4 sm:p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">SEO Settings</h2>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Meta Title</label>
          <input
            className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="Meta Title"
            value={form.metaTitle}
            onChange={(e) => setForm((prev) => ({ ...prev, metaTitle: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Meta Description</label>
          <textarea
            className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="Meta Description"
            value={form.metaDescription}
            onChange={(e) => setForm((prev) => ({ ...prev, metaDescription: e.target.value }))}
            rows={4}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Target Keywords</label>
          <div className="flex gap-2">
            <input
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Add a keyword"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddKeyword();
                }
              }}
            />
            <button
              type="button"
              className="font-semibold bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-white transition-all rounded-xl text-sm border border-emerald-500/50"
              onClick={handleAddKeyword}
            >
              Add
            </button>
          </div>
          {form.targetKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {form.targetKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="bg-emerald-100 text-emerald-700 border border-emerald-200 py-1 pl-3 pr-2 rounded-full text-sm flex items-center gap-2"
                >
                  {keyword}
                  <button
                    type="button"
                    className="cursor-pointer text-emerald-500 hover:text-red-500 transition-colors"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        targetKeywords: prev.targetKeywords.filter((k) => k !== keyword),
                      }))
                    }
                  >
                    <IoIosCloseCircle size={18} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Open Graph Settings Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-4 sm:p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Open Graph Settings</h2>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase tracking-wider text-gray-500">OG Title</label>
          <input
            className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="OG Title"
            value={form.ogTitle}
            onChange={(e) => setForm((prev) => ({ ...prev, ogTitle: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase tracking-wider text-gray-500">OG Description</label>
          <textarea
            className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="OG Description"
            value={form.ogDescription}
            onChange={(e) => setForm((prev) => ({ ...prev, ogDescription: e.target.value }))}
            rows={4}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase tracking-wider text-gray-500">OG Image</label>
          {form.ogImage && (
            <img
              src={form.ogImage}
              alt="OG image preview"
              className="h-40 w-40 rounded-xl border border-gray-200 object-cover"
            />
          )}
          <input
            type="file"
            onChange={(e) => handleImageUpload(e, 'ogImage')}
            className="block w-full text-sm text-gray-700
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-emerald-100 file:text-emerald-700
              hover:file:bg-emerald-200 transition-all cursor-pointer"
          />
        </div>
      </div>

      {/* Schema Markup Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-4 sm:p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Schema Markup</h2>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase tracking-wider text-gray-500">JSON-LD</label>
          <textarea
            className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono text-sm"
            placeholder='{"@context": "https://schema.org", "@type": "BlogPosting", ...}'
            value={form.schemaMarkup}
            onChange={(e) => setForm((prev) => ({ ...prev, schemaMarkup: e.target.value }))}
            rows={6}
          />
        </div>
      </div>

      {/* Blog Content Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-4 sm:p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Blog Content</h2>
        <ReactQuill
          value={form.content}
          onChange={(value) => setForm((prev) => ({ ...prev, content: value }))}
          className="bg-white"
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image'],
              ['clean'],
            ],
          }}
        />
      </div>
    </div>
  );
}