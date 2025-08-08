import React, { useState } from "react";
import SearchBar from "./SearchBar";
import Talents from "./Talent";

/**
 * Main FindTalent page component that coordinates search and results
 */
const FindTalent: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-mine-shaft-950">
      {/* Search Bar */}
      <SearchBar onFilterChange={handleFilterChange} />
      
      {/* Talent Results */}
      <Talents filters={filters} />
    </div>
  );
};

export default FindTalent;