import React from "react";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
  IconMail,
  IconPhone,
  IconMapPin,
  IconArrowUp,
  IconExternalLink,
} from "@tabler/icons-react";
import footerLinks from "../LandingPage/Data/footerLinks";
import owlLogo from "../assets/owl.png";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative mt-20 bg-mine-shaft-950 text-white overflow-hidden">
      <div className="relative px-6 sm:px-16 pt-16 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Logo & Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-bright-sun-400">
                <div className="w-14 h-14 bg-bright-sun-400/10 rounded-xl flex items-center justify-center border border-bright-sun-400 shadow-inner">
                  <img
                    src={owlLogo}
                    alt="Owl Logo"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="text-3xl font-bold">Jobluu</div>
              </div>

              <p className="text-slate-300 text-base leading-relaxed">
                Your gateway to career success. Connect with opportunities,
                showcase your skills, and build your professional future.
              </p>

              <div className="space-y-3 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <IconMail size={18} />
                  <span>mohmmedzaid05@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconPhone size={18} />
                  <span>+91 7350165052</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconMapPin size={18} />
                  <span>Pune, Maharashtra</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconExternalLink size={18} />
                  <a
                    href="https://mohmmedzaid-portfolio.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-bright-sun-400 transition-colors"
                  >
                    Portfolio
                  </a>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex gap-3 pt-2">
                {[IconBrandFacebook, IconBrandInstagram, IconBrandX].map(
                  (Icon, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 flex items-center justify-center bg-mine-shaft-800 text-slate-400 rounded-lg hover:bg-bright-sun-400 hover:text-mine-shaft-950 transition-all duration-300"
                    >
                      <Icon size={20} />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Footer Link Sections */}
            {footerLinks.map((section, i) => (
              <div key={i} className="space-y-6">
                <h4 className="text-xl font-bold tracking-wide text-bright-sun-400 relative">
                  {section.title}
                  <div className="absolute -bottom-2 left-0 w-12 h-1 bg-bright-sun-400/50 rounded-full"></div>
                </h4>
                <ul className="space-y-3">
                  {section.links.map((item, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="text-slate-300 hover:text-bright-sun-400 transition duration-200 text-base relative group"
                      >
                        {item}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-bright-sun-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer Bottom */}
          <div className="mt-16 pt-8 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
              <div>© {new Date().getFullYear()} Jobluu. All rights reserved.</div>
              <div className="flex gap-6">
                <a href="#" className="hover:text-bright-sun-400 transition">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-bright-sun-400 transition">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-bright-sun-400 transition">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute bottom-8 right-8 p-3 bg-bright-sun-400 text-slate-900 rounded-full hover:bg-bright-sun-300 transition hover:scale-110 shadow-md"
        title="Scroll to top"
      >
        <IconArrowUp size={22} />
      </button>
    </div>
  );
};

export default Footer;
