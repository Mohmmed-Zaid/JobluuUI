import React, { useState } from "react";
import { TextInput, Select } from "@mantine/core";
import SearchDataTalent from "../FindTalent/SearchDataTalent";

interface SearchDataItem {
  icon: React.ElementType;
  placeholder: string;
  type: "text" | "select";
  key: string;
  data?: string[];
}

interface MultiInputProps {
  onFilterChange: (filters: Record<string, string>) => void;
}

const iconClass =
  "absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400 pointer-events-none z-10";

const MultiInput: React.FC<MultiInputProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string | null) => {
    const updated = { ...filters, [key]: value || "" };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="w-full px-6 py-4 bg-mine-shaft-950 rounded-xl shadow-md">
      <div className="flex gap-6 flex-wrap justify-center lg:justify-between xl:gap-8">
        {SearchDataTalent.map((item: SearchDataItem, index: number) => {
          const IconComponent = item.icon;

          return (
            <div
              key={item.key || index} // Use item.key for better performance
              className="relative w-64 min-w-[240px] flex-shrink-0"
            >
              <IconComponent size={20} className={iconClass} />

              {item.type === "select" ? (
                <Select
                  placeholder={item.placeholder}
                  data={item.data || []}
                  className="w-full"
                  searchable
                  clearable
                  onChange={(value) => handleChange(item.key, value)}
                  styles={{
                    input: {
                      backgroundColor: "#2d2d2d",
                      borderColor: "#4f4f4f",
                      color: "white",
                      paddingLeft: "2.5rem",
                      borderRadius: "9999px",
                    },
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
                  }}
                />
              ) : (
                <TextInput
                  placeholder={item.placeholder}
                  className="w-full"
                  onChange={(e) => handleChange(item.key, e.target.value)}
                  styles={{
                    input: {
                      backgroundColor: "#2d2d2d",
                      borderColor: "#4f4f4f",
                      color: "white",
                      paddingLeft: "2.5rem",
                      borderRadius: "9999px",
                    },
                  }}
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
