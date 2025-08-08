import React from "react";
import { Avatar, Rating } from "@mantine/core";
import { testimonials } from "./Data/testimonials";

const Testimonials = () => {
  return (
    <div className="mt-16 px-8 pb-12">
      {/* Heading */}
      <div className="text-4xl text-center font-bold mb-10 text-white">
        What <span className="text-yellow-400">Users</span> Say About Us?
      </div>

      {/* Testimonial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((user, index) => (
          <div
            key={index}
            className="border border-yellow-400/20 bg-mine-shaft-900 rounded-2xl p-4 shadow-md hover:shadow-yellow-400/20 transition-all duration-300 group"
          >
            {/* User Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <Avatar
                  src={user.image}
                  alt={user.name}
                  className="!h-12 !w-12 border border-yellow-400/30"
                />
                <div className="absolute inset-0 bg-yellow-400/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-white group-hover:text-yellow-400 transition-colors">
                  {user.name}
                </div>
                <Rating value={user.rating} readOnly size="xs" />
              </div>
            </div>

            {/* Feedback */}
            <p className="text-sm text-gray-400 leading-snug group-hover:text-white transition-colors duration-300">
              “{user.feedback}”
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
