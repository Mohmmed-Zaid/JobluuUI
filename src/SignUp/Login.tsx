import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../Store/hooks";
import AuthService from "../Services/AuthService";
import ResetPassword from './ResetPassword';

interface LoginProps {
  onSwitchToSignup: () => void;
  onSwitchToResetPassword: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup, onSwitchToResetPassword }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success" | "info" | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showAccountTypeModal, setShowAccountTypeModal] = useState(false);
  const [googleCredential, setGoogleCredential] = useState("");
  const [googleInitialized, setGoogleInitialized] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Get authentication state from Redux store
  const { user, isAuthenticated } = useAppSelector((state) => state.user);

  // Initialize Google Sign-In
  useEffect(() => {
    const initGoogle = async () => {
      try {
        console.log('🔄 Initializing Google Sign-In for Login...');
        await AuthService.initializeGoogleAuth();
        setGoogleInitialized(true);
        console.log('✅ Google Sign-In initialized successfully for Login');
      } catch (error) {
        console.error('❌ Failed to initialize Google Auth for Login:', error);
        setGoogleInitialized(false);
      }
    };

    initGoogle();
  }, []);

  // Check for corrupted Redux persist state on component mount
  useEffect(() => {
    try {
      const persistedState = localStorage.getItem('persist:root');
      if (persistedState) {
        const parsed = JSON.parse(persistedState);
        if (parsed.user && typeof parsed.user === 'string' && parsed.user.startsWith('U2FsdGVkX1')) {
          console.log('🔧 Detected corrupted Redux persist state, clearing...');
          localStorage.clear();
          window.location.reload();
          return;
        }
      }
    } catch (e) {
      console.log('🔧 Error checking persist state, clearing localStorage...');
      localStorage.clear();
      window.location.reload();
    }
  }, []);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User is already authenticated, redirecting to home...');
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showMessage = (msg: string, type: "error" | "success" | "info") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      showMessage("Please fill in all fields.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }

    setIsLoading(true);
    showMessage("Logging in...", "info");

    try {
      await AuthService.login(formData, dispatch);
      showMessage("Login successful! Redirecting...", "success");
      
      setFormData({ email: "", password: "" });
      
      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (error: any) {
      console.error('❌ Login error:', error);
      let errorMessage = "Login failed. Please try again.";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      showMessage(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign-In button click with improved implementation
  const handleGoogleSignIn = async () => {
    console.log('🔄 Google Sign-In button clicked');
    console.log('Google initialized:', googleInitialized);
    console.log('AuthService initialized:', AuthService.isGoogleInitialized());

    if (!googleInitialized || !AuthService.isGoogleInitialized()) {
      showMessage("Google Sign-In is not available. Please try again later.", "error");
      return;
    }

    setGoogleLoading(true);
    showMessage("Opening Google Sign-In...", "info");

    try {
      console.log('🔄 Prompting Google Sign-In...');
      
      const timeoutId = setTimeout(() => {
        console.log('⏰ Google Sign-In timeout');
        setGoogleLoading(false);
        showMessage("Google Sign-In took too long. Please try again.", "error");
      }, 30000);
      
      AuthService.promptGoogleSignIn((response: any) => {
        clearTimeout(timeoutId);
        console.log('📨 Google Sign-In response received:', response);
        
        if (response.error) {
          console.error('❌ Google Sign-In error:', response.error);
          let errorMessage = "Google Sign-In failed.";
          
          switch (response.error) {
            case 'popup_closed_by_user':
              errorMessage = "Google Sign-In was cancelled.";
              break;
            case 'access_denied':
              errorMessage = "Access denied by Google.";
              break;
            case 'popup_blocked':
              errorMessage = "Pop-up was blocked. Please allow pop-ups and try again.";
              break;
            case 'failed_to_prompt':
            case 'failed_to_render_button':
              errorMessage = "Failed to open Google Sign-In. Please try again.";
              break;
            default:
              if (response.error.includes('network') || response.error.includes('failed')) {
                errorMessage = "Network error occurred. Please check your connection and try again.";
              }
              break;
          }
          
          showMessage(errorMessage, "error");
          setGoogleLoading(false);
          return;
        }

        if (response.credential) {
          console.log('✅ Google credential received successfully');
          setGoogleCredential(response.credential);
          setShowAccountTypeModal(true);
        } else {
          console.error('❌ No credential in Google response');
          showMessage("Google Sign-In failed. No credential received.", "error");
          setGoogleLoading(false);
        }
      });
    } catch (error: any) {
      console.error('❌ Google Sign-In error:', error);
      showMessage("Google Sign-In failed. Please try again or use email login.", "error");
      setGoogleLoading(false);
    }
  };

  // Handle account type selection for Google login
  const handleGoogleLogin = async (accountType: 'APPLICANT' | 'EMPLOYER') => {
    setShowAccountTypeModal(false);
    setGoogleLoading(true);
    showMessage("Signing in with Google...", "info");

    try {
      console.log('🔄 Processing Google login with account type:', accountType);
      
      await AuthService.loginWithGoogle(googleCredential, accountType, dispatch);
      showMessage("Google Sign-In successful! Redirecting...", "success");
      
      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (error: any) {
      console.error('❌ Google login error:', error);
      let errorMessage = "Google Sign-In failed. Please try again.";
      
      if (error.message) {
        if (error.message.includes('CORS')) {
          errorMessage = "Server configuration issue. Please try again later or use email login.";
        } else if (error.message.includes('Network') || error.message.includes('fetch')) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      showMessage(errorMessage, "error");
    } finally {
      setGoogleLoading(false);
      setGoogleCredential("");
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowAccountTypeModal(false);
    setGoogleCredential("");
    setGoogleLoading(false);
  };

  const openReset = () => setResetOpen(true);
  const closeReset = () => setResetOpen(false);

  return (
    <>
      <motion.form
        key="login"
        initial={{ x: 500, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -500, opacity: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 bg-mine-shaft-950/70 p-8 rounded-xl border border-mine-shaft-850 shadow-2xl backdrop-blur-sm"
      >
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Welcome Back!</h2>
          <p className="text-sm text-gray-400">Sign in to your Jobluu account.</p>
        </div>

        {/* Message Notification */}
        {message && (
          <div
            className={`px-4 py-2 rounded-lg text-sm font-medium animate-fade-in-down ${
              messageType === "error"
                ? "bg-red-600 text-white"
                : messageType === "success"
                ? "bg-green-600 text-white"
                : messageType === "info"
                ? "bg-blue-600 text-white"
                : "bg-gray-600 text-white"
            } shadow-md`}
          >
            {message}
          </div>
        )}

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading || googleLoading}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {googleLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-2"></div>
              {showAccountTypeModal ? "Signing in..." : "Connecting to Google..."}
            </div>
          ) : !googleInitialized ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-2"></div>
              Loading Google Sign-In...
            </div>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-mine-shaft-950 text-gray-400">Or continue with email</span>
          </div>
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="login-email" className="text-sm text-gray-300 mb-1 block">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="login-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading || googleLoading}
            placeholder="you@example.com"
            className="w-full px-4 py-3 bg-transparent border border-mine-shaft-850 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="login-password" className="text-sm text-gray-300 mb-1 block">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="login-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading || googleLoading}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-transparent border border-mine-shaft-850 rounded-md text-white placeholder-gray-500 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={togglePassword}
              disabled={isLoading || googleLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading || googleLoading}
          className={`w-full py-3 font-semibold rounded-md transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
            isLoading || googleLoading
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-yellow-500 text-black hover:bg-yellow-400 hover:shadow-lg"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400 mr-2"></div>
              Logging in...
            </div>
          ) : (
            "Login"
          )}
        </button>

        {/* Forgot Password Link */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={openReset}
            disabled={isLoading || googleLoading}
            className="text-sm text-bright-sun-400 hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Forgot Password?
          </button>
        </div>

        {/* Link to Signup Page */}
        <p className="text-center text-sm text-gray-400 mt-4">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            disabled={isLoading || googleLoading}
            className="text-yellow-400 underline hover:text-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign Up
          </button>
        </p>
      </motion.form>

      {/* Account Type Selection Modal for Google Sign-In */}
      {showAccountTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-mine-shaft-950 p-6 rounded-xl border border-mine-shaft-850 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Select Account Type</h3>
            <p className="text-gray-400 mb-6 text-sm">
              Choose how you want to use Jobluu:
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleGoogleLogin('APPLICANT')}
                disabled={googleLoading}
                className="w-full py-3 px-4 border border-mine-shaft-800 rounded-lg text-left text-white hover:bg-mine-shaft-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="font-medium">Job Seeker</div>
                <div className="text-sm text-gray-400">I'm looking for job opportunities</div>
              </button>
              <button
                onClick={() => handleGoogleLogin('EMPLOYER')}
                disabled={googleLoading}
                className="w-full py-3 px-4 border border-mine-shaft-800 rounded-lg text-left text-white hover:bg-mine-shaft-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="font-medium">Employer</div>
                <div className="text-sm text-gray-400">I want to hire candidates</div>
              </button>
            </div>
            <button
              onClick={handleModalClose}
              disabled={googleLoading}
              className="w-full mt-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      <ResetPassword opened={resetOpen} close={closeReset} />
    </>
  );
};

export default Login;