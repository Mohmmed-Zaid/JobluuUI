import React, { useState } from "react";
import { IconAward, IconPlus, IconTrash } from "@tabler/icons-react";
import { TextInput, Textarea, Button, Modal } from "@mantine/core";

const CertificateCard = () => {
  const [certificates, setCertificates] = useState([
    {
      title: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services (AWS)",
      issued: "Mar 2023",
      id: "AWS-DEV-2023-XYZ123",
      description:
        "Validates proficiency in developing, deploying, and debugging cloud-based applications using AWS. Demonstrates hands-on experience with services like Lambda, DynamoDB, and API Gateway.",
    },
    {
      title: "Frontend Developer Certification",
      issuer: "freeCodeCamp",
      issued: "Jan 2022",
      id: "FCC-FE-2022-ABC456",
      description:
        "Covers HTML, CSS, JavaScript, and React. Built 20+ responsive web projects and passed coding challenges to demonstrate frontend mastery.",
    },
  ]);

  const [addModal, setAddModal] = useState(false);
  const [newCert, setNewCert] = useState({
    title: "",
    issuer: "",
    issued: "",
    id: "",
    description: "",
  });

  const handleAddCertificate = () => {
    if (newCert.title && newCert.issuer) {
      setCertificates([...certificates, newCert]);
      setNewCert({ title: "", issuer: "", issued: "", id: "", description: "" });
      setAddModal(false);
    }
  };

  const handleDelete = (index: number) => {
    const updated = [...certificates];
    updated.splice(index, 1);
    setCertificates(updated);
  };

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center text-yellow-400 hover:text-yellow-300 transition"
        >
          <IconPlus size={18} className="mr-1" />
          Add Certificate
        </button>
      </div>

      {certificates.map((cert, index) => (
        <div
          key={index}
          className="bg-mine-shaft-800/50 border border-slate-700/50 rounded-2xl p-6 mb-6 shadow-md hover:border-yellow-400/30 transition-all duration-300 relative"
        >
          <div className="absolute top-4 right-4">
            <button
              onClick={() => handleDelete(index)}
              className="text-red-400 hover:text-red-300 transition"
              title="Delete"
            >
              <IconTrash size={18} />
            </button>
          </div>
          <div className="flex items-start gap-4 mb-3">
            <div className="bg-yellow-500/20 p-2 rounded-full">
              <IconAward size={28} className="text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{cert.title}</h3>
              <p className="text-sm text-gray-400">{cert.issuer}</p>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-400 mb-2">
            <span className="text-yellow-400 font-medium">Issued: {cert.issued}</span>
            <span className="mx-2">•</span>
            <span>Credential ID: {cert.id}</span>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed">{cert.description}</p>
        </div>
      ))}

      {/* Add Certificate Modal */}
      <Modal opened={addModal} onClose={() => setAddModal(false)} title="Add Certificate">
        <TextInput
          label="Title"
          value={newCert.title}
          onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
          required
          mb="sm"
        />
        <TextInput
          label="Issuer"
          value={newCert.issuer}
          onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
          required
          mb="sm"
        />
        <TextInput
          label="Issued Date"
          value={newCert.issued}
          onChange={(e) => setNewCert({ ...newCert, issued: e.target.value })}
          mb="sm"
        />
        <TextInput
          label="Credential ID"
          value={newCert.id}
          onChange={(e) => setNewCert({ ...newCert, id: e.target.value })}
          mb="sm"
        />
        <Textarea
          label="Description"
          value={newCert.description}
          onChange={(e) => setNewCert({ ...newCert, description: e.target.value })}
          mb="md"
          autosize
          minRows={3}
        />
        <Button fullWidth color="yellow" onClick={handleAddCertificate}>
          Add
        </Button>
      </Modal>
    </div>
  );
};

export default CertificateCard;
