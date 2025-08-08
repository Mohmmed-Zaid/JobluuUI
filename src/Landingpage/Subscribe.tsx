import { Button, TextInput } from "@mantine/core";
import React from "react";

const Subscribe = () => {
  return (
    <div className="w-full bg-mine-shaft-950 py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto bg-mine-shaft-900 border border-mine-shaft-800 rounded-2xl shadow-md px-6 sm:px-12 py-10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10">
        {/* Left Side - Text */}
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Never Want to Miss any <span className="text-bright-sun-400">Job News</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Subscribe now and stay updated with the latest job alerts!
          </p>
        </div>

        {/* Right Side - Input + Button */}
        <div className="flex gap-2 w-full sm:w-auto">
          <TextInput
            placeholder="Enter your email address"
            className="flex-1 min-w-[220px]"
            classNames={{
              input:
                "bg-mine-shaft-800 text-white placeholder:text-gray-400 border border-mine-shaft-700 focus:border-bright-sun-400",
            }}
          />
          <Button
            className="bg-bright-sun-400 hover:bg-bright-sun-300 text-black font-semibold transition duration-300 shadow-md"
          >
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
