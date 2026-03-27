"use client";
import { useState, useEffect } from "react";
import { TbCheck, TbSearch, TbBuildingBank } from "react-icons/tb";

export default function EmergencyDonationEditor({ data, onSave, saving }) {
  const [availableProjects, setAvailableProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Initialize properly by extracting IDs if projects are populated as objects
  const [linkedProjects, setLinkedProjects] = useState(() => {
    const list = Array.isArray(data?.linkedProjects) ? data.linkedProjects : [];
    return list.map(p => {
       if (typeof p === 'string') return p;
       if (p && p._id) return p._id;
       return null;
    }).filter(p => p !== null);
  });

  useEffect(() => {
    // Fetch all active projects
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects?limit=1000");
        const json = await res.json();
        if (json.projects) {
          setAvailableProjects(json.projects);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const toggleProject = (projectId) => {
    if (!projectId) return;
    setLinkedProjects(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      // Limit to exactly one project selected at a time
      return arr.includes(projectId) ? [] : [projectId];
    });
  };

  const filteredProjects = availableProjects.filter(p => 
    p?.title?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 space-y-6">
        <div className="flex flex-col gap-2">
           <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
              <TbBuildingBank size={24} />
              Linked Projects for Donation
           </h3>
           <p className="text-sm text-emerald-800">
              Select one or more existing projects to link to this emergency fund. The donation form and status on the emergency page will reflect the aggregated goals and collected amounts of these selected projects.
           </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
             <TbSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
             <input 
               type="text"
               placeholder="Search projects..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-11 pr-4 py-3 bg-white border border-emerald-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400 transition"
             />
          </div>

          <div className="bg-white border border-emerald-200 rounded-xl overflow-hidden max-h-[400px] overflow-y-auto">
            {loadingProjects ? (
              <div className="p-8 text-center text-gray-500">Loading projects...</div>
            ) : filteredProjects.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No projects found.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                 {filteredProjects.map(project => {
                    const isSelected = Array.isArray(linkedProjects) && linkedProjects.includes(project._id);
                    return (
                      <div 
                         key={project._id} 
                         onClick={() => toggleProject(project._id)}
                         className={`flex items-start gap-4 p-4 cursor-pointer hover:bg-emerald-50/50 transition ${isSelected ? 'bg-emerald-50/30' : ''}`}
                      >
                         <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded border ${isSelected ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300'} flex items-center justify-center transition-colors`}>
                            {isSelected && <TbCheck className="text-white" size={14} />}
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate ${isSelected ? 'text-emerald-900' : 'text-gray-900'}`}>
                               {project.title || 'Untitled Project'}
                            </p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                               {project.category && (
                                   <span>
                                     {Array.isArray(project.category) 
                                        ? project.category.join(", ") 
                                        : typeof project.category === 'string' ? project.category : JSON.stringify(project.category)}
                                   </span>
                               )}
                               <span>• Goal: ₹{(project.totalRequired || 0).toLocaleString()}</span>
                               <span>• Raised: ₹{(project.collected || 0).toLocaleString()}</span>
                            </div>
                         </div>
                      </div>
                    );
                 })}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-800 pb-2">
            Selected Projects: <span className="bg-emerald-200 text-emerald-900 py-0.5 px-2 rounded-full">{linkedProjects.length}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          onClick={() => onSave({ linkedProjects })}
          disabled={saving}
          className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Linked Projects"}
        </button>
      </div>
    </div>
  );
}
