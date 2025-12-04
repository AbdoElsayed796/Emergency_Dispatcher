import React from "react";
import { Award, Clock } from "lucide-react";
import { useReportFilters } from "./useReportFilters";
import {
  ReportHeader,
  FilterSection,
  FilterGrid,
  SelectFilter,
  DateFilter,
  ActionButtons
} from "./ReportComponents";

const TopPerformingUnits = () => {
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
  } = useReportFilters("ALL");

  const API_URL = "http://localhost:8080/api/reports/top-performing";

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

      if (!response.ok) throw new Error("Failed to fetch report data");
      const data = await response.json();
      console.log(response);
      setReportData(data);
      setShowResults(true);
    } catch (err) {
      console.error("Error loading report:", err);
      alert("Failed to load report. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    const badges = {
      1: { bg: "bg-yellow-100", border: "border-yellow-300", text: "text-yellow-800", icon: "🥇" },
      2: { bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-800", icon: "🥈" },
      3: { bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-800", icon: "🥉" }
    };
    return badges[rank] || { bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-800", icon: "🏅" };
  };

  const typeOptions = [
    { value: "ALL", label: "All" },
    { value: "FIRE", label: "Fire" },
    { value: "MEDICAL", label: "Medical" },
    { value: "POLICE", label: "Police" }
  ];

  return (
    <div className="space-y-6">
      <ReportHeader
        title="Top Performing Units"
        description="Responders and stations with the best average response times"
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
        <div className="space-y-4">
          {reportData.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No data available
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Response Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.map((unit, idx) => {
                      const rank = idx + 1;
                      const badge = getRankBadge(rank);
  
                      // Optional: color badge for avgResponseTime
                      const responseTimeColor =
                        unit.avgResponseTime <= 5
                          ? "bg-green-100 text-green-800"
                          : unit.avgResponseTime <= 10
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800";
  
                      return (
                        <tr
                          key={unit.vehicle?.id || idx}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${badge.bg} ${badge.border} border`}
                            >
                              <span className="text-lg">{badge.icon}</span>
                              <span className={`font-bold ${badge.text}`}>
                                #{rank}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-gray-400" />
                              <span className="font-semibold text-gray-900">
                                {unit.vehicle?.responderName || "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {unit.vehicle?.type || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-600" />
                              <span
                                className={`font-semibold px-2 py-1 rounded-full ${responseTimeColor}`}
                              >
                                {unit.avgResponseTime ?? "N/A"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
  
};

export default TopPerformingUnits;