import React, { useState } from "react";
import { Button, Slider } from "@mantine/core";
import { IconFilterOff } from "@tabler/icons-react";
import MultiInput from "./MultiInput";
import { JobFilters } from "../Pages/FindJob";

interface SearchBarProps {
  filters: JobFilters;
  updateFilters: (filters: Partial<JobFilters>) => void;
  clearFilters: () => void;
  jobCount: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  filters, 
  updateFilters, 
  clearFilters, 
  jobCount 
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleSalaryChange = (value: number | number[]) => {
    updateFilters({ salaryRange: value as [number, number] });
  };

  return (
    <div className="w-full bg-mine-shaft-950 px-6 py-6">
      <MultiInput 
        filters={filters}
        updateFilters={updateFilters}
      />
      
      {/* Advanced Filters Toggle */}
      <div className="flex justify-between items-center mt-4 px-6">
        <Button
          variant="subtle"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="text-yellow-400 hover:bg-yellow-400/10"
        >
          {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
        </Button>
        
        <div className="flex items-center gap-4">
          <span className="text-white text-sm">
            {jobCount} jobs found
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            leftSection={<IconFilterOff size={16} />}
            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="mt-6 p-6 bg-mine-shaft-900 rounded-xl">
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-3">
              Salary Range (in Lakhs): {filters.salaryRange[0]} - {filters.salaryRange[1]}
            </label>
            <Slider
              range
              min={0}
              max={100}
              step={1}
              value={filters.salaryRange}
              onChange={handleSalaryChange}
              color="yellow"
              size="md"
              marks={[
                { value: 0, label: '0L' },
                { value: 25, label: '25L' },
                { value: 50, label: '50L' },
                { value: 75, label: '75L' },
                { value: 100, label: '100L+' },
              ]}
              styles={{
                track: { backgroundColor: '#4f4f4f' },
                bar: { backgroundColor: '#facc15' },
                thumb: { backgroundColor: '#facc15', borderColor: '#facc15' },
                mark: { backgroundColor: '#facc15' },
                markLabel: { color: '#facc15' }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
