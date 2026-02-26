'use client';

import { useEffect, useState } from 'react';
import { Loader2, Edit, Save, X, Plus, Trash } from 'lucide-react';

export default function FooterSettingsPage() {
  const [footer, setFooter] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch existing footer settings
  useEffect(() => {
    fetch('/api/footer')
      .then(res => res.json())
      .then(data => {
        setFooter(data);
        setFormData(data);
        setLoading(false);
      });
  }, []);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [field]: value }
    }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    const updatedArray = [...formData[arrayName]];
    updatedArray[index][field] = value;
    setFormData(prev => ({ ...prev, [arrayName]: updatedArray }));
  };

  const addArrayItem = (arrayName) => {
    const newItem = { label: '', path: '' };
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] || []), newItem]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    const updatedArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [arrayName]: updatedArray }));
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch('/api/footer', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const updated = await res.json();
    setFooter(updated);
    setFormData(updated);
    setSaving(false);
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="min-h-full w-full bg-gray-50/50 p-4 sm:p-8 rounded-3xl border border-gray-200/60 shadow-sm flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500 text-sm">
          <Loader2 className="animate-spin text-emerald-600" size={20} />
          Loading Footer Settings...
        </div>
      </div>
    );
  }

  const inputClass = "p-2.5 w-full border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all text-sm";
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2";

  return (
    <div className="min-h-full w-full bg-gray-50/50 p-4 sm:p-8 rounded-3xl border border-gray-200/60 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Footer Settings</h1>
          <p className="text-sm text-gray-500">Manage footer content, links, and contact information.</p>
        </div>

        <div className="flex gap-2">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex flex-row text-sm gap-2 items-center font-semibold bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 cursor-pointer text-white transition-all rounded-xl shadow-sm border border-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  <Save size={14} />
                )}
                Save
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setFormData(footer);
                }}
                className="flex flex-row text-sm gap-2 items-center font-medium px-4 py-2.5 cursor-pointer text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all"
              >
                <X size={14} /> Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="flex flex-row text-sm gap-2 items-center font-semibold bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 cursor-pointer text-white transition-all rounded-xl shadow-sm border border-emerald-500/50"
            >
              <Edit size={14} /> Edit
            </button>
          )}
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-4 sm:p-6 space-y-6">

        {/* Organization Name */}
        <div className="pb-5 border-b border-gray-100">
          <label className={labelClass}>Organization Name</label>
          {editMode ? (
            <input
              type="text"
              value={formData.orgName || ''}
              onChange={e => handleFieldChange('orgName', e.target.value)}
              className={inputClass}
              placeholder="Enter organization name"
            />
          ) : (
            <p className="text-sm text-gray-900 font-medium">{footer.orgName}</p>
          )}
        </div>

        {/* Quick Links */}
        <div className="pb-5 border-b border-gray-100">
          <label className={labelClass}>Quick Links</label>
          <div className="space-y-2.5">
            {formData.quickLinks?.map((link, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row gap-2.5 items-center bg-gray-50/80 border border-gray-100 p-3 rounded-xl"
              >
                {editMode ? (
                  <>
                    <input
                      type="text"
                      value={link.label}
                      onChange={e =>
                        handleArrayChange('quickLinks', i, 'label', e.target.value)
                      }
                      placeholder="Link Label"
                      className={`${inputClass} flex-1`}
                    />
                    <input
                      type="text"
                      value={link.path}
                      onChange={e =>
                        handleArrayChange('quickLinks', i, 'path', e.target.value)
                      }
                      placeholder="Link Path"
                      className={`${inputClass} flex-1`}
                    />
                    <button
                      onClick={() => removeArrayItem('quickLinks', i)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-2 cursor-pointer transition-all"
                    >
                      <Trash size={16} />
                    </button>
                  </>
                ) : (
                  <p className="flex-1 text-sm text-gray-900 font-medium">
                    {link.label} <span className="text-gray-300 mx-1">→</span> <span className="text-gray-500 font-normal">{link.path}</span>
                  </p>
                )}
              </div>
            ))}
            {editMode && (
              <button
                onClick={() => addArrayItem('quickLinks')}
                className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2 rounded-lg cursor-pointer transition-all mt-1"
              >
                <Plus size={14} /> Add Quick Link
              </button>
            )}
          </div>
        </div>

        {/* Terms Links */}
        <div className="pb-5 border-b border-gray-100">
          <label className={labelClass}>Terms Links</label>
          <div className="space-y-2.5">
            {formData.termsLinks?.map((link, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row gap-2.5 items-center bg-gray-50/80 border border-gray-100 p-3 rounded-xl"
              >
                {editMode ? (
                  <>
                    <input
                      type="text"
                      value={link.label}
                      onChange={e =>
                        handleArrayChange('termsLinks', i, 'label', e.target.value)
                      }
                      placeholder="Link Label"
                      className={`${inputClass} flex-1`}
                    />
                    <input
                      type="text"
                      value={link.path}
                      onChange={e =>
                        handleArrayChange('termsLinks', i, 'path', e.target.value)
                      }
                      placeholder="Link Path"
                      className={`${inputClass} flex-1`}
                    />
                    <button
                      onClick={() => removeArrayItem('termsLinks', i)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-2 cursor-pointer transition-all"
                    >
                      <Trash size={16} />
                    </button>
                  </>
                ) : (
                  <p className="flex-1 text-sm text-gray-900 font-medium">
                    {link.label} <span className="text-gray-300 mx-1">→</span> <span className="text-gray-500 font-normal">{link.path}</span>
                  </p>
                )}
              </div>
            ))}
            {editMode && (
              <button
                onClick={() => addArrayItem('termsLinks')}
                className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2 rounded-lg cursor-pointer transition-all mt-1"
              >
                <Plus size={14} /> Add Terms Link
              </button>
            )}
          </div>
        </div>

        {/* Volunteering */}
        <div className="pb-5 border-b border-gray-100">
          <label className={labelClass}>Volunteering</label>
          {editMode ? (
            <div className="space-y-3 bg-gray-50/80 border border-gray-100 p-4 rounded-xl">
              <input
                type="text"
                value={formData.volunteering?.heading || ''}
                onChange={e =>
                  handleNestedChange('volunteering', 'heading', e.target.value)
                }
                placeholder="Volunteering Heading"
                className={inputClass}
              />
              <textarea
                value={formData.volunteering?.description || ''}
                onChange={e =>
                  handleNestedChange('volunteering', 'description', e.target.value)
                }
                placeholder="Volunteering Description"
                className={`${inputClass} resize-none`}
                rows={4}
              />
              <input
                type="text"
                value={formData.volunteering?.linkLabel || ''}
                onChange={e =>
                  handleNestedChange('volunteering', 'linkLabel', e.target.value)
                }
                placeholder="Link Label"
                className={inputClass}
              />
              <input
                type="text"
                value={formData.volunteering?.linkPath || ''}
                onChange={e =>
                  handleNestedChange('volunteering', 'linkPath', e.target.value)
                }
                placeholder="Link Path"
                className={inputClass}
              />
            </div>
          ) : (
            <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl">
              <p className="font-semibold text-sm text-gray-900">{footer.volunteering.heading}</p>
              <p className="text-sm text-gray-500 mt-1">{footer.volunteering.description}</p>
              <p className="text-sm text-gray-900 font-medium mt-2">
                {footer.volunteering.linkLabel}{' '}
                <span className="text-gray-300 mx-1">→</span> <span className="text-gray-500 font-normal">{footer.volunteering.linkPath}</span>
              </p>
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="pb-5 border-b border-gray-100">
          <label className={labelClass}>Social Links</label>
          <div className="space-y-2.5">
            {Object.keys(formData.socialLinks || {}).map((key, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row gap-2.5 items-center bg-gray-50/80 border border-gray-100 p-3 rounded-xl"
              >
                <span className="capitalize min-w-[100px] text-xs font-bold uppercase tracking-wider text-gray-500">
                  {key}
                </span>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.socialLinks[key]}
                    onChange={e => handleNestedChange('socialLinks', key, e.target.value)}
                    className={`${inputClass} flex-1`}
                    placeholder={`Enter ${key} URL`}
                  />
                ) : (
                  <p className="text-sm text-gray-900 font-medium truncate">{footer.socialLinks[key]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="pb-5 border-b border-gray-100">
          <label className={labelClass}>Contact Info</label>
          {editMode ? (
            <div className="space-y-3 bg-gray-50/80 border border-gray-100 p-4 rounded-xl">
              <input
                type="email"
                value={formData.contact?.email || ''}
                onChange={e => handleNestedChange('contact', 'email', e.target.value)}
                placeholder="Email"
                className={inputClass}
              />
              <input
                type="text"
                value={formData.contact?.phone || ''}
                onChange={e => handleNestedChange('contact', 'phone', e.target.value)}
                placeholder="Phone"
                className={inputClass}
              />
              <textarea
                value={formData.contact?.address || ''}
                onChange={e => handleNestedChange('contact', 'address', e.target.value)}
                placeholder="Address (use new lines as needed)"
                className={`${inputClass} resize-none`}
                rows={4}
              />
            </div>
          ) : (
            <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl space-y-1">
              <p className="text-sm text-gray-900 font-medium">{footer.contact?.email}</p>
              <p className="text-sm text-gray-900 font-medium">{footer.contact?.phone}</p>
              <p className="text-sm text-gray-500 whitespace-pre-line mt-1">
                {footer.contact?.address}
              </p>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div>
          <label className={labelClass}>Copyright Text</label>
          {editMode ? (
            <input
              type="text"
              value={formData.copyrightText || ''}
              onChange={e => handleFieldChange('copyrightText', e.target.value)}
              className={inputClass}
              placeholder="Enter copyright text"
            />
          ) : (
            <p className="text-sm text-gray-900 font-medium">{footer.copyrightText}</p>
          )}
        </div>
      </div>
    </div>
  );
}
