import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { login } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext"; // ✅ correct

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { setLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
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

    // Custom validation
    const newErrors = {};
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await login(formData);

      if (res?.status) {
        setLogin(res.user);
        navigate(res.dashboard);
      } else {
        setError(res?.message || "Login failed");
      }

    } catch (err) {
      console.error("Login error:", err);
      setError(err?.response?.data?.message || err?.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-green-800 mb-2">
              Amirthan <span className="text-yellow-500">Oil Mills</span>
            </h1>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Admin Login</h2>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className={`h-5 w-5 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:border-transparent outline-none transition-all ${
                      errors.email 
                        ? 'border-red-300 focus:ring-red-500 bg-red-50/10' 
                        : 'border-gray-300 focus:ring-green-500'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 font-semibold">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className={`w-full pl-10 pr-12 py-3 border rounded-md focus:ring-2 focus:border-transparent outline-none transition-all ${
                      errors.password 
                        ? 'border-red-300 focus:ring-red-500 bg-red-50/10' 
                        : 'border-gray-300 focus:ring-green-500'
                    }`}
                    placeholder="Enter your password"
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
                  <p className="mt-1 text-xs text-red-600 font-semibold">{errors.password}</p>
                )}
              </div>
            </div>

            {/* <div className="flex items-center justify-between mt-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                  Forgot password?
                </a>
              </div>
            </div> */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 bg-green-800 hover:bg-green-900 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-md transition-colors"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-green-600 hover:text-green-500 text-sm font-medium"
            >
              ← Back to Store
            </button>
          </div>          
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
