import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, LineChart, Calendar, Download, Filter, Search, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [similarityReports, setSimilarityReports] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
    end: new Date().toISOString().split('T')[0] // today
  });
  const [filter, setFilter] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    setIsLoggedIn(true);
    fetchData();
  }, [navigate, dateRange, filter]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [activitiesRes, reportsRes] = await Promise.all([
        axios.get('http://localhost:8000/api/activity', {
          params: { startDate: dateRange.start, endDate: dateRange.end, filter },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:8000/api/similarity', {
          params: { startDate: dateRange.start, endDate: dateRange.end },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      
      setActivities(activitiesRes.data);
      setSimilarityReports(reportsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    // Create CSV for activities
    const activityRows = activities.map(a => 
      `${a.sessionId},${new Date(a.timestamp).toISOString()},${a.type},${a.data.replace(/,/g, ';')}`
    );
    
    const activityCSV = [
      'SessionID,Timestamp,Type,Data',
      ...activityRows
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([activityCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Prepare chart data
  const activityChartData = {
    labels: ['Typing', 'Paste', 'Copy', 'Tab Leave', 'Tab Return'],
    datasets: [
      {
        label: 'Activity Count',
        data: [
          activities.filter(a => a.type === 'typing').length,
          activities.filter(a => a.type === 'paste').length,
          activities.filter(a => a.type === 'copy').length,
          activities.filter(a => a.type === 'tabLeave').length,
          activities.filter(a => a.type === 'tabReturn').length
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)', // primary
          'rgba(245, 158, 11, 0.7)', // warning
          'rgba(139, 92, 246, 0.7)', // accent
          'rgba(239, 68, 68, 0.7)',  // error
          'rgba(16, 185, 129, 0.7)'  // success
        ]
      }
    ]
  };

  // Similarity scores over time
  const similarityChartData = {
    labels: similarityReports.map(report => new Date(report.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Similarity Score (%)',
        data: similarityReports.map(report => report.similarityScore * 100),
        borderColor: 'rgba(239, 68, 68, 0.8)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  if (!isLoggedIn) {
    return null; // Redirecting to login
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Admin Dashboard</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="p-2 border border-gray-300 rounded-md"
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={18} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Activities</option>
              <option value="typing">Typing</option>
              <option value="paste">Paste</option>
              <option value="copy">Copy</option>
              <option value="tab">Tab Changes</option>
            </select>
            
            <button 
              onClick={fetchData}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Refresh data"
            >
              <RefreshCw size={18} />
            </button>
            
            <button
              onClick={handleExport}
              className="flex items-center gap-1 btn btn-secondary"
            >
              <Download size={18} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[--primary]"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart size={20} className="text-[--primary]" />
                Activity Distribution
              </h2>
              <div className="h-80">
                <Bar 
                  data={activityChartData} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                  }} 
                />
              </div>
            </div>
            
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <LineChart size={20} className="text-[--error]" />
                Similarity Score Trends
              </h2>
              <div className="h-80">
                <Line 
                  data={similarityChartData} 
                  options={{ 
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        title: { 
                          display: true, 
                          text: 'Similarity %' 
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>
          
          <div className="card mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Activities</h2>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  className="pl-10 p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activities.slice(0, 10).map((activity, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{activity.sessionId.substring(0, 8)}...</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(activity.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activity.type === 'paste' ? 'bg-amber-100 text-amber-800' :
                          activity.type === 'copy' ? 'bg-purple-100 text-purple-800' :
                          activity.type === 'typing' ? 'bg-blue-100 text-blue-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {activity.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{(activity.data || '').substring(0, 50)}{activity.data && activity.data.length > 50 ? '...' : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {activities.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No activity data found for the selected period.
              </div>
            )}
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Similarity Reports</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Similarity Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Algorithm</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suspicious Lines</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {similarityReports.map((report, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{report.sessionId.substring(0, 8)}...</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(report.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.similarityScore > 0.7 ? 'bg-red-100 text-red-800' :
                          report.similarityScore > 0.4 ? 'bg-amber-100 text-amber-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {(report.similarityScore * 100).toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{report.algorithm}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {(report.suspiciousLines || []).length > 0 
                          ? report.suspiciousLines.slice(0, 3).join(', ') + (report.suspiciousLines.length > 3 ? '...' : '')
                          : 'None'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {similarityReports.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No similarity reports found for the selected period.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;