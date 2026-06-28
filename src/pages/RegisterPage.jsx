import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react';
import { register } from '../api/auth';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setLogin } = useAuth();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    email: location.state?.email || '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { name, email, password } = formData;
      const res = await register({ name, email, password });

      if (res?.token) {
        setLogin(res.user);
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else {
        setError(res?.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err?.response?.data?.message || err?.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-green-50 via-white to-yellow-50/30 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/10 w-72 h-72 bg-green-200/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 right-1/10 w-72 h-72 bg-yellow-200/10 rounded-full blur-3xl -z-10"></div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 transition-all duration-300 hover:shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-green-800 tracking-tight mb-2">
              அமிர்தன் <span className="text-yellow-500">ஆயில் மில்ஸ்</span>
            </h1>
            <p className="text-sm text-gray-500 font-medium">Create your account to start shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-md animate-shake">
                <p className="font-semibold">Error</p>
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className={`h-5 w-5 transition-colors ${errors.name ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:border-transparent transition-all outline-none bg-gray-50/50 focus:bg-white ${
                      errors.name 
                        ? 'border-red-300 focus:ring-red-550 bg-red-50/10' 
                        : 'border-gray-200 focus:ring-green-500'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-600 font-semibold animate-fadeIn">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:border-transparent transition-all outline-none bg-gray-50/50 focus:bg-white ${
                      errors.email 
                        ? 'border-red-300 focus:ring-red-550 bg-red-50/10' 
                        : 'border-gray-200 focus:ring-green-500'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-600 font-semibold animate-fadeIn">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-2.5 border rounded-xl focus:ring-2 focus:border-transparent transition-all outline-none bg-gray-50/50 focus:bg-white ${
                      errors.password 
                        ? 'border-red-300 focus:ring-red-550 bg-red-50/10' 
                        : 'border-gray-200 focus:ring-green-500'
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-600 font-semibold animate-fadeIn">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 transition-colors ${errors.confirmPassword ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-2.5 border rounded-xl focus:ring-2 focus:border-transparent transition-all outline-none bg-gray-50/50 focus:bg-white ${
                      errors.confirmPassword 
                        ? 'border-red-300 focus:ring-red-550 bg-red-50/10' 
                        : 'border-gray-200 focus:ring-green-500'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-600 font-semibold animate-fadeIn">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 bg-green-800 hover:bg-green-900 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" state={{ from: location.state?.from }} className="font-semibold text-green-700 hover:text-green-800 transition-colors inline-flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" /> Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
