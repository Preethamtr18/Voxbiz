import React, { useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";  // Adjust path if needed
import { API_BASE_URL } from '../lib/api';



// Toast Component
const Toast = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500';
  const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="font-medium">{message}</span>
        <button 
          onClick={onClose}
          className="ml-2 text-white/80 hover:text-white"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const Signin = () => {

  const { login , isAuthenticated } = useAuth();

  useEffect(() => {
    console.log("Auth check: ", login, "AuthContext:", isAuthenticated);
  }, []);

  // Mock navigate function for demo
 const navigate = useNavigate();

  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('english');
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // Validation states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Toast state
  const [toast, setToast] = useState({
    message: '',
    type: 'info',
    isVisible: false
  });

  const showToast = (message, type = 'info') => {
    setToast({
      message,
      type,
      isVisible: true
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };
  
  const [translations, setTranslations] = useState({
    googleSignIn: 'Sign in with Google',
    or: 'or',
    email: 'Email',
    password: 'Password',
    loginAccount: 'Login to your account',
    donotHaveAccount: 'Do not have an account?',
    signupHere: 'Signup Here',
    forgotPassword: 'Forgot Password?',
    oneClick: 'One click to go',
    allDigital: 'all accessing.',
    signingIn: 'Signing in...'
  });

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters long';
    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    setShowMenu(false);
    showToast(`Switched to ${newTheme} mode`, 'success');
  };

  const changeLanguage = async (newLanguage) => {
    setLanguage(newLanguage);
    
    if (newLanguage !== 'english') {
      // Translation logic would go here
      showToast(`Language changed to ${newLanguage}`, 'info');
    } else {
      setTranslations({
        googleSignIn: 'Sign in with Google',
        or: 'or',
        email: 'Email',
        password: 'Password',
        loginAccount: 'Login to your account',
        donotHaveAccount: 'Do not have an account?',
        signupHere: 'Signup Here',
        forgotPassword: 'Forgot Password?',
        oneClick: 'One click to go',
        allDigital: 'all accessing.',
        signingIn: 'Signing in...'
      });
    }
    
    setShowMenu(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ 
      ...prevState,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate on blur
    if (name === 'email') {
      const error = validateEmail(value);
      setErrors(prev => ({ ...prev, email: error }));
    } else if (name === 'password') {
      const error = validatePassword(value);
      setErrors(prev => ({ ...prev, password: error }));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
  const res = await fetch(`${API_BASE_URL}/api/auth/google-url`);
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Google Sign-in Error:", err);
      alert("Google Sign-in failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { email, password } = formData;
  
    if (!email || !password) {
      console.log("Please fill in all required fields");
      return;
    }
  
    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        // On success, navigate to dashboard or wherever
   
  
      console.log("Login successful!");
  
      setFormData({ email: "", password: "" });
      navigate("/dblist");
      }else {
        // Show error message from context login
        showToast(result.message || "Login failed", "error");
      }
    } catch (error) {
      console.error("Error:", error.message);
      console.log(error.message || "Login failed");
    }
  };

  // Theme-based styles
  const themeStyles = {
    dark: {
      bg: 'bg-black',
      cardBg: 'bg-white/5',
      text: 'text-white',
      textSecondary: 'text-gray-300',
      textMuted: 'text-gray-400',
      border: 'border-white/10',
      inputBg: 'bg-white/10',
      inputBorder: 'border-white/20',
      menuBg: 'bg-white/10',
      buttonBg: 'bg-white/10',
      buttonHover: 'hover:bg-white/20'
    },
    light: {
      bg: 'bg-gray-50',
      cardBg: 'bg-white',
      text: 'text-gray-900',
      textSecondary: 'text-gray-700',
      textMuted: 'text-gray-500',
      border: 'border-gray-200',
      inputBg: 'bg-gray-50',
      inputBorder: 'border-gray-300',
      menuBg: 'bg-white',
      buttonBg: 'bg-gray-100',
      buttonHover: 'hover:bg-gray-200'
    }
  };

  const currentTheme = themeStyles[theme];

  return (
    <div className={`${currentTheme.bg} w-screen h-screen flex items-center justify-center transition-colors duration-300`}>
      {/* Toast Component */}
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
      
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 ${theme === 'dark' ? 'bg-blue-500/5' : 'bg-blue-500/10'} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 ${theme === 'dark' ? 'bg-purple-500/5' : 'bg-purple-500/10'} rounded-full blur-3xl animate-pulse delay-1000`}></div>
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className={`${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.border} backdrop-blur-sm border p-2 rounded-lg transition-all duration-300 transform active:scale-95`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${currentTheme.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            
            {showMenu && (
              <div className={`absolute right-0 mt-2 w-40 rounded-xl shadow-lg py-2 ${currentTheme.menuBg} ${currentTheme.border} backdrop-blur-xl border z-50`}>
                <div className={`px-3 py-2 text-xs font-medium border-b ${currentTheme.border} text-cyan-400`}>Theme</div>
                <button
                  onClick={() => toggleTheme('light')}
                  className={`w-full text-left block px-3 py-2 text-sm ${currentTheme.textSecondary} ${currentTheme.buttonHover} transition-all duration-200 active:scale-95`}
                >
                  Light Mode
                </button>
                <button
                  onClick={() => toggleTheme('dark')}
                  className={`w-full text-left block px-3 py-2 text-sm ${currentTheme.textSecondary} ${currentTheme.buttonHover} transition-all duration-200 active:scale-95`}
                >
                  Dark Mode
                </button>
                
                <div className={`px-3 py-2 text-xs font-medium border-b border-t ${currentTheme.border} text-cyan-400 mt-2`}>Language</div>
                <button
                  onClick={() => changeLanguage('english')}
                  className={`w-full text-left block px-3 py-2 text-sm ${currentTheme.textSecondary} ${currentTheme.buttonHover} transition-all duration-200 active:scale-95`}
                >
                  English
                </button>
                <button     
                  onClick={() => changeLanguage('hindi')}
                  className={`w-full text-left block px-3 py-2 text-sm ${currentTheme.textSecondary} ${currentTheme.buttonHover} transition-all duration-200 active:scale-95`}
                >
                  Hindi
                </button>
                <button
                  onClick={() => changeLanguage('kannada')}
                  className={`w-full text-left block px-3 py-2 text-sm ${currentTheme.textSecondary} ${currentTheme.buttonHover} transition-all duration-200 active:scale-95`}
                >
                  Kannada
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Welcome Badge */}
        <div className="flex justify-center mb-4">
          <div className={`inline-flex items-center gap-2 ${currentTheme.cardBg} ${currentTheme.border} backdrop-blur-sm px-4 py-2 rounded-full border`}>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-cyan-400 font-medium text-sm">
              {"Welcome Back".split("").map((char, index) => (
                <span
                  key={index}
                  className="inline-block animate-bounce"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationDuration: '0.6s',
                    animationIterationCount: 'infinite'
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
          </div>
        </div>
        
        {/* Title */}
        <div className={`text-center ${currentTheme.text} mb-8`}>
          <h1 className="text-2xl md:text-3xl font-bold flex flex-wrap justify-center items-center gap-2">
            <span>
              {translations.oneClick.split("").map((char, index) => (
                <span
                  key={index}
                  className="inline-block animate-pulse"
                  style={{
                    animationDelay: `${index * 0.15}s`,
                    animationDuration: '1s',
                    animationIterationCount: 'infinite'
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              {translations.allDigital.split("").map((char, index) => (
                <span
                  key={index}
                  className="inline-block animate-bounce"
                  style={{
                    animationDelay: `${(index + translations.oneClick.length) * 0.12}s`,
                    animationDuration: '0.8s',
                    animationIterationCount: 'infinite'
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
          </h1>
        </div>

        {/* Login Form */}
        <div className={`${currentTheme.cardBg} ${currentTheme.border} backdrop-blur-xl p-6 rounded-2xl border shadow-xl`}>
          <h2 className={`text-xl font-bold ${currentTheme.text} text-center mb-6`}>{translations.loginAccount}</h2>
          
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={`flex items-center justify-center w-full ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.border} ${currentTheme.text} backdrop-blur-sm border rounded-xl py-2.5 px-4 mb-4 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                Loading...
              </div>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                    fill="#4285F4"
                  />
                </svg>
                {translations.googleSignIn}
              </>
            )}
          </button>
          
          <div className="flex items-center justify-center my-4">
            <div className={`border-t ${currentTheme.border} flex-grow`}></div>
            <span className={`px-3 ${currentTheme.textMuted} text-sm`}>{translations.or}</span>
            <div className={`border-t ${currentTheme.border} flex-grow`}></div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${currentTheme.textSecondary} mb-1`}>
                {translations.email}<span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                className={`w-full p-2.5 ${currentTheme.inputBg} ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : `${currentTheme.inputBorder} focus:border-cyan-400 focus:ring-cyan-400`} ${currentTheme.text} backdrop-blur-sm border rounded-lg placeholder-gray-400 focus:ring-1 transition-all duration-300`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${currentTheme.textSecondary} mb-1`}>
                {translations.password}<span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                name="password"
                className={`w-full p-2.5 ${currentTheme.inputBg} ${errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : `${currentTheme.inputBorder} focus:border-cyan-400 focus:ring-cyan-400`} ${currentTheme.text} backdrop-blur-sm border rounded-lg placeholder-gray-400 focus:ring-1 transition-all duration-300`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>
            
            <button 
              type="submit"
              onClick={handleSubmit}
           
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2.5 rounded-lg font-medium hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  {translations.signingIn}
                </div>
              ) : (
                translations.loginAccount
              )}
            </button>
          </div>

          <div className="mt-3 text-center">
            <button
              onClick={() => navigate('/forgot-password')}
              className="text-cyan-400 hover:text-cyan-300 font-medium text-sm transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              {translations.forgotPassword}
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <p className={`${currentTheme.textMuted} text-sm`}>
              {translations.donotHaveAccount}{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                {translations.signupHere}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;