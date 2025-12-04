import React from 'react';
import { Filter, Search } from 'lucide-react';

export const ReportHeader = ({ title, description }) => (
  <div className="flex justify-between items-center">
    <div>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </div>
  </div>
);

export const FilterSection = ({ children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <span className="text-lg font-semibold text-gray-900">Report Filters</span>
      </div>
      {children}
    </div>
  </div>
);

export const FilterGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {children}
  </div>
);

export const SelectFilter = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export const DateFilter = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type="date"
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
    />
  </div>
);

export const ActionButtons = ({ onGenerate, onReset, loading }) => (
  <div className="flex gap-3 pt-4">
    <button
      onClick={onGenerate}
      disabled={loading}
      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Loading...
        </>
      ) : (
        <>
          <Search className="w-4 h-4" />
          Generate Report
        </>
      )}
    </button>
    <button
      onClick={onReset}
      className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
    >
      Reset
    </button>
  </div>
);

export const StatCard = ({ label, value, bgColor, borderColor, textColor }) => (
  <div className={`${bgColor} p-4 rounded-lg border ${borderColor}`}>
    <p className={`text-xs ${textColor}`}>{label}</p>
    <p className={`text-3xl font-bold ${textColor.replace('700', '900')}`}>{value}</p>
  </div>
);

export const MiniStatCard = ({ label, value, bgColor, borderColor, textColor }) => (
  <div className={`${bgColor} p-3 rounded-lg border ${borderColor}`}>
    <p className={`text-xs ${textColor}`}>{label}</p>
    <p className={`text-xl font-bold ${textColor.replace('700', '900')}`}>{value}</p>
  </div>
);