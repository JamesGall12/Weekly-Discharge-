import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, UserX, Activity, ChevronUp, ChevronDown } from 'lucide-react';

const PractitionerDischargeDashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [averages, setAverages] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Read the CSV file
        const fileContent = await window.fs.readFile('Copy of Dashboard Data  Discharge  Data.csv', { encoding: 'utf8' });
        
        // Parse the CSV (skip first row title, use second row as headers)
        const lines = fileContent.trim().split('\n');
        const headerLine = lines[1];  
        const dataLines = lines.slice(2);
        const csvWithHeaders = [headerLine, ...dataLines].join('\n');
        
        // Dynamic import for Papa Parse
        const Papa = (await import('papaparse')).default;
        
        const parsedData = Papa.parse(csvWithHeaders, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          delimitersToGuess: [',', '\t', '|', ';']
        });

        // Clean and process the data
        const processedData = parsedData.data
          .filter(row => row['Practitioner '] && row['Practitioner '].trim() !== '')
          .map(row => ({
            practitioner: row['Practitioner '].trim(),
            patientPercent: parsePercentage(row['Patient Requested %']),
            practitionerPercent: parsePercentage(row['Practitioner Requested %']),
            totalPercent: parsePercentage(row['Total %']),
            appointments: row['Appointments'] || 0
          }))
          .filter(row => row.practitioner !== ''); // Remove any empty rows

        // Calculate averages
        const validData = processedData.filter(row => 
          !isNaN(row.patientPercent) || !isNaN(row.practitionerPercent) || !isNaN(row.totalPercent)
        );

        const patientAvg = validData.filter(row => !isNaN(row.patientPercent))
          .reduce((sum, row) => sum + row.patientPercent, 0) / 
          validData.filter(row => !isNaN(row.patientPercent)).length;

        const practitionerAvg = validData.filter(row => !isNaN(row.practitionerPercent))
          .reduce((sum, row) => sum + row.practitionerPercent, 0) / 
          validData.filter(row => !isNaN(row.practitionerPercent)).length;

        const totalAvg = validData.filter(row => !isNaN(row.totalPercent))
          .reduce((sum, row) => sum + row.totalPercent, 0) / 
          validData.filter(row => !isNaN(row.totalPercent)).length;

        setDashboardData(processedData);
        setOriginalData(processedData);
        setAverages({
          patient: patientAvg || 0,
          practitioner: practitionerAvg || 0,
          total: totalAvg || 0
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Helper function to parse percentage strings
  const parsePercentage = (value) => {
    if (!value || value === '#DIV/0!' || value === null) return NaN;
    if (typeof value === 'string') {
      return parseFloat(value.replace('%', ''));
    }
    return parseFloat(value);
  };

  // Helper function to format percentage for display
  const formatPercentage = (value) => {
    if (isNaN(value)) return '0.00%';
    return `${value.toFixed(2)}%`;
  };

  // Sort function
  const handleSort = (key) => {
    let direction = 'asc';
    
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...originalData].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      // Handle NaN values for percentage columns
      if (key !== 'practitioner') {
        aValue = isNaN(aValue) ? -1 : aValue;
        bValue = isNaN(bValue) ? -1 : bValue;
      }

      if (direction === 'asc') {
        if (typeof aValue === 'string') {
          return aValue.localeCompare(bValue);
        }
        return aValue - bValue;
      } else {
        if (typeof aValue === 'string') {
          return bValue.localeCompare(aValue);
        }
        return bValue - aValue;
      }
    });

    setDashboardData(sortedData);
    setSortConfig({ key, direction });
  };

  // Get sort icon
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-white" /> : 
      <ChevronDown className="w-4 h-4 text-white" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Greencare Practitioner Dashboard</h1>
          <p className="text-gray-600 text-lg">Practitioner Discharge Analysis & Performance Overview</p>
          <p className="text-gray-500 text-sm mt-2">Month of June 2025</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Average Patient Discharge Rate */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                AVG PATIENT DISCHARGE
              </div>
              <UserX className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {formatPercentage(averages.patient)}
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingDown className="w-4 h-4 mr-1" />
              Patient requested discharges
            </div>
          </div>

          {/* Average Practitioner Discharge Rate */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                AVG PRACTITIONER DISCHARGE
              </div>
              <Activity className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {formatPercentage(averages.practitioner)}
            </div>
            <div className="flex items-center text-yellow-600 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              Practitioner initiated
            </div>
          </div>

          {/* Total Discharge Rate */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                TOTAL DISCHARGE RATE
              </div>
              <Users className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {formatPercentage(averages.total)}
            </div>
            <div className="flex items-center text-red-600 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              Combined discharge rate
            </div>
          </div>

          {/* Active Practitioners */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                ACTIVE PRACTITIONERS
              </div>
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {dashboardData.length}
            </div>
            <div className="flex items-center text-purple-600 text-sm">
              <Activity className="w-4 h-4 mr-1" />
              Currently tracked
            </div>
          </div>
        </div>

        {/* Detailed Practitioner Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-indigo-600">
            <h2 className="text-2xl font-bold text-white mb-2">Practitioner Performance Analysis</h2>
            <p className="text-blue-100">Individual discharge rates and performance metrics</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-gray-700 font-semibold uppercase tracking-wide text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('practitioner')}
                  >
                    <div className="flex items-center justify-between">
                      Practitioner Name
                      {getSortIcon('practitioner')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-center text-gray-700 font-semibold uppercase tracking-wide text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('patientPercent')}
                  >
                    <div className="flex items-center justify-center">
                      Patient Discharge %
                      {getSortIcon('patientPercent')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-center text-gray-700 font-semibold uppercase tracking-wide text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('practitionerPercent')}
                  >
                    <div className="flex items-center justify-center">
                      Practitioner Discharge %
                      {getSortIcon('practitionerPercent')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-center text-gray-700 font-semibold uppercase tracking-wide text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('totalPercent')}
                  >
                    <div className="flex items-center justify-center">
                      Total Discharge %
                      {getSortIcon('totalPercent')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {dashboardData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 text-gray-800 font-medium text-lg">{row.practitioner}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-4 py-2 rounded-lg text-base font-semibold ${
                        isNaN(row.patientPercent) ? 'bg-gray-100 text-gray-600' :
                        row.patientPercent <= averages.patient ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {formatPercentage(row.patientPercent)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-4 py-2 rounded-lg text-base font-semibold ${
                        isNaN(row.practitionerPercent) ? 'bg-gray-100 text-gray-600' :
                        row.practitionerPercent <= averages.practitioner ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {formatPercentage(row.practitionerPercent)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-4 py-2 rounded-lg text-base font-semibold ${
                        isNaN(row.totalPercent) ? 'bg-gray-100 text-gray-600' :
                        row.totalPercent <= averages.total ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {formatPercentage(row.totalPercent)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer with benchmarks */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-700">Below Average (Good Performance)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-yellow-700">Above Average (Needs Attention)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-red-700">High Discharge Rate (Review Required)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            Dashboard automatically excludes practitioners with insufficient data for accurate averaging
          </p>
        </div>
      </div>
    </div>
  );
};

export default PractitionerDischargeDashboard;
