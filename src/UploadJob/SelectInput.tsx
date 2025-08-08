import React from "react";
import { Select } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";

interface SelectInputProps {
  label: string;
  data: string[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ComponentType<{ className?: string }>;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  data,
  value,
  onChange,
  icon: Icon,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-bright-sun-400 mb-2">
        {Icon && <Icon className="inline w-4 h-4 mr-2" />}
        {label}
      </label>
      <Select
        data={data}
        value={value}
        onChange={(val) => onChange(val || "")}
        placeholder={`Select ${label.toLowerCase()}`}
        radius="md"
        size="md"
        className="w-full"
        searchable
        clearable
        rightSection={<IconChevronDown size={16} className="text-gray-400" />}
        styles={{
          input: {
            backgroundColor: "#1c1c1c",
            border: "1px solid #374151",
            color: "#facc15",
            fontSize: "14px",
            padding: "12px 40px 12px 16px",
            borderRadius: "8px",
          },
          dropdown: {
            backgroundColor: "#1c1c1c",
            border: "1px solid #374151",
            borderRadius: "8px",
            padding: "4px",
          },
          item: {
            color: "#facc15",
            padding: "10px 12px",
            fontSize: "14px",
            borderRadius: "6px",
            margin: "2px 0",
            '&[data-selected]': {
              backgroundColor: "#facc15",
              color: "#1c1c1c",
            },
            '&[data-hovered]': {
              backgroundColor: "#374151",
            }
          },
        }}
      />
    </div>
  );
};

export default SelectInput;
