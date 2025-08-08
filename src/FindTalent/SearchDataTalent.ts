import {
  IconBriefcase,
  IconMapPin,
  IconStars,
  IconCurrencyDollar,
  IconCalendarEvent,
} from "@tabler/icons-react";

const SearchDataTalent = [
  {
    icon: IconBriefcase,
    placeholder: "Role (e.g., Software Engineer)",
    type: "text" as const,
    key: "role", // Add unique key
  },
  {
    icon: IconMapPin,
    placeholder: "Location (e.g., Pune)",
    type: "text" as const,
    key: "location", // Add unique key
  },
  {
    icon: IconStars,
    placeholder: "Skills (e.g., React, Python)",
    type: "text" as const,
    key: "skills", // Add unique key
  },
  {
    icon: IconCurrencyDollar,
    placeholder: "Expected Salary",
    type: "select" as const,
    key: "salary", // Add unique key
    data: [
      "10 - 20 LPA",
      "20 - 30 LPA",
      "30 - 40 LPA",
      "40 - 50 LPA",
      "50 - 60LPA",
      "60+ LPA",
    ],
  },
  {
    icon: IconCalendarEvent,
    placeholder: "Experience Level",
    type: "select" as const,
    key: "experience", // Add unique key
    data: ["Entry-level", "Junior", "Mid-level", "Senior", "Lead", "Principal"],
  },
];

export default SearchDataTalent;