'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';
import { TbEdit } from 'react-icons/tb';

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ New loading state

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await axios.get('/api/blogs');
        setBlogs(res.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false); // ✅ Stop loading once data is fetched
      }
    }
    fetchBlogs();
  }, []);

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    await axios.delete(`/api/blogs/${id}`);
    setBlogs(prev => prev.filter(b => b._id !== id));
  }

  return (
    <div className="min-h-full w-full bg-gray-50/50 p-4 sm:p-8 rounded-3xl border border-gray-200/60 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">All Blogs</h1>
          <p className="text-sm text-gray-500">Manage and organize your blog posts.</p>
        </div>

        <Link href="/blogeditor">
          <button
            className="flex flex-row text-sm sm:text-base gap-2 items-center font-semibold bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 cursor-pointer text-white transition-all rounded-xl shadow-sm border border-emerald-500/50"
          >
            <Plus size={16} /> Create New
          </button>
        </Link>
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-4 sm:p-6">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            {blogs.map(blog => (
              <div key={blog._id} className="bg-white border border-gray-200 p-4 rounded-xl hover:shadow-md transition-all duration-200 group">
                <div className="flex gap-3">
                  {blog.imageUrl && (
                    <img src={blog.imageUrl} alt="" className="w-20 h-20 object-cover rounded-xl border border-gray-100" />
                  )}

                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-gray-900 truncate">{blog.title}</h2>
                    <p className="text-gray-400 text-xs mt-1.5">{new Date(blog.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end gap-2">
                  <Link href={`/blogs/${blog._id}/edit`}>
                    <button
                      className="text-emerald-600 hover:bg-emerald-50 rounded-lg p-2 cursor-pointer transition-all"
                      title="Edit"
                    >
                      <TbEdit size={18} />
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-2 cursor-pointer transition-all"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            {!blogs.length && (
              <div className="col-span-full text-center py-16 text-gray-400">
                <p className="text-base">No blogs found.</p>
                <p className="text-sm mt-1">Create your first blog post to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
