import React from "react";
import Marquee from "react-fast-marquee";

const companies = [
  "adobe", "apple", "chat-gpt", "discord", "facebook",
  "ibm", "microsoft", "nike", "sony", "stripe",
  "twitter", "unity", "app-store"
];

const Companies = () => {
  return (
    <div className="mt-20 p-5">
      <div className="text-4xl text-center font-semibold text-mine-shaft-100">
        Trusted By <span className="text-bright-sun-400">1000+</span> Companies
      </div>

      <Marquee pauseOnHover={true} className="mt-10" speed={50}>
        {companies.map((company, index) => (
          <div key={index} className="mx-10">
            <img
              src={`/Companies/${company}.png`}
              alt={company}
              className="h-16 w-auto transition duration-300"
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default Companies;
