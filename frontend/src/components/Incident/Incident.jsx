import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export default function Incident() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'FIRE',
    severity_level: 'MEDIUM',
    location: '',
    latitude: '',
    longitude: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [locationError, setLocationError] = useState('');

  const incidentTypes = ['FIRE', 'POLICE', 'MEDICAL'];
  const severityLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  // Get user's current location
  const handleGetLocation = () => {
    setLocationError('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          }));
        },
        (error) => {
          setLocationError('Unable to access your location. Please enable location services.');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.type || !formData.severity_level) {
      setError('Please select incident type and severity level');
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      setError('Please provide incident location');
      return;
    }
    // if (!formData.description) {
    //   setError('Please provide a description of the incident');
    //   return;
    // }
    
    try {
      setLoading(true);
      setError('');
      
      const incidentData = {
        type: formData.type,
        severityLevel: formData.severity_level,
        location: {
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude)
        }
      };

      console.log('Submitting incident data:', incidentData);
      console.log("POINT = " + incidentData.location.latitude + " " + incidentData.location.longitude);

      const response = await axios.post(`${API_BASE_URL}/incidents/add`, incidentData);
      
      if (response.data.success || response.status === 201) {
        setSuccessMessage('Incident reported successfully! Help is on the way.');
        setFormData({
          type: 'FIRE',
          severity_level: 'MEDIUM',
          location: '',
          latitude: '',
          longitude: '',
          description: ''
        });

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report incident. Please try again.');
      console.error('Incident report error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-600 via-blue-800 to-indigo-600 flex items-center justify-center py-8 px-4 relative overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Main Content Container */}
      <div className="w-full max-w-2xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-md rounded-full p-4 animate-bounce">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 drop-shadow-lg">Report an Emergency</h1>
          <p className="text-white/90 text-lg drop-shadow-md">Quickly report an emergency incident. Our dispatch team will respond immediately.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-10 border border-white/20 animate-scale-in min-w-[360px] sm:min-w-[420px] md:min-w-[480px] flex-shrink-0">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md animate-shake">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-md animate-pulse">
              <p className="text-sm font-medium text-green-700">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Incident Type */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Incident Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-gray-900 font-medium transition-all hover:border-pink-300"
              >
                {incidentTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-600">Select the type of emergency you're reporting</p>
            </div>

            {/* Severity Level */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <label className="block text-sm font-bold text-gray-800 mb-4">
                Severity Level <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-3">
                {severityLevels.map((level, index) => (
                  <label key={level} className="relative cursor-pointer" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                    <input
                      type="radio"
                      name="severity_level"
                      value={level}
                      checked={formData.severity_level === level}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`p-3 rounded-xl border-2 text-center font-bold transition-all duration-300 transform hover:scale-105 ${
                      formData.severity_level === level
                        ? level === 'LOW' ? 'border-green-500 bg-green-100 text-green-700 shadow-lg scale-105' :
                          level === 'MEDIUM' ? 'border-yellow-500 bg-yellow-100 text-yellow-700 shadow-lg scale-105' :
                          level === 'HIGH' ? 'border-orange-500 bg-orange-100 text-orange-700 shadow-lg scale-105' :
                          'border-red-500 bg-red-100 text-red-700 shadow-lg scale-105'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-pink-400'
                    }`}>
                      <div className="text-sm">
                        {level}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-600">Assess how urgent this emergency is</p>
            </div>

            {/* Location */}
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Incident Location <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  name="location"
                  value={(formData.latitude!='' || formData.longitude!= '')?(formData.latitude+', '+formData.longitude):formData.location}
                  onChange={handleChange}
                  placeholder="Location (auto-filled when using GPS)"
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-gray-900 placeholder:text-gray-500 transition-all"
                  readOnly
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  <MapPin size={18} />
                  <span className="hidden sm:inline">Use GPS</span>
                </button>
              </div>

              {locationError && (
                <p className="text-sm text-red-600 mb-3 animate-pulse">{locationError}</p>
              )}

              {/* Latitude and Longitude */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  min={-90}
                  max={90}
                  onChange={handleChange}
                  placeholder="Latitude"
                  step="0.000001"
                  className="px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-gray-900 placeholder:text-gray-500 transition-all"
                />
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                    min={-180}
                    max={180}
                  placeholder="Longitude"
                  step="0.000001"
                  className="px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-gray-900 placeholder:text-gray-500 transition-all"
                />
              </div>
              <p className="mt-2 text-xs text-gray-600">Or manually enter coordinates</p>
            </div>

            {/* Description */}
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Description of Incident 
                {/* <span className="text-red-500">*</span> */}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed information about the incident (people involved, injuries, hazards, etc.)"
                rows="5"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-gray-900 placeholder:text-gray-500 transition-all resize-none"
              />
              <p className="mt-2 text-xs text-gray-600">Be as detailed as possible to help responders prepare</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-700 text-white font-bold text-lg rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 animate-slide-up"
              style={{ animationDelay: '0.5s' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Submitting Emergency Report...</span>
                </>
              ) : (
                <>
                  <AlertCircle size={22} />
                  <span>Report Emergency Now</span>
                </>
              )}
            </button>
          </form>

          {/* Required Fields Note */}
          <p className="mt-8 text-xs text-gray-600 text-center font-medium">
            All fields marked with <span className="text-red-500 font-bold">*</span> are required. Your location data will help us dispatch responders faster.
          </p>

          <p className="mt-4 text-sm text-center text-gray-700">
            have an account ?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="inline-block text-blue-600 font-semibold hover:underline ml-1"
            >
              Login
            </button>
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}