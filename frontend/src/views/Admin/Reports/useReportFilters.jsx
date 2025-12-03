import { useState } from 'react';

export const useReportFilters = (initialType = 'ALL') => {
  const [selectedType, setSelectedType] = useState(initialType);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const validateDates = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return false;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert('Start date cannot be after end date');
      return false;
    }
    return true;
  };

  const reset = () => {
    setSelectedType(initialType);
    setStartDate('');
    setEndDate('');
    setReportData([]);
    setShowResults(false);
  };

  return {
    selectedType,
    setSelectedType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    loading,
    setLoading,
    reportData,
    setReportData,
    showResults,
    setShowResults,
    validateDates,
    reset
  };
};
