import React from "react";
import { IconSearch } from "@tabler/icons-react";
import { Avatar } from "@mantine/core";

const DreamJob = () => {
  return (
    <section className="bg-mine-shaft-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Wrapper */}
        <div className="min-h-[80vh] md:min-h-screen flex flex-col md:flex-row md:items-center gap-10 md:gap-12 pt-16 md:pt-20 lg:pt-24">
          {/* Left */}
          <div className="w-full md:w-1/2 flex flex-col justify-start gap-6">
            <h1 className="font-bold leading-tight tracking-tight text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              Discover your <br />
              <span className="text-yellow-400 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                dream career
              </span>{" "}
              with us.
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 font-light leading-relaxed tracking-wide max-w-2xl">
              Your <span className="text-yellow-400 font-bold">perfect life</span> starts with the{" "}
              <span className="text-white font-bold">right opportunity</span>.
              <br className="hidden sm:block" />
              Begin your <span className="text-yellow-400 font-bold">journey</span> through thousands of{" "}
              <span className="text-white font-bold">amazing jobs</span> today.
            </p>

            {/* Search */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="w-full"
              aria-label="Job search"
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:mt-4">
                <div className="bg-gradient-to-br from-mine-shaft-900 to-mine-shaft-800 rounded-xl px-4 sm:px-6 py-4 sm:py-5 w-full sm:w-64 shadow-2xl border border-mine-shaft-600 focus-within:border-yellow-400 transition-all">
                  <label
                    htmlFor="role"
                    className="block text-xs sm:text-sm text-yellow-400 mb-1.5 sm:mb-2 font-bold uppercase tracking-wider"
                  >
                    Dream Role
                  </label>
                  <input
                    id="role"
                    type="text"
                    placeholder="Software Engineer"
                    className="bg-transparent text-white outline-none w-full text-sm sm:text-base font-semibold placeholder-gray-400"
                  />
                </div>

                <div className="bg-gradient-to-br from-mine-shaft-900 to-mine-shaft-800 rounded-xl px-4 sm:px-6 py-4 sm:py-5 w-full sm:w-64 shadow-2xl border border-mine-shaft-600 focus-within:border-yellow-400 transition-all">
                  <label
                    htmlFor="style"
                    className="block text-xs sm:text-sm text-yellow-400 mb-1.5 sm:mb-2 font-bold uppercase tracking-wider"
                  >
                    Work Style
                  </label>
                  <input
                    id="style"
                    type="text"
                    placeholder="Full Time"
                    className="bg-transparent text-white outline-none w-full text-sm sm:text-base font-semibold placeholder-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center h-12 sm:h-auto w-full sm:w-16 bg-gradient-to-br from-yellow-400 to-orange-500 text-black rounded-xl p-3 hover:from-yellow-500 hover:to-orange-600 transition-all shadow-2xl hover:shadow-yellow-400/30"
                  aria-label="Search jobs"
                >
                  <IconSearch className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </form>
          </div>

          {/* Right */}
          <div className="w-full md:w-1/2 relative">
            <div className="relative w-full max-w-xl md:max-w-none mx-auto">
              {/* Character Image */}
              <img
                src="/Boy.png"
                alt="Illustration of a person working on a laptop"
                className="w-full h-auto object-contain"
                loading="eager"
              />

              {/* 10K+ Got Job Box */}
              <div className="absolute top-3 sm:top-6 right-2 sm:right-4 md:top-8 md:right-6">
                <div className="border border-yellow-400 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 bg-mine-shaft-900/80 backdrop-blur-sm flex flex-col items-center w-fit shadow-lg">
                  <div className="text-xs sm:text-sm text-white font-semibold mb-2">10K+ got job</div>
                  <div className="flex -space-x-3">
                    <Avatar src="avatar.png" radius="xl" size={30} />
                    <Avatar src="avatar1.png" radius="xl" size={30} />
                    <Avatar src="avatar2.png" radius="xl" size={30} />
                    <Avatar
                      radius="xl"
                      size={30}
                      className="bg-gray-700 text-white font-semibold text-[10px] flex items-center justify-center"
                    >
                      +9k
                    </Avatar>
                  </div>
                </div>
              </div>

              {/* Google Offer Box */}
              <div className="absolute left-3 sm:left-6 md:left-10 top-1/2 sm:top-[55%] md:top-[58%]">
                <div className="border border-yellow-400 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 bg-mine-shaft-900/80 backdrop-blur-sm w-44 sm:w-52 shadow-lg">
                  <div className="flex items-center gap-2 mb-1.5">
                    <img src="google.png" alt="Google" className="w-6 h-6 sm:w-8 sm:h-7 object-contain" />
                    <div className="text-white font-medium text-xs sm:text-sm">Google Offer</div>
                  </div>
                  <div className="text-white text-xs sm:text-sm mb-0.5">Software Engineer</div>
                  <div className="text-gray-400 text-[10px] sm:text-xs">Pune, Maharashtra</div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mt-1">1 day ago • 120 Applicants</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer for small screens so content breathes */}
        <div className="h-6 md:h-10" />
      </div>
    </section>
  );
};

export default DreamJob;
