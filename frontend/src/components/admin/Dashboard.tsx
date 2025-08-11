import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  guests: any[];
  serviceRequests: any[];
  feedbackData: any[];
}

const Dashboard = ({ guests, serviceRequests, feedbackData }: DashboardProps) => {
  // Process guest flow data
  const guestFlowData = [
    { name: 'Checked In', value: guests?.filter(g => g.status === 'checked_in').length || 0 },
    { name: 'Checked Out', value: guests?.filter(g => g.status === 'checked_out').length || 0 },
    { name: 'Reserved', value: guests?.filter(g => g.status === 'reserved').length || 0 },
  ];

  // Process service request data by status
  const requestStatusData = [
    { name: 'Pending', value: serviceRequests?.filter(r => r.status === 'pending').length || 0 },
    { name: 'In Progress', value: serviceRequests?.filter(r => r.status === 'in-progress').length || 0 },
    { name: 'Completed', value: serviceRequests?.filter(r => r.status === 'completed').length || 0 },
  ];

  // Process service request data by category
  const requestCategoryData = serviceRequests?.reduce((acc: any[], request) => {
    const category = request.category || 'General';
    const existing = acc.find(item => item.name === category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: category, value: 1 });
    }
    return acc;
  }, []) || [];

  // Process feedback rating data
  const feedbackRatingData = [
    { name: '5 Stars', value: feedbackData?.filter(f => f.rating === '5').length || 0 },
    { name: '4 Stars', value: feedbackData?.filter(f => f.rating === '4').length || 0 },
    { name: '3 Stars', value: feedbackData?.filter(f => f.rating === '3').length || 0 },
    { name: '2 Stars', value: feedbackData?.filter(f => f.rating === '2').length || 0 },
    { name: '1 Star', value: feedbackData?.filter(f => f.rating === '1').length || 0 },
  ];

  // Process monthly guest flow (last 6 months) using real data
  const getMonthlyGuestFlow = () => {
    const months = [];
    const now = new Date();
    
    // Create array of last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        name: date.toLocaleDateString('en-US', { month: 'short' }),
        year: date.getFullYear(),
        month: date.getMonth(),
        checkIns: 0,
        checkOuts: 0,
      });
    }

    // Process real guest data for check-ins and check-outs
    if (guests && guests.length > 0) {
      guests.forEach(guest => {
        try {
          // Process check-ins
          if (guest.checkInDate && guest.checkInDate !== 'Invalid Date') {
            const checkInDate = new Date(guest.checkInDate);
            if (!isNaN(checkInDate.getTime())) {
              const monthIndex = months.findIndex(m => 
                m.year === checkInDate.getFullYear() && m.month === checkInDate.getMonth()
              );
              if (monthIndex !== -1) {
                months[monthIndex].checkIns += 1;
              }
            }
          }

          // Process check-outs
          if (guest.checkOutDate && guest.checkOutDate !== 'Invalid Date') {
            const checkOutDate = new Date(guest.checkOutDate);
            if (!isNaN(checkOutDate.getTime())) {
              const monthIndex = months.findIndex(m => 
                m.year === checkOutDate.getFullYear() && m.month === checkOutDate.getMonth()
              );
              if (monthIndex !== -1) {
                months[monthIndex].checkOuts += 1;
              }
            }
          }
        } catch (error) {
          console.warn('Error processing guest date:', error, guest);
        }
      });
    }

    // Return only the display data (remove year and month from final output)
    const result = months.map(({ name, checkIns, checkOuts }) => ({
      name,
      checkIns,
      checkOuts,
    }));
    
    // Debug log to show real data being used
    console.log('Monthly Guest Flow - Real Data:', result);
    console.log('Total guests processed:', guests?.length || 0);
    
    return result;
  };

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guests?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {guests?.filter(g => g.status === 'checked_in').length || 0} currently staying
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serviceRequests?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {serviceRequests?.filter(r => r.status === 'pending').length || 0} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feedback Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbackData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {feedbackData?.filter(f => f.rating >= '4').length || 0} positive ratings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {guests && guests.length > 0 
                ? Math.round((guests.filter(g => g.status === 'checked_in').length / guests.length) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Current occupancy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">6-Month Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(() => {
                const monthlyData = getMonthlyGuestFlow();
                const totalCheckIns = monthlyData.reduce((sum, month) => sum + month.checkIns, 0);
                const totalCheckOuts = monthlyData.reduce((sum, month) => sum + month.checkOuts, 0);
                return `${totalCheckIns}/${totalCheckOuts}`;
              })()}
            </div>
            <p className="text-xs text-muted-foreground">
              Check-ins/Check-outs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Guest Flow Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Guest Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={guestFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Request Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Service Request Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={requestStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Monthly Guest Flow */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Guest Flow (Last 6 Months) - Real Data</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const monthlyData = getMonthlyGuestFlow();
              const hasData = monthlyData.some(month => month.checkIns > 0 || month.checkOuts > 0);
              
              if (!hasData) {
                return (
                  <div className="flex items-center justify-center h-[300px] text-center">
                    <div>
                      <div className="text-lg font-medium text-muted-foreground">No guest activity data</div>
                      <div className="text-sm text-muted-foreground mt-2">
                        Guest check-ins and check-outs will appear here as they occur
                      </div>
                    </div>
                  </div>
                );
              }
              
              return (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="checkIns" fill="#8884d8" name="Check-ins" />
                    <Bar dataKey="checkOuts" fill="#82ca9d" name="Check-outs" />
                  </BarChart>
                </ResponsiveContainer>
              );
            })()}
          </CardContent>
        </Card>

        {/* Feedback Ratings */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback Ratings Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={feedbackRatingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {feedbackRatingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Service Request Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Service Request Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={requestCategoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard; 