import React from "react";
import { TextInput, Select, MultiSelect } from "@mantine/core";
import { 
  IconSearch, 
  IconMapPin, 
  IconBriefcase, 
  IconTrendingUp,
  IconBuilding,
  IconTools
} from "@tabler/icons-react";
import { JobFilters } from "../Pages/FindJob";

const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400 pointer-events-none z-10";

const jobTypeOptions = [
  "Full-time",
  "Part-time", 
  "Contract",
  "Freelance",
  "Internship",
  "Remote"
];

const experienceOptions = [
  "0-1 years",
  "1-3 years", 
  "3-5 years",
  "5-10 years",
  "10+ years"
];

const skillsOptions = [
  "JavaScript", "React", "Node.js", "Python", "Java", "Angular",
  "Vue.js", "TypeScript", "MongoDB", "MySQL", "PostgreSQL",
  "AWS", "Docker", "Kubernetes", "Git", "HTML", "CSS"
];

interface MultiInputProps {
  filters: JobFilters;
  updateFilters: (filters: Partial<JobFilters>) => void;
}

const MultiInput: React.FC<MultiInputProps> = ({ filters, updateFilters }) => {
  const inputStyles = {
    input: {
      backgroundColor: "#2d2d2d",
      borderColor: "#4f4f4f",
      color: "white",
      paddingLeft: "2.5rem",
      borderRadius: "9999px",
    }
  };

  const selectStyles = {
    ...inputStyles,
    dropdown: {
      backgroundColor: "#2d2d2d",
      color: "white",
      border: "1px solid #4f4f4f",
    },
    option: {
      backgroundColor: "#2d2d2d",
      color: "white",
      "&:hover": {
        backgroundColor: "#facc15 !important",
        color: "black !important",
      },
      "&[data-selected]": {
        backgroundColor: "#facc15 !important",
        color: "black !important",
      },
    },
  };

  const searchInputs = [
    {
      icon: IconSearch,
      type: "text",
      placeholder: "Job title, keywords, or company",
      value: filters.searchQuery,
      onChange: (value: string) => updateFilters({ searchQuery: value })
    },
    {
      icon: IconMapPin,
      type: "text", 
      placeholder: "Location",
      value: filters.location,
      onChange: (value: string) => updateFilters({ location: value })
    },
    {
      icon: IconBriefcase,
      type: "select",
      placeholder: "Job Type",
      value: filters.jobType,
      data: jobTypeOptions,
      onChange: (value: string) => updateFilters({ jobType: value })
    },
    {
      icon: IconTrendingUp,
      type: "select",
      placeholder: "Experience Level", 
      value: filters.experience,
      data: experienceOptions,
      onChange: (value: string) => updateFilters({ experience: value })
    },
    {
      icon: IconBuilding,
      type: "text",
      placeholder: "Company",
      value: filters.company,
      onChange: (value: string) => updateFilters({ company: value })
    },
    {
      icon: IconTools,
      type: "multiselect",
      placeholder: "Skills",
      value: filters.skills,
      data: skillsOptions,
      onChange: (value: string[]) => updateFilters({ skills: value })
    }
  ];

  return (
    <div className="w-full px-6 py-4 bg-mine-shaft-950 rounded-xl shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {searchInputs.map((item, index) => {
          const IconComponent = item.icon;
          
          return (
            <div key={index} className="relative min-w-[200px]">
              <IconComponent size={20} className={iconClass} />
              
              {item.type === "select" ? (
                <Select
                  placeholder={item.placeholder}
                  data={item.data || []}
                  value={item.value as string}
                  onChange={(value) => item.onChange(value || "")}
                  className="w-full"
                  searchable
                  clearable
                  styles={selectStyles}
                />
              ) : item.type === "multiselect" ? (
                <MultiSelect
                  placeholder={item.placeholder}
                  data={item.data || []}
                  value={item.value as string[]}
                  onChange={(value) => item.onChange(value)}
                  className="w-full"
                  searchable
                  clearable
                  maxValues={5}
                  styles={selectStyles}
                />
              ) : (
                <TextInput
                  placeholder={item.placeholder}
                  value={item.value as string}
                  onChange={(e) => item.onChange(e.target.value)}
                  className="w-full"
                  styles={inputStyles}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultiInput;
