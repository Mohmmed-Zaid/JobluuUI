import React, { useState } from "react";
import { IconBookmark, IconPlus, IconTrash } from "@tabler/icons-react";
import { TextInput, Textarea, Button, Modal } from "@mantine/core";

interface Experience {
  company: string;
  role: string;
  type: string;
  start: string;
  end: string;
  location: string;
  logo: string;
  description: string;
}

const ExpCard = () => {
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      company: "Google",
      role: "Software Engineer",
      type: "Full-time",
      start: "Jan 2022",
      end: "Present",
      location: "Bengaluru, India",
      logo: "/google.png",
      description:
        "Contributing to the scalability and reliability of Google Search services by developing robust backend APIs using Java and Go. Led the migration of legacy systems to microservices architecture and improved system performance by 35%. Collaborated with cross-functional teams to design secure and efficient solutions for global users.",
    },
  ]);

  const [addModal, setAddModal] = useState(false);
  const [newExp, setNewExp] = useState<Experience>({
    company: "",
    role: "",
    type: "",
    start: "",
    end: "",
    location: "",
    logo: "",
    description: "",
  });

  const handleAddExperience = () => {
    if (newExp.company && newExp.role) {
      setExperiences([...experiences, newExp]);
      setNewExp({
        company: "",
        role: "",
        type: "",
        start: "",
        end: "",
        location: "",
        logo: "",
        description: "",
      });
      setAddModal(false);
    }
  };

  const handleDelete = (index: number) => {
    const updated = [...experiences];
    updated.splice(index, 1);
    setExperiences(updated);
  };

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center text-yellow-400 hover:text-yellow-300 transition"
        >
          <IconPlus size={18} className="mr-1" />
          Add Experience
        </button>
      </div>

      {experiences.map((exp, index) => (
        <div
          key={index}
          className="relative bg-mine-shaft-800/50 border border-slate-700/50 rounded-2xl p-6 mb-6 shadow-md hover:border-yellow-400/30 transition-all duration-300"
        >
          <button
            onClick={() => handleDelete(index)}
            className="absolute top-4 right-4 text-red-400 hover:text-red-300 transition"
          >
            <IconTrash size={18} />
          </button>

          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-4">
              <img
                src={exp.logo || "https://placehold.co/48x48?text=?"}
                alt={exp.company}
                className="w-12 h-12 rounded-lg object-contain bg-white p-1"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/48x48?text=?";
                }}
              />
              <div>
                <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                <p className="text-sm text-gray-400">
                  {exp.company} • {exp.type}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-400 mb-2">
            <span className="text-yellow-400 font-medium">
              {exp.start} – {exp.end}
            </span>
            <span className="mx-2">•</span>
            <span>{exp.location}</span>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed">{exp.description}</p>
        </div>
      ))}

      {/* Add Experience Modal */}
      <Modal opened={addModal} onClose={() => setAddModal(false)} title="Add Experience">
        <TextInput
          label="Company"
          value={newExp.company}
          onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
          required
          mb="sm"
        />
        <TextInput
          label="Role"
          value={newExp.role}
          onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
          required
          mb="sm"
        />
        <TextInput
          label="Employment Type"
          value={newExp.type}
          onChange={(e) => setNewExp({ ...newExp, type: e.target.value })}
          mb="sm"
        />
        <div className="flex gap-4">
          <TextInput
            label="Start Date"
            value={newExp.start}
            onChange={(e) => setNewExp({ ...newExp, start: e.target.value })}
            placeholder="e.g. Jan 2022"
            className="flex-1"
          />
          <TextInput
            label="End Date"
            value={newExp.end}
            onChange={(e) => setNewExp({ ...newExp, end: e.target.value })}
            placeholder="e.g. Present"
            className="flex-1"
          />
        </div>
        <TextInput
          label="Location"
          value={newExp.location}
          onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
          mb="sm"
        />
        <TextInput
          label="Company Logo URL"
          value={newExp.logo}
          onChange={(e) => setNewExp({ ...newExp, logo: e.target.value })}
          mb="sm"
        />
        <Textarea
          label="Description"
          value={newExp.description}
          onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
          mb="md"
          autosize
          minRows={3}
        />
        <Button fullWidth color="yellow" onClick={handleAddExperience}>
          Add
        </Button>
      </Modal>
    </div>
  );
};

export default ExpCard;
