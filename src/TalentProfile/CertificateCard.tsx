import React from "react";
import { IconAward } from "@tabler/icons-react";

const CertificateCard = () => {
  const certificates = [
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
  ];

  return (
    <div className="mt-5">
      {certificates.map((cert, index) => (
        <div
          key={index}
          className="bg-mine-shaft-800/50 border border-slate-700/50 rounded-2xl p-6 mb-6 shadow-md hover:border-yellow-400/30 transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500/20 p-2 rounded-full">
                <IconAward size={28} className="text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{cert.title}</h3>
                <p className="text-sm text-gray-400">{cert.issuer}</p>
              </div>
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
    </div>
  );
};

export default CertificateCard;
