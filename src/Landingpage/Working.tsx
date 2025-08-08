import React from "react";
import { Avatar } from "@mantine/core";
import { steps } from "./Data/stepsData";

const Working = () => {
  return (
    <div className="mt-28 pb-10">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-5xl font-bold text-white mb-4">
          How it <span className="text-yellow-400">Works</span>
        </h2>
        <p className="text-xl text-mine-shaft-300 font-medium max-w-4xl mx-auto">
          Effortlessly navigate through the process and land your dream job.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row justify-center items-center gap-16 px-10 mt-16 relative">
        {/* Left - Image */}
        <div className="w-full lg:w-1/2 flex justify-center relative">
          <img
            src="/girl.png"
            alt="Girl working"
            className="max-w-[420px] w-full object-contain"
          />

          {/* Avatar card aligned to laptop */}
          <div className="absolute bottom-26 left-[56%] w-44 bg-white/10 backdrop-blur-md border border-yellow-400/30 rounded-2xl p-4 shadow-2xl">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Avatar
                  className="!h-16 !w-16 border-2 border-yellow-400/50 shadow-lg"
                  src="/girlavatar.png"
                  alt="User Profile"
                />
                <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-md -z-10"></div>
              </div>

              <div className="text-center">
                <div className="text-sm font-semibold text-white mb-1">
                  Complete your Profile
                </div>
                <div className="text-xs text-gray-400">70% Completed</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Steps */}
        <div className="w-full lg:w-1/2 flex flex-col gap-12">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-5 group">
              <div className="p-3 bg-yellow-400 rounded-full shrink-0 group-hover:bg-yellow-300 transition-colors duration-200 shadow-lg">
                <img
                  src={`/${step.icon}`}
                  alt={step.title}
                  className="h-12 w-12"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-yellow-400 transition-colors duration-200">
                  {step.title}
                </h3>
                <p className="text-mine-shaft-300 group-hover:text-gray-300 transition-colors duration-200">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Working;
