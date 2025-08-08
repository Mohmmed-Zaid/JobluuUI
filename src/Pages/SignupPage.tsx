import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Import the separated Login and Signup components
import Login from "../SignUp/Login";
import Signup from "../SignUp/SignUp";

const SignupPage: React.FC = () => {
  // State to determine which form is currently displayed: true for Login, false for Signup.
  const [isLogin, setIsLogin] = useState(false);

  // Callback function to switch to the Login form.
  const handleSwitchToLogin = () => setIsLogin(true);
  // Callback function to switch to the Signup form.
  const handleSwitchToSignup = () => setIsLogin(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-mine-shaft-950 text-white font-sans relative overflow-hidden">
      {/* Left Panel - JobHook Branding */}
      {/* This panel remains static and displays the brand name. */}
      <div className="w-full md:w-1/2 flex justify-center items-center relative p-10 z-10 bg-gradient-to-tr from-[#191919] to-[#0e0e0e]">
        {/* Decorative pulsating blur effect for visual appeal. */}
        <div className="absolute top-0 left-0 w-[150%] h-[150%] bg-yellow-500/10 blur-[150px] opacity-70 z-0 rounded-full -translate-x-1/4 -translate-y-1/3 rotate-12 animate-pulse"></div>
        <h1 className="z-10 text-6xl font-extrabold text-yellow-400 text-center drop-shadow-xl tracking-tight leading-tight">
          Jobluu
        </h1>
      </div>

      {/* Right Panel - Form Container with Animation */}
      {/* This panel dynamically renders either the Login or Signup form with animations. */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-8 md:p-16 z-10 relative">
        {/* AnimatePresence enables exit animations for components that are removed from the DOM. */}
        {/* mode="wait" ensures the outgoing component's exit animation completes before the new component's entry animation begins. */}
        <AnimatePresence mode="wait">
          {isLogin ? (
            // Render the Login component if isLogin is true.
            // Pass the onSwitchToSignup callback to allow switching back to signup.
            <Login onSwitchToSignup={handleSwitchToSignup} />
          ) : (
            // Render the Signup component if isLogin is false.
            // Pass the onSwitchToLogin callback to allow switching to login.
            <Signup onSwitchToLogin={handleSwitchToLogin} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignupPage;
