import React from 'react';
import { useReportFilters } from './useReportFilters';
import {
  ReportHeader,
  FilterSection,
  FilterGrid,
  SelectFilter,
  DateFilter,
  ActionButtons,
  StatCard,
  MiniStatCard
} from './ReportComponents';

const ResponseTimeReports = () => {
  const {
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
  } = useReportFilters('ALL');

  const API_URL = "http://localhost:8080/api/reports/response-time";

  const handleGenerateReport = async () => {
    if (!validateDates()) return;
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}?type=${selectedType}&from=${startDate}&to=${endDate}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch report data");
      }

      const data = await response.json();
      setReportData(data);
      setShowResults(true);
    } catch (error) {
      console.error("Error loading report:", error);
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = [
    { value: 'ALL', label: 'All' },
    { value: 'FIRE', label: 'Fire' },
    { value: 'MEDICAL', label: 'Medical' },
    { value: 'POLICE', label: 'Police' }
  ];

  return (
    <div className="space-y-6">
      <ReportHeader
        title="Response Time Reports"
        description="Analysis of emergency response performance"
      />

      <FilterSection>
        <FilterGrid>
          <SelectFilter
            label="Emergency Type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            options={typeOptions}
          />
          <DateFilter
            label="From Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <DateFilter
            label="To Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </FilterGrid>
        <ActionButtons
          onGenerate={handleGenerateReport}
          onReset={reset}
          loading={loading}
        />
      </FilterSection>

      {showResults && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportData.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.type}</h3>
                </div>
              </div>

              <div className="space-y-4">
                <StatCard
                  label="Average Response Time"
                  value={item.avg}
                  bgColor="bg-blue-50"
                  borderColor="border-blue-200"
                  textColor="text-blue-700"
                />

                <div className="grid grid-cols-2 gap-3">
                  <MiniStatCard
                    label="Minimum"
                    value={item.min}
                    bgColor="bg-green-50"
                    borderColor="border-green-200"
                    textColor="text-green-700"
                  />
                  <MiniStatCard
                    label="Maximum"
                    value={item.max}
                    bgColor="bg-red-50"
                    borderColor="border-red-200"
                    textColor="text-red-700"
                  />
                </div>

                <p className="text-sm text-gray-700">
                  Total Incidents: <span className="font-semibold">{item.total}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResponseTimeReports;