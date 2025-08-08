import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../Store/hooks";
import AuthService from "../Services/AuthService";
import { signupValidation } from "../Services/FormValidation";

interface SignupProps {
  onSwitchToLogin: () => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountType: "APPLICANT" | "EMPLOYER";
  termsAccepted: boolean;
}

const Signup: React.FC<SignupProps> = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "APPLICANT",
    termsAccepted: false,
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success" | "info" | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showAccountTypeModal, setShowAccountTypeModal] = useState(false);
  const [googleCredential, setGoogleCredential] = useState("");
  const [googleInitialized, setGoogleInitialized] = useState(false);
  const [initializationRetries, setInitializationRetries] = useState(0);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Get authentication state from Redux store
  const { user, isAuthenticated } = useAppSelector((state) => state.user);

  // Initialize Google Sign-In with better error handling
  useEffect(() => {
    const initGoogle = async () => {
      try {
        console.log('🔄 Initializing Google Sign-In...');
        setGoogleLoading(true);
        
        await AuthService.initializeGoogleAuth();
        
        setGoogleInitialized(true);
        setInitializationRetries(0);
        console.log('✅ Google Sign-In initialized successfully');
        
        showMessage("Google Sign-In is ready!", "success");
      } catch (error) {
        console.error('❌ Failed to initialize Google Auth:', error);
        setGoogleInitialized(false);
        
        // Retry initialization up to 3 times
        if (initializationRetries < 3) {
          console.log(`🔄 Retrying Google Auth initialization... (${initializationRetries + 1}/3)`);
          setInitializationRetries(prev => prev + 1);
          setTimeout(() => {
            initGoogle();
          }, 2000 * (initializationRetries + 1)); // Exponential backoff
        } else {
          console.error('❌ Max retries reached for Google Auth initialization');
          showMessage("Google Sign-In is currently unavailable. Please use email registration.", "info");
        }
      } finally {
        setGoogleLoading(false);
      }
    };

    initGoogle();
  }, [initializationRetries]);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User is already authenticated, redirecting to home...');
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Toggle password visibility
  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  // Handle input changes with validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Validate on change for text inputs
    if (type !== "checkbox" && typeof newValue === "string") {
      try {
        const validationError = signupValidation(name, newValue);
        if (validationError) {
          setErrors((prev) => ({ ...prev, [name]: validationError }));
        }
      } catch (error) {
        console.warn('Validation function not available:', error);
      }
    }
  };

  // Handle account type selection
  const handleAccountTypeChange = (accountType: "APPLICANT" | "EMPLOYER") => {
    setFormData((prev) => ({ ...prev, accountType }));
  };

  // Show message with auto-clear
  const showMessage = (msg: string, type: "error" | "success" | "info") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 6000);
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    try {
      if (typeof signupValidation === 'function') {
        const nameError = signupValidation("name", formData.name);
        const emailError = signupValidation("email", formData.email);
        const passwordError = signupValidation("password", formData.password);
        
        if (nameError) newErrors.name = nameError;
        if (emailError) newErrors.email = emailError;
        if (passwordError) newErrors.password = passwordError;
      } else {
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.password.trim()) newErrors.password = "Password is required";
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
        }
        
        if (formData.password && formData.password.length < 6) {
          newErrors.password = "Password must be at least 6 characters long";
        }
      }
    } catch (error) {
      console.warn('Validation error:', error);
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      if (!formData.password.trim()) newErrors.password = "Password is required";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    }
    
    if (!formData.termsAccepted) {
      newErrors.terms = "Please accept the terms and conditions!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showMessage("Please fix the errors below!", "error");
      return;
    }

    setIsLoading(true);
    showMessage("Creating your account...", "info");

    try {
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmpassword: formData.confirmPassword,
        accountType: formData.accountType
      };

      console.log('Submitting signup data:', signupData);

      await AuthService.register(signupData, dispatch);
      
      showMessage("Account created successfully! Redirecting to home...", "success");
      
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        accountType: "APPLICANT",
        termsAccepted: false,
      });
      setErrors({});

      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = error?.message || "Registration failed. Please try again.";
      showMessage(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign-Up button click with improved error handling
  const handleGoogleSignUp = async () => {
    console.log('🔄 Google Sign-Up button clicked');
    console.log('Google initialized:', googleInitialized);
    console.log('Google available:', !!window.google);
    console.log('AuthService initialized:', AuthService.isGoogleInitialized());

    if (!googleInitialized || !AuthService.isGoogleInitialized()) {
      if (initializationRetries >= 3) {
        showMessage("Google Sign-In is currently unavailable. Please try email registration instead.", "error");
      } else {
        showMessage("Google Sign-In is still loading. Please wait a moment and try again.", "info");
      }
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
          let errorMessage = "Google Sign-Up failed.";
          
          switch (response.error) {
            case 'popup_closed_by_user':
              errorMessage = "Google Sign-Up was cancelled.";
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
          showMessage("Google Sign-Up failed. No credential received.", "error");
          setGoogleLoading(false);
        }
      });
    } catch (error: any) {
      console.error('❌ Google Sign-Up error:', error);
      showMessage("Google Sign-Up failed. Please try again or use email registration.", "error");
      setGoogleLoading(false);
    }
  };

  // Handle account type selection for Google signup
  const handleGoogleSignup = async (accountType: 'APPLICANT' | 'EMPLOYER') => {
    setShowAccountTypeModal(false);
    setGoogleLoading(true);
    showMessage("Creating account with Google...", "info");

    try {
      console.log('🔄 Processing Google signup with account type:', accountType);
      
      await AuthService.loginWithGoogle(googleCredential, accountType, dispatch);
      showMessage("Account created successfully! Redirecting to home...", "success");
      
      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (error: any) {
      console.error('❌ Google signup error:', error);
      let errorMessage = "Google Sign-Up failed. Please try again.";
      
      if (error.message) {
        if (error.message.includes('CORS')) {
          errorMessage = "Server configuration issue. Please try again later or use email registration.";
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

  const getGoogleButtonText = () => {
    if (googleLoading) {
      return showAccountTypeModal ? "Creating account..." : "Connecting to Google...";
    }
    if (!googleInitialized) {
      return initializationRetries > 0 
        ? `Loading... (Retry ${initializationRetries}/3)` 
        : 'Loading Google Sign-In...';
    }
    return 'Sign up with Google';
  };

  const getGoogleButtonIcon = () => {
    if (googleLoading || !googleInitialized) {
      return (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-2"></div>
      );
    }
    
    return (
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    );
  };

  return (
    <motion.form
      key="signup"
      initial={{ x: -500, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 500, opacity: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-6 bg-mine-shaft-950/70 p-8 rounded-xl border border-mine-shaft-850 shadow-2xl backdrop-blur-sm overflow-hidden"
      style={{ maxHeight: '90vh' }}
    >
      <div>
        <h2 className="text-3xl font-bold text-white mb-1">Create Account</h2>
        <p className="text-sm text-gray-400">Start your journey with Jobluu today.</p>
      </div>

      {/* Message Notification */}
      {message && (
        <div
          className={`px-4 py-3 rounded-lg text-sm font-medium animate-fade-in-down ${
            messageType === "error" 
              ? "bg-red-600/90 text-white border border-red-500" 
              : messageType === "success" 
              ? "bg-green-600/90 text-white border border-green-500" 
              : messageType === "info"
              ? "bg-blue-600/90 text-white border border-blue-500"
              : "bg-gray-600/90 text-white border border-gray-500"
          } shadow-md backdrop-blur-sm`}
        >
          {message}
        </div>
      )}

      {/* Google Sign-Up Button */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={isLoading || googleLoading}
        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center">
          {getGoogleButtonIcon()}
          {getGoogleButtonText()}
        </div>
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-mine-shaft-950 text-gray-400">Or create account with email</span>
        </div>
      </div>

      <div className="space-y-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {/* Account Type Selection */}
        <div>
          <label className="text-sm text-gray-300 mb-2 block font-medium">
            Account Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleAccountTypeChange("APPLICANT")}
              disabled={isLoading || googleLoading}
              className={`flex-1 py-3 px-4 border rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                formData.accountType === "APPLICANT"
                  ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                  : "border-mine-shaft-800 text-gray-300 hover:bg-mine-shaft-900"
              }`}
            >
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => handleAccountTypeChange("EMPLOYER")}
              disabled={isLoading || googleLoading}
              className={`flex-1 py-3 px-4 border rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                formData.accountType === "EMPLOYER"
                  ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                  : "border-mine-shaft-800 text-gray-300 hover:bg-mine-shaft-900"
              }`}
            >
              Employer
            </button>
          </div>
        </div>

        {/* Full Name Input */}
        <div>
          <label htmlFor="name" className="text-sm text-gray-300 mb-1 block">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading || googleLoading}
            placeholder="Your full name"
            className={`w-full px-4 py-3 bg-transparent border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.name ? "border-red-500" : "border-mine-shaft-850"
            }`}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="text-sm text-gray-300 mb-1 block">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading || googleLoading}
            placeholder="you@example.com"
            className={`w-full px-4 py-3 bg-transparent border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.email ? "border-red-500" : "border-mine-shaft-850"
            }`}
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="text-sm text-gray-300 mb-1 block">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading || googleLoading}
              placeholder="••••••••"
              className={`w-full px-4 py-3 bg-transparent border rounded-md text-white placeholder-gray-500 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.password ? "border-red-500" : "border-mine-shaft-850"
              }`}
            />
            <button
              type="button"
              onClick={togglePassword}
              disabled={isLoading || googleLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* Confirm Password Input */}
        <div>
          <label htmlFor="confirmPassword" className="text-sm text-gray-300 mb-1 block">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading || googleLoading}
              placeholder="••••••••"
              className={`w-full px-4 py-3 bg-transparent border rounded-md text-white placeholder-gray-500 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.confirmPassword ? "border-red-500" : "border-mine-shaft-850"
              }`}
            />
            <button
              type="button"
              onClick={toggleConfirmPassword}
              disabled={isLoading || googleLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="termsAccepted"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            required
            disabled={isLoading || googleLoading}
            className="accent-yellow-400 w-4 h-4 mt-0.5 rounded-sm focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <label htmlFor="termsAccepted" className="text-sm text-gray-300">
            I accept the{" "}
            <a href="#" className="text-yellow-400 underline hover:text-yellow-300">
              terms & conditions
            </a>
          </label>
        </div>
        {errors.terms && <p className="text-red-400 text-xs mt-1">{errors.terms}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || googleLoading}
        className={`w-full py-3 mt-4 font-semibold rounded-md transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
          isLoading || googleLoading
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-yellow-500 text-black hover:bg-yellow-400"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400 mr-2"></div>
            Creating Account...
          </div>
        ) : (
          "Sign Up"
        )}
      </button>

      {/* Login Link */}
      <p className="text-center text-sm text-gray-400 mt-3">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          disabled={isLoading || googleLoading}
          className="text-yellow-400 underline hover:text-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Login
        </button>
      </p>

      {/* Account Type Selection Modal for Google Sign-Up */}
{showAccountTypeModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] backdrop-blur-sm">
    <div className="bg-mine-shaft-950 p-6 rounded-xl border border-mine-shaft-850 max-w-sm w-full mx-4 shadow-2xl">
      <h3 className="text-xl font-bold text-white mb-4">Select Account Type</h3>
      <p className="text-gray-400 mb-6 text-sm">
        Choose how you want to use Jobluu:
      </p>
      <div className="space-y-3">
        {/* Job Seeker Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Job Seeker clicked!'); // Debug
            if (typeof handleGoogleSignup === 'function') {
              handleGoogleSignup('APPLICANT');
            } else {
              console.error('handleGoogleSignup is not defined');
            }
          }}
          className="w-full py-3 px-4 border border-mine-shaft-800 rounded-lg text-left text-white bg-transparent hover:bg-mine-shaft-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <div className="font-medium">Job Seeker</div>
          <div className="text-sm text-gray-400">I'm looking for job opportunities</div>
        </button>

        {/* Employer Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Employer clicked!'); // Debug
            if (typeof handleGoogleSignup === 'function') {
              handleGoogleSignup('EMPLOYER');
            } else {
              console.error('handleGoogleSignup is not defined');
            }
          }}
          className="w-full py-3 px-4 border border-mine-shaft-800 rounded-lg text-left text-white bg-transparent hover:bg-mine-shaft-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <div className="font-medium">Employer</div>
          <div className="text-sm text-gray-400">I want to hire candidates</div>
        </button>
      </div>
      
      {/* Cancel Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Cancel clicked!'); // Debug
          if (typeof handleModalClose === 'function') {
            handleModalClose();
          } else if (typeof setShowAccountTypeModal === 'function') {
            setShowAccountTypeModal(false);
          } else {
            console.error('No close function available');
          }
        }}
        className="w-full mt-4 py-2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 bg-transparent border-none"
      >
        Cancel
      </button>
    </div>
  </div>
)}
    </motion.form>
  );
};

export default Signup;
