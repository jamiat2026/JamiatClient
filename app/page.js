'use client'

import { useEffect, useState } from 'react'
import { Users, Activity, CheckCircle, DollarSign } from 'lucide-react'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    activeCount: 0,
    completedCount: 0,
    totalDonors: 0,
    totalDonations: 0,
    monthlyDonations: [],
    months: [],
  })

  useEffect(() => {
    async function fetchData() {
      const [projectRes, donorRes, donationRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/donors'),
        fetch('/api/save-donation'),
      ])
      const projectData = await projectRes.json()
      const donorData = await donorRes.json()
      const donationData = await donationRes.json()

      // Calculate monthly donations
      const monthly = {}
      const months = []
      donationData.forEach((don) => {
        const date = new Date(don.createdAt)
        const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
        if (!monthly[key]) {
          monthly[key] = 0
          months.push(key)
        }
        monthly[key] += don.amount || 0
      })
      months.sort()
      const monthlyDonations = months.map((m) => monthly[m])

      setSummary({
        activeCount: projectData.activeCount,
        completedCount: projectData.completedCount,
        totalDonors: donorData.length,
        totalDonations: donationData.reduce((sum, d) => sum + (d.amount || 0), 0),
        monthlyDonations,
        months,
      })
    }
    fetchData()
  }, [])

  const stats = [
    {
      title: 'Active Projects',
      value: summary.activeCount,
      icon: <Activity className="text-green-600 w-6 h-6" />,
      bg: 'bg-green-100',
    },
    {
      title: 'Total Donors',
      value: summary.totalDonors,
      icon: <Users className="text-blue-600 w-6 h-6" />,
      bg: 'bg-blue-100',
    },
    {
      title: 'Total Donations',
      value: `₹${summary.totalDonations}`,
      icon: <CheckCircle className="text-yellow-600 w-6 h-6" />,
      bg: 'bg-yellow-100',
    },
    {
      title: 'Completed Projects',
      value: summary.completedCount,
      icon: <DollarSign className="text-emerald-600 w-6 h-6" />,
      bg: 'bg-emerald-100',
    },
  ]

  const donationBarData = {
    labels: summary.months,
    datasets: [
      {
        label: 'Donations (in ₹)',
        data: summary.monthlyDonations,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      },
    ],
  }

  const projectPieData = {
    labels: ['Active', 'Completed'],
    datasets: [
      {
        data: [summary.activeCount, summary.completedCount],
        backgroundColor: ['#34d399', '#059669'],
      },
    ],
  }

  return (
    <div className="space-y-8 bg-gray-50/50 rounded-3xl p-4 sm:p-8 border border-gray-200/60 shadow-sm">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Active Projects</h1>
        <p className="text-sm text-gray-500">Overview of your current project performance and donations.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group flex flex-row items-center justify-between p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {stat.title}
              </span>
              <span className="text-2xl font-bold text-gray-900 leading-tight">
                {stat.value}
              </span>
            </div>
            <div className={`${stat.bg} flex items-center justify-center h-12 w-12 rounded-xl transition-transform group-hover:scale-110`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Monthly Donations</h2>
            <p className="text-sm text-gray-500 font-normal">Tracking donation growth over time</p>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <Bar
              data={donationBarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: { beginAtZero: true, grid: { color: "#f3f4f6" } },
                  x: { grid: { display: false } },
                },
              }}
            />
          </div>
        </div>

        <div className="flex flex-col bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Project Status Breakdown</h2>
            <p className="text-sm text-gray-500 font-normal">Active vs. Completed projects distribution</p>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <Pie
              data={projectPieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
