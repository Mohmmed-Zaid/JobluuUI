import React, { useState, useMemo } from "react";
import Sort from "../FindTalent/Sort";
import TalentCard from "./TalentCard";
import TalentData from "../Landingpage/Data/TalentData";

interface TalentsProps {
  filters?: Record<string, string>;
}

/**
 * Talents component: Displays a filtered grid of TalentCard components.
 */
const Talents: React.FC<TalentsProps> = ({ filters = {} }) => {
  const [sortOption, setSortOption] = useState<string>("recommended");

  // Filter talents based on search criteria
  const filteredTalents = useMemo(() => {
    return TalentData.filter((talent) => {
      // Role filter
      if (filters.role && filters.role.trim()) {
        const roleMatch = talent.title.toLowerCase().includes(filters.role.toLowerCase());
        if (!roleMatch) return false;
      }

      // Location filter
      if (filters.location && filters.location.trim()) {
        const locationMatch = talent.location.toLowerCase().includes(filters.location.toLowerCase());
        if (!locationMatch) return false;
      }

      // Skills filter
      if (filters.skills && filters.skills.trim()) {
        const skillsToFind = filters.skills.toLowerCase().split(',').map(s => s.trim());
        const talentSkills = talent.skills.map(s => s.toLowerCase());
        const hasMatchingSkill = skillsToFind.some(skill => 
          talentSkills.some(talentSkill => talentSkill.includes(skill))
        );
        if (!hasMatchingSkill) return false;
      }

      // Salary filter
      if (filters.salary && filters.salary.trim()) {
        // This assumes expectedSalary format matches the filter options
        // You might need to adjust this logic based on your actual data format
        const salaryMatch = talent.expectedSalary === filters.salary;
        if (!salaryMatch) return false;
      }

      // Experience filter
      if (filters.experience && filters.experience.trim()) {
        const experienceMatch = talent.experienceLevel.toLowerCase() === filters.experience.toLowerCase();
        if (!experienceMatch) return false;
      }

      return true;
    });
  }, [filters]);

  // Sort filtered talents
  const sortedTalents = useMemo(() => {
    const sorted = [...filteredTalents];
    
    switch (sortOption) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "experience":
        const expOrder = ["Entry-level", "Junior", "Mid-level", "Senior", "Lead", "Principal"];
        return sorted.sort((a, b) => {
          const aIndex = expOrder.indexOf(a.experienceLevel);
          const bIndex = expOrder.indexOf(b.experienceLevel);
          return aIndex - bIndex;
        });
      case "location":
        return sorted.sort((a, b) => a.location.localeCompare(b.location));
      case "recommended":
      default:
        return sorted; // Keep original order for recommended
    }
  }, [filteredTalents, sortOption]);

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  return (
    <div className="px-6 py-8 text-white">
      {/* Header section */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">
            {Object.keys(filters).some(key => filters[key]) ? "Filtered Talent" : "Recommended Talent"}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Showing {sortedTalents.length} of {TalentData.length} talents
          </p>
        </div>
        <Sort onSortChange={handleSortChange} />
      </div>

      {/* Results */}
      {sortedTalents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-slate-400 text-lg mb-2">No talents found</div>
          <div className="text-slate-500 text-sm">
            Try adjusting your search criteria to find more results
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 justify-start">
          {sortedTalents.map((talent) => (
            <TalentCard key={talent.id} talent={talent} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Talents;
