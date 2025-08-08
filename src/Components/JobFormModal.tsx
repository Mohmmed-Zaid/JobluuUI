import React, { useState, useEffect } from "react";
import { IconX, IconUpload, IconTrash } from "@tabler/icons-react";

interface JobDTO {
  id?: number;
  title: string;
  description: string;
  location: string;
  companyName: string;
  salary: string;
  jobType: string;
  experienceLevel: string;
  skills: string[];
  status: 'active' | 'draft';
  logoUrl?: string;
  daysAgo?: number;
}

interface JobFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: JobDTO, logoFile?: File) => void;
  editJob?: JobDTO | null;
  isLoading?: boolean;
}

const JobFormModal: React.FC<JobFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editJob, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<JobDTO>({
    title: "",
    description: "",
    location: "",
    companyName: "",
    salary: "",
    jobType: "Full Time",
    experienceLevel: "Mid-level",
    skills: [],
    status: "active"
  });

  const [skillInput, setSkillInput] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  // Reset form when modal opens/closes or editJob changes
  useEffect(() => {
    if (isOpen) {
      if (editJob) {
        setFormData(editJob);
        setLogoPreview(editJob.logoUrl || "");
      } else {
        // Reset for new job
        setFormData({
          title: "",
          description: "",
          location: "",
          companyName: "",
          salary: "",
          jobType: "Full Time",
          experienceLevel: "Mid-level",
          skills: [],
          status: "active"
        });
        setLogoPreview("");
      }
      setSkillInput("");
      setLogoFile(null);
    }
  }, [isOpen, editJob]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("Logo file size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert("Please upload an image file");
        return;
      }

      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    // Reset file input
    const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      alert("Job title is required");
      return;
    }
    if (!formData.description.trim()) {
      alert("Job description is required");
      return;
    }
    if (!formData.location.trim()) {
      alert("Location is required");
      return;
    }
    if (!formData.companyName.trim()) {
      alert("Company name is required");
      return;
    }

    onSubmit(formData, logoFile || undefined);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-mine-shaft-900 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-700">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-yellow-400">
            {editJob ? 'Edit Job' : 'Post New Job'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors duration-200"
            disabled={isLoading}
          >
            <IconX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Job Title */}
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-mine-shaft-800 border border-slate-600 text-white focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                  placeholder="e.g. Frontend Developer"
                  required
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-mine-shaft-800 border border-slate-600 text-white focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                  placeholder="e.g. Google Inc."
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-mine-shaft-800 border border-slate-600 text-white focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                  placeholder="e.g. San Francisco, CA"
                  required
                />
              </div>

              {/* Salary */}
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-2">
                  Salary Range
                </label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-mine-shaft-800 border border-slate-600 text-white focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                  placeholder="e.g. 80,0000 - 120,0000"
                />
              </div>

              {/* Job Type and Experience Level */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm font-bold mb-2">
                    Job Type
                  </label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-mine-shaft-800 border border-slate-600 text-white focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-sm font-bold mb-2">
                    Experience Level
                  </label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-mine-shaft-800 border border-slate-600 text-white focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                  >
                    <option value="Entry-level">Entry-level</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                    <option value="Expert">Expert</option>
                    <option value="Lead">Lead</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-mine-shaft-800 border border-slate-600 text-white focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Company Logo Upload */}
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-2">
                  Company Logo
                </label>
                <div className="relative border-2 border-dashed border-slate-600 rounded-lg p-4 text-center hover:border-yellow-400 transition-colors duration-200">
                  {logoPreview ? (
                    <div className="relative">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="mx-auto h-24 w-24 object-contain rounded-lg bg-white p-2"
                      />
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 z-10"
                      >
                        <IconTrash size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                        className="text-xs text-slate-400 mt-2 hover:text-yellow-400 transition-colors duration-200"
                      >
                        Click to change logo
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                      className="w-full py-4 hover:bg-slate-800/50 rounded-lg transition-colors duration-200"
                    >
                      <IconUpload className="mx-auto h-12 w-12 text-slate-400" />
                      <p className="text-slate-400 mt-2">Click to upload logo</p>
                      <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                    </button>
                  )}
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-2">
                  Required Skills
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={handleSkillKeyPress}
                    className="flex-1 p-2 rounded-lg bg-mine-shaft-800 border border-slate-600 text-white focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                    placeholder="Add a skill..."
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>
                
                {/* Skills Display */}
                {formData.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-slate-800 px-3 py-1 rounded-full text-sm text-white border border-slate-600 flex items-center gap-2"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-slate-400 hover:text-red-400 transition-colors duration-200"
                        >
                          <IconX size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-slate-400 text-sm font-bold mb-2">
                  Job Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full p-3 rounded-lg bg-mine-shaft-800 border border-slate-600 text-white focus:outline-none focus:border-yellow-400 transition-colors duration-200 resize-none"
                  placeholder="Describe the job role, responsibilities, requirements..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-500 text-slate-300 rounded-lg font-semibold hover:bg-slate-700 hover:text-white transition-colors duration-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-b-transparent"></div>
                  {editJob ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editJob ? 'Update Job' : 'Post Job'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobFormModal;