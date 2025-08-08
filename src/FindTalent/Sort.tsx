import React from "react";
import { Select } from "@mantine/core";

interface SortProps {
  onSortChange?: (value: string) => void;
}

const Sort: React.FC<SortProps> = ({ onSortChange }) => {
  const sortOptions = [
    { value: "recommended", label: "Recommended" },
    { value: "name", label: "Name (A-Z)" },
    { value: "experience", label: "Experience Level" },
    { value: "location", label: "Location" },
  ];

  return (
    <Select
      placeholder="Sort by"
      data={sortOptions}
      defaultValue="recommended"
      onChange={(value) => onSortChange?.(value || "recommended")}
      className="w-48"
      styles={{
        input: {
          backgroundColor: "#2d2d2d",
          borderColor: "#4f4f4f",
          color: "white",
          borderRadius: "8px",
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
  );
};

export default Sort;