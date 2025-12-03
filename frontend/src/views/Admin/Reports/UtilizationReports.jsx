import React from "react";
import { useReportFilters } from "./useReportFilters";
import {
  ReportHeader,
  FilterSection,
  FilterGrid,
  SelectFilter,
  DateFilter,
  ActionButtons,
  StatCard,
  MiniStatCard
} from "./ReportComponents";

const UtilizationReports = () => {
  const {
    selectedType: selectedVehicle,
    setSelectedType: setSelectedVehicle,
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
  } = useReportFilters("ALL");

  const API_URL = "http://localhost:8080/api/reports/utilization";

  const handleGenerateReport = async () => {
    if (!validateDates()) return;
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}?vehicle=${selectedVehicle}&from=${startDate}&to=${endDate}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        }
      );

      if (!response.ok) throw new Error("Failed to fetch report data");

      const data = await response.json();
      setReportData(data);
      setShowResults(true);
    } catch (err) {
      console.error("Error loading report:", err);
      alert("Failed to load report. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const vehicleOptions = [
    { value: "ALL", label: "All" },
    { value: "MEDICAL", label: "Medical" },
    { value: "FIRE", label: "Fire" },
    { value: "POLICE", label: "Police" }
  ];

  return (
    <div className="space-y-6">
      <ReportHeader
        title="Utilization Reports"
        description="Vehicle usage and efficiency analysis"
      />

      <FilterSection>
        <FilterGrid>
          <SelectFilter
            label="Vehicle"
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            options={vehicleOptions}
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
          {reportData.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500">
              No utilization data available
            </div>
          ) : (
            reportData.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                <div className="space-y-3">
                  <StatCard
                    label="Utilization Rate"
                    value={`${item.utilizationRate}%`}
                    bgColor="bg-blue-50"
                    borderColor="border-blue-200"
                    textColor="text-blue-700"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <MiniStatCard
                      label="Hours Active"
                      value={item.hoursActive}
                      bgColor="bg-green-50"
                      borderColor="border-green-200"
                      textColor="text-green-700"
                    />
                    <MiniStatCard
                      label="Total Tasks"
                      value={item.totalTasks}
                      bgColor="bg-purple-50"
                      borderColor="border-purple-200"
                      textColor="text-purple-700"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UtilizationReports;