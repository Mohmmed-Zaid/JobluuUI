import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavLinks = () => {
  const links = [
    { name: "Find Jobs", url: "find-jobs" },
    { name: "Find Talent", url: "find-talent" },
    { name: "Posted Job", url: "posted-job" },
    { name: "Job History", url: "job-history" }
    
  ];

  const location = useLocation();

  return (
    <div className="flex gap-10 text-base font-medium font-roboto text-white">
      {links.map((link, index) => {
        const isActive = location.pathname.includes(link.url);

        return (
          <Link
            key={index}
            to={`/${link.url}`}
            className={`relative px-2 pb-2 transition-colors duration-300 hover:text-yellow-400 ${
              isActive ? "text-yellow-400" : ""
            }`}
          >
            {link.name}
            {isActive && (
              <span className="absolute -top-[14px] left-0 w-full h-[3px] bg-yellow-400 rounded-t" />
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default NavLinks;
