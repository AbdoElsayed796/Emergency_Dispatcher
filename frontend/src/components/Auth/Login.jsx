import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from 'lucide-react';
import axios from "axios";
const API_BASE_URL = "http://localhost:8080";
export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };
    const login = async (formData) => {
      console.log("Logging in with", formData);
        try {
            setLoading(true);
            setError('');
            const response = await axios.post(`${API_BASE_URL}/auth/login`, formData);
            console.log(response.data);
            if (response.data.success) {
                setSuccessMessage('Login successful! Redirecting...');
                setError('');
                setLoading(false);
                localStorage.setItem('token', response.data.token);
                setTimeout(() => {
                    const userRole = response.data.user.role;
                    switch (userRole) {
                        case 'DISPATCHER':
                            navigate('/dispatcher/dashboard');
                            break;
                        case 'RESPONDER':
                            navigate('/responder/dashboard');
                            break;
                        case 'ADMIN':
                            navigate('/admin/dashboard');
                            break;
                        default:
                            navigate('/');
                    }
                }, 500);
            }
            else {
                setLoading(false);
                setError(response.data.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'An error occurred during login.');
        } 
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData);
    }
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-blue-50 to-white">
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-pink-600 to-blue-800 p-12">
        <div className="flex flex-col gap-8 text-center text-white max-w-md">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto">
            <svg 
              className="w-8 h-8 text-white"
              fill="currentColor" 
              viewBox="0 0 48 48"
            >
              {/* Siren/Speaker Symbol */}
              <path d="M24 4C15.2 4 8 11.2 8 20v12c0 2.2 1.8 4 4 4h2v4h20v-4h2c2.2 0 4-1.8 4-4V20c0-8.8-7.2-16-16-16zm0 4c6.6 0 12 5.4 12 12v8H12v-8c0-6.6 5.4-12 12-12z" />
              {/* Alert dot */}
              <circle cx="24" cy="10" r="3" fill="#ff4444" />
            </svg>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-4xl font-bold">Emergency Dispatcher System</h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Efficiently manage emergency incidents and coordinate rapid response services.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
        <div className="w-full max-w-md flex flex-col gap-8">
          <div className="flex flex-col gap-4 lg:hidden">
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg 
                  className="w-7 h-7 text-blue-600"
                  fill="currentColor" 
                  viewBox="0 0 48 48"
                >
                  {/* Siren/Speaker Symbol */}
                  <path d="M24 4C15.2 4 8 11.2 8 20v12c0 2.2 1.8 4 4 4h2v4h20v-4h2c2.2 0 4-1.8 4-4V20c0-8.8-7.2-16-16-16zm0 4c6.6 0 12 5.4 12 12v8H12v-8c0-6.6 5.4-12 12-12z" />
                  {/* Alert dot */}
                  <circle cx="24" cy="10" r="3" fill="#ff4444" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 text-base">
              Log in to Get Started Helping Your Society.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-300 rounded-lg border-l-4 border-l-red-500">
                <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
            )}

            {/* Success Message */}
            {successMessage && (
            <div className="p-4 bg-green-50 border border-green-300 rounded-lg border-l-4 border-l-green-500">
                <p className="text-sm font-medium text-green-700">{successMessage}</p>
            </div>
            )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Email */}
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-700">Email Address</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder:text-gray-500 transition-all"
                placeholder="you@example.com"
              />
            </label>

            {/* Password */}
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-700">Password</span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-12 w-full px-4 pr-12 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder:text-gray-500 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-12 px-4 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </label>

            {/* Submit Button */}
            <button
            type="submit"
            disabled={loading}
            className="h-12 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center mt-2 shadow-md hover:shadow-lg"
            >
            {loading ? (
                <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Logging in...
                </>
            ) : (
                'Log In'
            )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-500 font-medium">or</span>
            </div>
          </div>

          {/* Sign up link */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Want to report an emergency?
              <Link 
                to="/" 
                className="ml-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Report an incident
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>);
}