<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Greencare Practitioner Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .header h1 {
            font-size: 2.5rem;
            color: #1f2937;
            margin-bottom: 10px;
        }
        
        .header p {
            color: #6b7280;
            font-size: 1.1rem;
            margin-bottom: 5px;
        }
        
        .header .date {
            color: #9ca3af;
            font-size: 0.9rem;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .metric-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border: 1px solid #e5e7eb;
        }
        
        .metric-header {
            display: flex;
            justify-content: between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .metric-title {
            color: #6b7280;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .metric-value {
            font-size: 2rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 10px;
        }
        
        .metric-subtitle {
            color: #059669;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
        }
        
        .table-container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            overflow: hidden;
            border: 1px solid #e5e7eb;
        }
        
        .table-header {
            background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
            padding: 30px;
            color: white;
        }
        
        .table-header h2 {
            font-size: 1.5rem;
            margin-bottom: 8px;
        }
        
        .table-header p {
            color: #bfdbfe;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        th {
            background: #f9fafb;
            padding: 15px 20px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            text-transform: uppercase;
            font-size: 0.8rem;
            letter-spacing: 0.5px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        th:hover {
            background: #f3f4f6;
        }
        
        th.center {
            text-align: center;
        }
        
        td {
            padding: 15px 20px;
            border-bottom: 1px solid #f3f4f6;
            font-size: 1rem;
        }
        
        td.center {
            text-align: center;
        }
        
        tr:hover {
            background: #f9fafb;
        }
        
        .badge {
            display: inline-flex;
            align-items: center;
            padding: 8px 16px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .badge-green {
            background: #dcfce7;
            color: #166534;
        }
        
        .badge-yellow {
            background: #fef3c7;
            color: #92400e;
        }
        
        .badge-red {
            background: #fee2e2;
            color: #991b1b;
        }
        
        .badge-gray {
            background: #f3f4f6;
            color: #6b7280;
        }
        
        .legend {
            padding: 25px;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
            display: flex;
            flex-wrap: wrap;
            gap: 25px;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            font-size: 0.9rem;
        }
        
        .legend-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        
        .legend-green { background: #10b981; }
        .legend-yellow { background: #f59e0b; }
        .legend-red { background: #ef4444; }
        
        .sort-icon {
            margin-left: 5px;
            font-size: 0.8rem;
            color: #9ca3af;
        }
        
        .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 50vh;
            flex-direction: column;
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f4f6;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 15px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #6b7280;
            font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .metrics-grid {
                grid-template-columns: 1fr;
            }
            
            .legend {
                flex-direction: column;
                gap: 15px;
            }
            
            table {
                font-size: 0.9rem;
            }
            
            th, td {
                padding: 12px 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Greencare Practitioner Dashboard</h1>
            <p>Practitioner Discharge Analysis & Performance Overview</p>
            <p class="date">Month of June 2025</p>
        </div>
        
        <div id="loading" class="loading">
            <div class="spinner"></div>
            <div>Loading dashboard data...</div>
        </div>
        
        <div id="dashboard" style="display: none;">
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-header">
                        <div class="metric-title">Avg Patient Discharge</div>
                    </div>
                    <div class="metric-value" id="patient-avg">0.00%</div>
                    <div class="metric-subtitle">Patient requested discharges</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-header">
                        <div class="metric-title">Avg Practitioner Discharge</div>
                    </div>
                    <div class="metric-value" id="practitioner-avg">0.00%</div>
                    <div class="metric-subtitle">Practitioner initiated</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-header">
                        <div class="metric-title">Total Discharge Rate</div>
                    </div>
                    <div class="metric-value" id="total-avg">0.00%</div>
                    <div class="metric-subtitle">Combined discharge rate</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-header">
                        <div class="metric-title">Active Practitioners</div>
                    </div>
                    <div class="metric-value" id="practitioner-count">0</div>
                    <div class="metric-subtitle">Currently tracked</div>
                </div>
            </div>
            
            <div class="table-container">
                <div class="table-header">
                    <h2>Practitioner Performance Analysis</h2>
                    <p>Individual discharge rates and performance metrics</p>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th onclick="sortTable('name')">
                                Practitioner Name
                                <span class="sort-icon" id="sort-name">↕</span>
                            </th>
                            <th class="center" onclick="sortTable('patient')">
                                Patient Discharge %
                                <span class="sort-icon" id="sort-patient">↕</span>
                            </th>
                            <th class="center" onclick="sortTable('practitioner')">
                                Practitioner Discharge %
                                <span class="sort-icon" id="sort-practitioner">↕</span>
                            </th>
                            <th class="center" onclick="sortTable('total')">
                                Total Discharge %
                                <span class="sort-icon" id="sort-total">↕</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody id="practitioner-table">
                        <!-- Data will be inserted here -->
                    </tbody>
                </table>
                
                <div class="legend">
                    <div class="legend-item">
                        <div class="legend-dot legend-green"></div>
                        <span>Below Average (Good Performance)</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-dot legend-yellow"></div>
                        <span>Above Average (Needs Attention)</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-dot legend-red"></div>
                        <span>High Discharge Rate (Review Required)</span>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                Dashboard automatically excludes practitioners with insufficient data for accurate averaging
            </div>
        </div>
    </div>

    <script>
        // Sample data - replace with your actual CSV data
        const csvData = `Practitioner Breakdown,,,,,,,
Practitioner ,Appointments,Patient Request Discharges,Patient Requested %,Practitioner Request Discharges,Practitioner Requested %,Total,Total %
Vanessa,0,1,,,,,
Thomas,18,1,5.56%,,,1,
Sandhya,92,4,4.35%,3,3.26%,7,7.61%
Ronnie,12,,0.00%,,0.00%,0,0.00%
Luke,0,1,#DIV/0!,,#DIV/0!,1,#DIV/0!
Laura,0,1,#DIV/0!,,#DIV/0!,1,#DIV/0!
Julius,60,3,5.00%,3,5.00%,6,10.00%
Julia,0,,#DIV/0!,,#DIV/0!,0,#DIV/0!
Jordan,0,,#DIV/0!,,#DIV/0!,0,#DIV/0!
Jeremy,0,1,#DIV/0!,,#DIV/0!,1,#DIV/0!
Harry,32,2,6.25%,1,3.13%,3,9.38%
Grace,45,1,2.22%,2,4.44%,3,6.67%
Ethan,28,3,10.71%,1,3.57%,4,14.29%
Diana,67,2,2.99%,4,5.97%,6,8.96%
Charlie,15,1,6.67%,,0.00%,1,6.67%
Ben,38,2,5.26%,2,5.26%,4,10.53%
Alice,52,1,1.92%,3,5.77%,4,7.69%`;

        let dashboardData = [];
        let sortConfig = { key: null, direction: null };
        let averages = {};

        function parsePercentage(value) {
            if (!value || value === '#DIV/0!' || value === null) return NaN;
            if (typeof value === 'string') {
                return parseFloat(value.replace('%', ''));
            }
            return parseFloat(value);
        }

        function formatPercentage(value) {
            if (isNaN(value)) return '0.00%';
            return `${value.toFixed(2)}%`;
        }

        function parseCSV(csvText) {
            const lines = csvText.trim().split('\n');
            const headers = lines[1].split(',');
            const data = [];

            for (let i = 2; i < lines.length; i++) {
                const row = lines[i].split(',');
                if (row[0] && row[0].trim()) {
                    data.push({
                        name: row[0].trim(),
                        patientPercent: parsePercentage(row[3]),
                        practitionerPercent: parsePercentage(row[5]),
                        totalPercent: parsePercentage(row[7])
                    });
                }
            }
            return data;
        }

        function calculateAverages(data) {
            const validPatient = data.filter(row => !isNaN(row.patientPercent));
            const validPractitioner = data.filter(row => !isNaN(row.practitionerPercent));
            const validTotal = data.filter(row => !isNaN(row.totalPercent));

            return {
                patient: validPatient.length > 0 ? 
                    validPatient.reduce((sum, row) => sum + row.patientPercent, 0) / validPatient.length : 0,
                practitioner: validPractitioner.length > 0 ? 
                    validPractitioner.reduce((sum, row) => sum + row.practitionerPercent, 0) / validPractitioner.length : 0,
                total: validTotal.length > 0 ? 
                    validTotal.reduce((sum, row) => sum + row.totalPercent, 0) / validTotal.length : 0
            };
        }

        function getBadgeClass(value, average) {
            if (isNaN(value)) return 'badge-gray';
            return value <= average ? 'badge-green' : 'badge-red';
        }

        function getPractitionerBadgeClass(value, average) {
            if (isNaN(value)) return 'badge-gray';
            return value <= average ? 'badge-green' : 'badge-yellow';
        }

        function renderTable() {
            const tbody = document.getElementById('practitioner-table');
            tbody.innerHTML = '';

            dashboardData.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.name}</td>
                    <td class="center">
                        <span class="badge ${getBadgeClass(row.patientPercent, averages.patient)}">
                            ${formatPercentage(row.patientPercent)}
                        </span>
                    </td>
                    <td class="center">
                        <span class="badge ${getPractitionerBadgeClass(row.practitionerPercent, averages.practitioner)}">
                            ${formatPercentage(row.practitionerPercent)}
                        </span>
                    </td>
                    <td class="center">
                        <span class="badge ${getBadgeClass(row.totalPercent, averages.total)}">
                            ${formatPercentage(row.totalPercent)}
                        </span>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        function sortTable(column) {
            let direction = 'asc';
            
            if (sortConfig.key === column && sortConfig.direction === 'asc') {
                direction = 'desc';
            }

            dashboardData.sort((a, b) => {
                let aValue, bValue;
                
                switch(column) {
                    case 'name':
                        aValue = a.name;
                        bValue = b.name;
                        break;
                    case 'patient':
                        aValue = isNaN(a.patientPercent) ? -1 : a.patientPercent;
                        bValue = isNaN(b.patientPercent) ? -1 : b.patientPercent;
                        break;
                    case 'practitioner':
                        aValue = isNaN(a.practitionerPercent) ? -1 : a.practitionerPercent;
                        bValue = isNaN(b.practitionerPercent) ? -1 : b.practitionerPercent;
                        break;
                    case 'total':
                        aValue = isNaN(a.totalPercent) ? -1 : a.totalPercent;
                        bValue = isNaN(b.totalPercent) ? -1 : b.totalPercent;
                        break;
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

            sortConfig = { key: column, direction };
            
            // Update sort icons
            document.querySelectorAll('.sort-icon').forEach(icon => {
                icon.textContent = '↕';
            });
            
            const currentIcon = document.getElementById(`sort-${column}`);
            currentIcon.textContent = direction === 'asc' ? '↑' : '↓';

            renderTable();
        }

        function loadDashboard() {
            setTimeout(() => {
                dashboardData = parseCSV(csvData);
                averages = calculateAverages(dashboardData);

                // Update metric cards
                document.getElementById('patient-avg').textContent = formatPercentage(averages.patient);
                document.getElementById('practitioner-avg').textContent = formatPercentage(averages.practitioner);
                document.getElementById('total-avg').textContent = formatPercentage(averages.total);
                document.getElementById('practitioner-count').textContent = dashboardData.length;

                // Render table
                renderTable();

                // Show dashboard, hide loading
                document.getElementById('loading').style.display = 'none';
                document.getElementById('dashboard').style.display = 'block';
            }, 1500);
        }

        // Load dashboard when page loads
        window.addEventListener('load', loadDashboard);
    </script>
</body>
</html>
