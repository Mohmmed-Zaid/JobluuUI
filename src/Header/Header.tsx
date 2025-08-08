import React, { useState } from "react";
import { IconSettings, IconMenu2, IconX } from "@tabler/icons-react";
import owlLogo from "../assets/owl.png";
import NavLinks from "./NavLinks";
import ProfileMenu from "./ProfileMenu";
import NotificationBell from "../notifications/NotificationBell";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-mine-shaft-950 text-white font-poppins">
      <div className="h-20 flex justify-between items-center px-4 md:px-6">
        
        {/* Logo + Brand */}
        <div className="flex gap-2 items-center text-yellow-400 flex-shrink-0">
          <img src={owlLogo} alt="Jobluu logo" className="h-12 w-12 md:h-14 md:w-14" />
          <div className="text-2xl md:text-3xl font-semibold">Jobluu</div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex">
          <NavLinks />
        </div>

        {/* Icons + User (Desktop) */}
        <div className="hidden md:flex gap-5 items-center font-roboto">
          <ProfileMenu />
          <div className="bg-mine-shaft-900 p-1.5 rounded-full hover:bg-mine-shaft-800 transition-colors">
            <IconSettings stroke={1.5} className="cursor-pointer" />
          </div>
          <NotificationBell />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <NotificationBell />
          <button
            className="p-2 rounded-md hover:bg-mine-shaft-900 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-mine-shaft-900 border-t border-mine-shaft-800">
          <div className="flex flex-col gap-4 p-4">
            <NavLinks />
            <div className="flex items-center justify-between pt-2 border-t border-mine-shaft-800">
              <ProfileMenu />
              <div className="bg-mine-shaft-900 p-1.5 rounded-full hover:bg-mine-shaft-800 transition-colors">
                <IconSettings stroke={1.5} className="cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
