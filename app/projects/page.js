'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Eye, Plus } from 'lucide-react'
import { FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6'
import { TbEdit } from 'react-icons/tb'

const Input = ({ className, ...props }) => (
  <input
    className={`border border-gray-200 px-4 py-2.5 rounded-xl text-sm w-full focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none ${className}`}
    {...props}
  />
)

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProjects, setTotalProjects] = useState(0)
  const rowsPerPage = 10
  const router = useRouter()

  useEffect(() => {
    async function fetchProjects() {
      let url = `/api/projects?page=${currentPage}&limit=${rowsPerPage}`
      if (search) url += `&search=${search}`
      if (statusFilter) url += `&status=${statusFilter}`

      const res = await fetch(url)
      const data = await res.json()
      setProjects(data.projects || data)
      setTotalPages(data.totalPages || 1)
      setTotalProjects(data.totalCount || data.projects?.length || 0)
    }

    fetchProjects()
  }, [search, statusFilter, currentPage])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    setProjects(projects.filter((p) => p._id !== id))
  }

  return (
    <div className='min-h-full w-full bg-gray-50/50 p-4 sm:p-8 rounded-3xl border border-gray-200/60 shadow-sm space-y-8'>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500">Manage and track all your ongoing and completed projects.</p>
        </div>

        <button
          onClick={() => router.push('/projects/create')}
          className="flex flex-row text-sm sm:text-base gap-2 items-center font-semibold bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 cursor-pointer text-white transition-all duration-200 rounded-xl shadow-sm hover:shadow-md active:scale-95"
        >
          <Plus size={18} /> Create Project
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 cursor-pointer rounded-xl px-4 py-2.5 text-sm w-full sm:w-48 bg-white text-gray-700 appearance-none outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Upcoming">Upcoming</option>
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm table-auto text-left">
          <thead className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-200">
            <tr>
              {['Title', 'Status', 'Actions'].map((heading, idx) => (
                <th
                  key={idx}
                  className={`py-4 px-6 text-xs uppercase tracking-wider font-bold ${idx === 2 ? 'text-right' : ''}`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-gray-900 divide-y divide-gray-100">
            {projects.length > 0 ? (
              projects.map((project) => (
                <tr key={project._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium">{project.title}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${project.status === 'Active' ? 'bg-green-100 text-green-700' :
                      project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => router.push(`/projects/${project._id}`)}
                        className="text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg p-2 cursor-pointer transition-all active:scale-95"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => router.push(`/projects/${project._id}/edit`)}
                        className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg p-2 cursor-pointer transition-all active:scale-95"
                        title="Edit"
                      >
                        <TbEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg p-2 cursor-pointer transition-all active:scale-95"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-12 text-center text-gray-500">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 text-sm text-gray-600 border-t border-gray-200">
          <div className="hidden sm:block">
            Showing <span className="font-semibold text-gray-900">{Math.min((currentPage - 1) * rowsPerPage + 1, totalProjects)}</span> to{' '}
            <span className="font-semibold text-gray-900">{Math.min(currentPage * rowsPerPage, totalProjects)}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalProjects}</span> entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 hover:bg-white hover:border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 bg-white shadow-sm"
            >
              <FaAnglesLeft size={14} />
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 hover:bg-white hover:border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 bg-white shadow-sm"
            >
              <FaAnglesRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
