import React, { useState } from 'react';
import { IconMapPin, IconGlobe, IconUsers, IconBuilding, IconMail, IconCurrencyDollar, IconStar, IconBookmark, IconSearch } from '@tabler/icons-react';

interface Job {
  title: string;
  company: string;
  logo: string;
  level: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  applicants: number;
  postedDaysAgo: number;
}

interface Employee {
  id: number;
  avatar: string;
  name: string;
  title: string;
  skills: string[];
  description: string;
  expectedSalary: string;
  location: string;
  experienceLevel: string; 
}

interface CompanyInfo {
  name: string;
  logo: string;
  employees: string;
}

const CompanyPage = () => {
  const [activeTab, setActiveTab] = useState('About');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample company data
  const companyData = {
    name: "Google",
    logo: "https://placehold.co/96x96/4285f4/ffffff?text=G",
    location: "San Francisco, CA",
    overview: "Google is a leading technology company specializing in innovative software development and digital transformation services. We help businesses leverage cutting-edge technology to achieve their goals and stay ahead in the competitive market.",
    industry: "Technology & Software Development",
    website: "https://google.com",
    founded: "2018",
    employees: "100000+",
    description: "At Google, we believe in the power of technology to transform businesses and create meaningful impact. Our team of expert developers, designers, and strategists work together to deliver exceptional solutions that drive growth and innovation."
  };

  // Company directory data
  const companiesDirectory: CompanyInfo[] = [
    { name: "Adobe", logo: "https://placehold.co/40x40/ff0000/ffffff?text=A", employees: "25000+" },
    { name: "Apple", logo: "https://placehold.co/40x40/000000/ffffff?text=🍎", employees: "150000+" },
    { name: "App Store", logo: "https://placehold.co/40x40/007aff/ffffff?text=AS", employees: "5000+" },
    { name: "ChatGPT", logo: "https://placehold.co/40x40/00a67e/ffffff?text=CG", employees: "800+" },
    { name: "Discord", logo: "https://placehold.co/40x40/5865f2/ffffff?text=D", employees: "600+" },
    { name: "Facebook", logo: "https://placehold.co/40x40/1877f2/ffffff?text=F", employees: "77000+" },
    { name: "IBM", logo: "https://placehold.co/40x40/1f70c1/ffffff?text=IBM", employees: "345000+" },
    { name: "Microsoft", logo: "https://placehold.co/40x40/00a1f1/ffffff?text=MS", employees: "220000+" },
    { name: "Nike", logo: "https://placehold.co/40x40/000000/ffffff?text=✓", employees: "75000+" },
    { name: "Sony", logo: "https://placehold.co/40x40/000000/ffffff?text=SONY", employees: "109000+" },
    { name: "Stripe", logo: "https://placehold.co/40x40/635bff/ffffff?text=S", employees: "4000+" },
    { name: "Twitter", logo: "https://placehold.co/40x40/000000/ffffff?text=X", employees: "2000+" },
    { name: "Unity", logo: "https://placehold.co/40x40/000000/ffffff?text=U", employees: "7000+" }
  ];

  const filteredCompanies = companiesDirectory.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sample jobs data
  const jobsData = [
    {
      title: "Senior Software Engineer",
      company: "Google",
      logo: "https://placehold.co/40x40/4285f4/ffffff?text=G",
      level: "Senior",
      location: "San Francisco",
      type: "Full-time",
      experience: "5+ years",
      salary: "$120k - $150k",
      description: "Join our engineering team to build scalable web applications using React, Node.js, and cloud technologies. Work on challenging projects that impact millions of users worldwide.",
      applicants: 45,
      postedDaysAgo: 3
    },
    {
      title: "Product Manager",
      company: "Google",
      logo: "https://placehold.co/40x40/4285f4/ffffff?text=G",
      level: "Mid-level",
      location: "Remote",
      type: "Full-time",
      experience: "3+ years",
      salary: "$90k - $120k",
      description: "Lead product development initiatives and work closely with engineering and design teams to deliver innovative solutions that meet customer needs.",
      applicants: 32,
      postedDaysAgo: 5
    },
    {
      title: "UX Designer",
      company: "Google",
      logo: "https://placehold.co/40x40/4285f4/ffffff?text=G",
      level: "Mid-level",
      location: "San Francisco",
      type: "Full-time",
      experience: "3+ years",
      salary: "$80k - $110k",
      description: "Design intuitive user experiences for our web and mobile applications. Collaborate with product and engineering teams to create beautiful, functional interfaces.",
      applicants: 28,
      postedDaysAgo: 7
    },
    {
      title: "Data Scientist",
      company: "Google",
      logo: "https://placehold.co/40x40/4285f4/ffffff?text=G",
      level: "Senior",
      location: "Remote",
      type: "Full-time",
      experience: "4+ years",
      salary: "$110k - $140k",
      description: "Analyze complex datasets and build machine learning models to drive business insights and improve our products. Work with cutting-edge AI technologies.",
      applicants: 38,
      postedDaysAgo: 2
    }
  ];

  // Sample employees data
  const employeesData = [
    {
      id: 1,
      avatar: "https://placehold.co/48x48/4f4f4f/ffffff?text=JD",
      name: "John Doe",
      title: "Senior Software Engineer",
      skills: ["React", "Node.js", "Python", "AWS"],
      description: "Passionate full-stack developer with 6+ years of experience building scalable web applications. Love working with cutting-edge technologies and mentoring junior developers.",
      expectedSalary: "$130k",
      location: "San Francisco",
      experienceLevel: "Senior"
    },
    {
      id: 2,
      avatar: "https://placehold.co/48x48/4f4f4f/ffffff?text=JS",
      name: "Jane Smith",
      title: "Product Manager",
      skills: ["Product Strategy", "Agile", "Analytics", "Leadership"],
      description: "Results-driven product manager with expertise in leading cross-functional teams to deliver innovative products that delight customers and drive business growth.",
      expectedSalary: "$105k",
      location: "Remote",
      experienceLevel: "Mid-level"
    },
    {
      id: 3,
      avatar: "https://placehold.co/48x48/4f4f4f/ffffff?text=AB",
      name: "Alex Brown",
      title: "UX Designer",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
      description: "Creative UX designer focused on creating intuitive and accessible user experiences. Experienced in design thinking and user-centered design methodologies.",
      expectedSalary: "$95k",
      location: "San Francisco",
      experienceLevel: "Mid-level"
    },
    {
      id: 4,
      avatar: "https://placehold.co/48x48/4f4f4f/ffffff?text=MW",
      name: "Michael Wilson",
      title: "Data Scientist",
      skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
      description: "Data scientist specializing in machine learning and predictive analytics. Passionate about using data to solve complex business problems and drive innovation.",
      expectedSalary: "$125k",
      location: "Remote",
      experienceLevel: "Senior"
    },
    {
      id: 5,
      avatar: "https://placehold.co/48x48/4f4f4f/ffffff?text=EJ",
      name: "Emily Johnson",
      title: "Marketing Manager",
      skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
      description: "Strategic marketing professional with expertise in digital marketing campaigns and brand management. Proven track record of driving customer acquisition and engagement.",
      expectedSalary: "$85k",
      location: "San Francisco",
      experienceLevel: "Mid-level"
    },
    {
      id: 6,
      avatar: "https://placehold.co/48x48/4f4f4f/ffffff?text=RD",
      name: "Robert Davis",
      title: "DevOps Engineer",
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
      description: "DevOps engineer focused on building robust infrastructure and deployment pipelines. Experienced in cloud technologies and automation tools.",
      expectedSalary: "$115k",
      location: "Remote",
      experienceLevel: "Senior"
    }
  ];

  const JobCard: React.FC<{ job: Job }> = ({ job }) => (
    <div className="bg-mine-shaft-950 p-4 rounded-2xl text-white shadow-lg w-80 h-72 flex flex-col justify-between transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-yellow-400/20 border border-slate-700 hover:border-yellow-400/50 group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center p-1 group-hover:bg-slate-600 transition-colors">
            <img 
              src={job.logo}
              alt={job.company}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="text-sm font-bold leading-tight text-white group-hover:text-yellow-400 transition-colors">
              {job.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {job.company} • {job.level}
            </p>
          </div>
        </div>
        <IconBookmark 
          size={18} 
          className="text-slate-400 hover:text-yellow-400 cursor-pointer transition-colors duration-200 hover:scale-110" 
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="bg-slate-700/60 text-slate-300 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-600">
          {job.type}
        </span>
        <span className="bg-slate-700/60 text-slate-300 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-600">
          {job.location}
        </span>
        <span className="bg-slate-700/60 text-slate-300 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-600">
          {job.experience}
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-3 line-clamp-3 leading-relaxed flex-grow">
        {job.description}
      </p>

      <div className="flex justify-between items-center text-xs mb-3 pb-3 border-b border-slate-700">
        <span className="text-emerald-400 font-medium bg-emerald-400/10 px-2 py-1 rounded-full">
          {job.applicants} applicants
        </span>
        <span className="text-slate-400">
          {job.postedDaysAgo}d ago
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-yellow-400 font-bold text-sm bg-yellow-400/10 px-3 py-1.5 rounded-full">
          {job.salary}
        </span>
        <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs font-bold px-4 py-2 rounded-full hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 shadow-lg hover:shadow-yellow-400/30 transform hover:scale-105">
          Apply Now
        </button>
      </div>
    </div>
  );

  const EmployeeCard: React.FC<{ employee: Employee }> = ({ employee }) => (
    <div className="group relative bg-mine-shaft-950 p-4 rounded-2xl text-white shadow-xl w-[18rem] h-[18rem] flex flex-col justify-between transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20 border border-slate-700 hover:border-yellow-400/50 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-yellow-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-slate-600 group-hover:border-yellow-400 transition-colors duration-300 shadow-lg"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-mine-shaft-950 animate-pulse" />
          </div>
          
          <div>
            <h3 className="text-base font-bold leading-tight text-white group-hover:text-yellow-400 transition-colors duration-300">
              {employee.name}
            </h3>
            <p className="text-sm text-slate-400 font-medium mt-0.5">
              {employee.title}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <IconStar size={12} className="text-yellow-400" />
              <span className="text-xs text-slate-400">{employee.experienceLevel}</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <IconMail 
            size={20} 
            className="text-yellow-400 cursor-pointer hover:text-yellow-300 transition-all duration-300 hover:scale-110 drop-shadow-lg" 
          />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap gap-1.5 mt-3 min-h-[24px]">
        {employee.skills.slice(0, 4).map((skill, index) => (
          <span 
            key={index} 
            className="bg-slate-800 hover:bg-slate-600/70 px-2.5 py-1 rounded-full text-xs text-slate-300 hover:text-white transition-all duration-300 backdrop-blur-sm border border-slate-600/50 hover:border-yellow-400/50"
          >
            {skill}
          </span>
        ))}
        {employee.skills.length > 4 && (
          <span className="bg-yellow-400/20 text-yellow-400 px-2.5 py-1 rounded-full text-xs font-medium border border-yellow-400/30">
            +{employee.skills.length - 4} more
          </span>
        )}
      </div>

      <div className="relative z-10 flex-1 mt-3">
        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed overflow-hidden">
          {employee.description}
        </p>
      </div>

      <div className="relative z-10 flex justify-between items-center mt-3 p-2 bg-slate-800/50 rounded-lg backdrop-blur-sm border border-slate-700/50">
        <div className="flex items-center gap-1.5">
          <IconMapPin size={14} className="text-emerald-400" />
          <span className="text-xs text-emerald-400 font-medium">{employee.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <IconCurrencyDollar size={14} className="text-yellow-400" />
          <span className="text-xs text-yellow-400 font-bold">
            {employee.expectedSalary}
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-3">
        <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/30 active:scale-95 transform">
          View Profile
        </button>
      </div>
    </div>
  );

  const CompanyCard: React.FC<{ company: CompanyInfo }> = ({ company }) => (
    <div className="bg-mine-shaft-950 p-3 rounded-lg border border-slate-700 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/10 group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center p-1 group-hover:bg-slate-600 transition-colors">
          <img 
            src={company.logo}
            alt={company.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors truncate">
            {company.name}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {company.employees} employees
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-mine-shaft-950 text-white flex">
      {/* Main Content */}
      <div className="flex-1">
        {/* Banner */}
        <div className="relative h-64 overflow-hidden">
          <img
            src="https://placehold.co/1200x256/1f2937/ffffff?text=Company+Banner"
            alt="Company Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-mine-shaft-950 via-mine-shaft-950/50 to-transparent" />
        </div>

        {/* Company Header */}
        <div className="bg-mine-shaft-950 p-8 -mt-32 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 bg-slate-800 rounded-2xl flex items-center justify-center p-2 shadow-lg border border-slate-700">
                <img
                  src={companyData.logo}
                  alt={companyData.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-2">{companyData.name}</h1>
                <div className="flex items-center gap-4 text-slate-400">
                  <div className="flex items-center gap-2">
                    <IconMapPin size={18} className="text-emerald-400" />
                    <span>{companyData.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconUsers size={18} className="text-yellow-400" />
                    <span>{companyData.employees} employees</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-mine-shaft-950 border-b border-slate-700">
          <div className="max-w-6xl mx-auto px-8">
            <div className="flex space-x-8">
              {['About', 'Jobs', 'Employees'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 font-semibold transition-all duration-300 border-b-2 ${
                    activeTab === tab
                      ? 'border-yellow-400 text-yellow-400'
                      : 'border-transparent text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-6xl mx-auto p-8">
          {activeTab === 'About' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-mine-shaft-950 p-6 rounded-2xl border border-slate-700">
                  <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                    <IconBuilding size={24} />
                    Overview
                  </h2>
                  <p className="text-slate-300 leading-relaxed">
                    {companyData.overview}
                  </p>
                  <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <p className="text-slate-400 text-sm">
                      {companyData.description}
                    </p>
                  </div>
                </div>

                <div className="bg-mine-shaft-950 p-6 rounded-2xl border border-slate-700">
                  <h2 className="text-2xl font-bold text-yellow-400 mb-4">Company Details</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <IconBuilding size={18} className="text-emerald-400" />
                      <span className="text-slate-400">Industry:</span>
                      <span className="text-white font-medium">{companyData.industry}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <IconGlobe size={18} className="text-blue-400" />
                      <span className="text-slate-400">Website:</span>
                      <a 
                        href={companyData.website} 
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {companyData.website}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <IconUsers size={18} className="text-purple-400" />
                      <span className="text-slate-400">Company Size:</span>
                      <span className="text-white font-medium">{companyData.employees} employees</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <IconStar size={18} className="text-yellow-400" />
                      <span className="text-slate-400">Founded:</span>
                      <span className="text-white font-medium">{companyData.founded}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-mine-shaft-950 p-6 rounded-2xl border border-slate-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">Our Mission</h2>
                <p className="text-slate-300 leading-relaxed text-lg">
                  We strive to create innovative solutions that empower businesses to thrive in the digital age. 
                  Our commitment to excellence, collaboration, and continuous learning drives us to deliver 
                  exceptional results for our clients and create meaningful opportunities for our team members.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'Jobs' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Open Positions</h2>
                <p className="text-slate-400">Join our team and help us build the future of technology</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {jobsData.map((job, index) => (
                  <JobCard key={index} job={job} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Employees' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Our Team</h2>
                <p className="text-slate-400">Meet the talented individuals who make our success possible</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {employeesData.map((employee) => (
                  <EmployeeCard key={employee.id} employee={employee} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Companies Directory Sidebar */}
      <div className="w-80 bg-mine-shaft-950 border-l border-slate-700 p-6 overflow-y-auto max-h-screen">
        <div className="sticky top-0 bg-mine-shaft-950 pb-4">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">Companies Directory</h2>
          <div className="relative">
            <IconSearch size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 text-white rounded-lg pl-10 pr-4 py-2 text-sm border border-slate-700 focus:border-yellow-400 focus:outline-none transition-colors"
            />
          </div>
        </div>
        
        <div className="space-y-3">
          {filteredCompanies.map((company, index) => (
            <CompanyCard key={index} company={company} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
