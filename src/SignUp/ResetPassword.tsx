import React, { useState, useRef, useEffect } from "react";
import { X, Mail, ArrowRight, Shield, Check, RotateCcw, Lock, Eye, EyeOff } from "lucide-react";

interface ResetPasswordProps {
  opened: boolean;
  close: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ opened, close }) => {
  const [step, setStep] = useState<'email' | 'otp' | 'newPassword' | 'success'>('email');
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success" | "info" | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const showMessage = (msg: string, type: "error" | "success" | "info") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  const handleEmailSubmit = async () => {
    if (!email) {
      showMessage("Please enter your email address.", "error");
      return;
    }

    setIsLoading(true);
    showMessage("Sending OTP to your email...", "info");

    try {
      const response = await fetch(`http://localhost:8080/api/users/sendOTP/${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success || response.ok) {
        showMessage("OTP sent successfully! Check your email.", "success");
        setStep('otp');
        setCountdown(300);
        
        setTimeout(() => {
          if (otpInputRefs.current[0]) {
            otpInputRefs.current[0].focus();
          }
        }, 500);
      } else {
        throw new Error(data.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      console.error('Send OTP error:', error);
      const errorMessage = error?.message || "Failed to send OTP. Please try again.";
      showMessage(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = otpInputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const prevInput = otpInputRefs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
        }
      }
    }
    
    if (e.key === 'ArrowLeft' && index > 0) {
      const prevInput = otpInputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
    
    if (e.key === 'ArrowRight' && index < 5) {
      const nextInput = otpInputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const otpString = otp.join('');
      if (otpString.length === 6) {
        handleOtpSubmit();
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (digits.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < digits.length && i < 6; i++) {
        newOtp[i] = digits[i];
      }
      setOtp(newOtp);
      
      const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
      if (otpInputRefs.current[focusIndex]) {
        otpInputRefs.current[focusIndex].focus();
      }
    }
  };

  const handleOtpSubmit = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      showMessage("Please enter the complete 6-digit OTP.", "error");
      return;
    }

    setIsLoading(true);
    showMessage("Verifying OTP...", "info");

    try {
      const response = await fetch(`http://localhost:8080/api/users/verifyOtp/${email}/${otpString}`);
      const data = await response.json();
      
      if (data.success || response.ok) {
        showMessage("OTP verified successfully!", "success");
        setTimeout(() => {
          setStep('newPassword');
        }, 1000);
      } else {
        throw new Error(data.message || 'Invalid OTP');
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      const errorMessage = error?.message || "Invalid OTP. Please try again.";
      showMessage(errorMessage, "error");
      
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => {
        if (otpInputRefs.current[0]) {
          otpInputRefs.current[0].focus();
        }
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      showMessage("Please fill in both password fields.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage("Passwords do not match.", "error");
      return;
    }

    if (newPassword.length < 6) {
      showMessage("Password must be at least 6 characters long.", "error");
      return;
    }

    setIsLoading(true);
    showMessage("Updating password...", "info");

    try {
      const response = await fetch(`http://localhost:8080/api/users/changePass`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: newPassword
        })
      });
      
      const data = await response.json();
      
      if (data.success || response.ok) {
        showMessage("Password updated successfully!", "success");
        setStep('success');
        
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        throw new Error(data.message || 'Failed to update password');
      }
    } catch (error: any) {
      console.error('Password change error:', error);
      const errorMessage = error?.message || "Failed to update password. Please try again.";
      showMessage(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handlePasswordSubmit();
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    showMessage("Resending OTP...", "info");

    try {
      const response = await fetch(`http://localhost:8080/api/users/sendOTP/${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success || response.ok) {
        showMessage("New OTP sent successfully!", "success");
        setOtp(["", "", "", "", "", ""]);
        setCountdown(300);
        setTimeout(() => {
          if (otpInputRefs.current[0]) {
            otpInputRefs.current[0].focus();
          }
        }, 100);
      } else {
        throw new Error(data.message || 'Failed to resend OTP');
      }
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      const errorMessage = error?.message || "Failed to resend OTP. Please try again.";
      showMessage(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('email');
    setEmail("");
    setOtp(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
    setMessageType("");
    setCountdown(0);
    setShowPassword(false);
    setShowConfirmPassword(false);
    close();
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtp(["", "", "", "", "", ""]);
    setMessage("");
    setMessageType("");
    setCountdown(0);
  };

  const handleBackToOtp = () => {
    setStep('otp');
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setMessage("");
    setMessageType("");
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!opened) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden max-w-md w-full max-h-[90vh] overflow-y-auto transition-all duration-300 transform scale-100 opacity-100"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 border-b border-gray-700/50 p-6">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-lg"
          >
            <X size={20} />
          </button>
          
          {(step === 'otp' || step === 'newPassword') && (
            <button
              onClick={step === 'otp' ? handleBackToEmail : handleBackToOtp}
              className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-lg"
            >
              <ArrowRight size={20} className="rotate-180" />
            </button>
          )}
          
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-colors ${
              step === 'success' 
                ? 'bg-gradient-to-br from-green-400 to-green-500' 
                : step === 'newPassword'
                ? 'bg-gradient-to-br from-blue-400 to-blue-500'
                : 'bg-gradient-to-br from-yellow-400 to-yellow-500'
            }`}>
              {step === 'success' ? (
                <Check className="w-6 h-6 text-white" />
              ) : step === 'newPassword' ? (
                <Lock className="w-6 h-6 text-white" />
              ) : (
                <Shield className="w-6 h-6 text-black" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {step === 'email' && 'Reset Password'}
                {step === 'otp' && 'Verify OTP'}
                {step === 'newPassword' && 'New Password'}
                {step === 'success' && 'Success!'}
              </h3>
              <p className="text-sm text-gray-400">
                {step === 'email' && 'Secure account recovery'}
                {step === 'otp' && 'Check your email for OTP'}
                {step === 'newPassword' && 'Create a strong password'}
                {step === 'success' && 'Password reset complete'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Message Notification */}
          {message && (
            <div
              className={`px-4 py-3 rounded-xl text-sm font-medium mb-6 border transition-all duration-300 ${
                messageType === "error"
                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                  : messageType === "success"
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : messageType === "info"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  : "bg-gray-500/10 text-gray-400 border-gray-500/20"
              }`}
            >
              <div className="flex items-center justify-center">
                {message}
              </div>
            </div>
          )}

          {/* Email Step */}
          {step === 'email' && (
            <div className="transition-all duration-300">
              <div className="mb-6">
                <p className="text-gray-400 text-sm leading-relaxed">
                  Enter your email address and we'll send you a 6-digit OTP to reset your password.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-yellow-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all duration-300"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleEmailSubmit();
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    We'll send an OTP to this email address
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-3 px-4 border border-gray-600 text-gray-300 font-medium rounded-xl hover:bg-gray-700/50 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleEmailSubmit}
                    disabled={isLoading || !email}
                    className={`flex-1 py-3 px-4 font-semibold rounded-xl transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/50 ${
                      isLoading || !email
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 hover:scale-105 shadow-yellow-400/25"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>{isLoading ? "Sending..." : "Send OTP"}</span>
                      {!isLoading && email && <ArrowRight size={16} />}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <div className="transition-all duration-300">
              <div className="mb-6">
                <p className="text-gray-400 text-sm leading-relaxed mb-2">
                  We've sent a 6-digit OTP to <span className="text-yellow-400 font-medium">{email}</span>
                </p>
                <p className="text-gray-500 text-xs">
                  Please check your inbox and enter the code below.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">
                    Enter 6-Digit OTP
                  </label>
                  <div className="flex justify-center space-x-2" onPaste={handleOtpPaste}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpInputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl font-bold bg-gray-700/50 border-2 border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all duration-300 hover:border-gray-500"
                        style={{ caretColor: 'transparent' }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    You can paste the OTP directly or press Enter to verify
                  </p>
                </div>

                {/* Countdown and Resend */}
                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-gray-400">
                      Resend OTP in <span className="font-mono text-yellow-400">{formatCountdown(countdown)}</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="text-sm text-yellow-400 hover:text-yellow-300 font-medium transition-colors duration-300 hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                    >
                      <RotateCcw size={14} />
                      <span>Resend OTP</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleOtpSubmit}
                  disabled={isLoading || otp.join('').length !== 6}
                  className={`w-full py-3 px-4 font-semibold rounded-xl transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/50 ${
                    isLoading || otp.join('').length !== 6
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 hover:scale-105 shadow-yellow-400/25"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>{isLoading ? "Verifying..." : "Verify OTP"}</span>
                    {!isLoading && otp.join('').length === 6 && <ArrowRight size={16} />}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* New Password Step */}
          {step === 'newPassword' && (
            <div className="transition-all duration-300">
              <div className="mb-6">
                <p className="text-gray-400 text-sm leading-relaxed">
                  Create a new strong password for your account.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="new-password" className="text-sm font-medium text-gray-300">
                    New Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onKeyDown={handlePasswordKeyDown}
                      placeholder="Enter new password"
                      className="w-full pl-12 pr-12 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-sm font-medium text-gray-300">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyDown={handlePasswordKeyDown}
                      placeholder="Confirm new password"
                      className="w-full pl-12 pr-12 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Press Enter to update password</p>
                </div>

                <button
                  type="button"
                  onClick={handlePasswordSubmit}
                  disabled={isLoading || !newPassword || !confirmPassword}
                  className={`w-full py-3 px-4 font-semibold rounded-xl transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 ${
                    isLoading || !newPassword || !confirmPassword
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 hover:scale-105 shadow-blue-400/25"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>{isLoading ? "Updating..." : "Update Password"}</span>
                    {!isLoading && newPassword && confirmPassword && <ArrowRight size={16} />}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="text-center py-8 transition-all duration-500">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Password Reset Complete!</h4>
              <p className="text-gray-400 text-sm">
                Your password has been successfully updated. You can now log in with your new password.
              </p>
            </div>
          )}

          {step !== 'success' && (
            <div className="mt-6 pt-6 border-t border-gray-700/50">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors duration-300 hover:underline"
                  >
                    Back to Sign In
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    );
};

export default ResetPassword;