import React from "react";

const categories = [
  { icon: "palette.png", title: "Design", jobs: "120+" },
  { icon: "developer.png", title: "Development", jobs: "200+" },
  { icon: "bullhorn.png", title: "Marketing", jobs: "150+" },
  { icon: "hr.png", title: "Human Resources", jobs: "80+" },
  { icon: "data-entry.png", title: "Data Entry", jobs: "90+" },
  { icon: "hand.png", title: "Finance", jobs: "60+" },
  { icon: "increase.png", title: "Sales", jobs: "60+" },
  { icon: "design.png", title: "UI/UX", jobs: "60+" },
  { icon: "support.png", title: "Customer Support", jobs: "60+" },
  { icon: "writing.png", title: "Content Writer", jobs: "60+" },
  { icon: "microchip.png", title: "Artificial Intelligence", jobs: "60+" },
  { icon: "auction.png", title: "Legal", jobs: "60+" },
];

const JobCategory = () => {
  return (
    <div className="mt-20 pb-5">
      <div className="text-4xl text-center font-semibold mb-3 text-mine-shaft-100">
        Browse <span className="text-bright-sun-400">Job</span> Category
      </div>
      <div className="text-lg mx-auto text-mine-shaft-300 text-center w-1/2">
        Explore diverse job opportunities tailored to your skills. Start your career journey today!
      </div>
      {/* Category Grid */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-10 md:px-20">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-mine-shaft-900 p-5 rounded-xl border-2 border-transparent hover:border-bright-sun-400 hover:shadow-lg hover:shadow-bright-sun-400/20 hover:scale-105 transition-all duration-300 cursor-pointer group"
          >
            <div className="p-4 bg-bright-sun-300 rounded-full mb-3 group-hover:bg-bright-sun-400 transition-colors duration-300">
              <img
                className="h-8 w-8"
                src={`/Category/${cat.icon}`}
                alt={cat.title}
              />
            </div>
            <div className="text-white text-lg font-medium group-hover:text-bright-sun-400 transition-colors duration-300">
              {cat.title}
            </div>
            <div className="text-mine-shaft-300 text-sm group-hover:text-bright-sun-300 transition-colors duration-300">
              {cat.jobs} Jobs
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobCategory;