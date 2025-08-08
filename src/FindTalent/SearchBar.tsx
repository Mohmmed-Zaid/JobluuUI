import React from "react";
import MultiInput from "./MultiInput";

interface SearchBarProps {
  onFilterChange: (filters: Record<string, string>) => void;
}

/**
 * SearchBar component for the FindTalent page.
 * Now accepts onFilterChange prop to communicate filter changes to parent
 */
const SearchBar: React.FC<SearchBarProps> = ({ onFilterChange }) => {
  return (
    <div className="w-full bg-mine-shaft-950 px-6 py-6">
      <MultiInput onFilterChange={onFilterChange} />
    </div>
  );
};

export default SearchBar;
