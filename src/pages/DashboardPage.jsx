import { StatCard } from "../components/ui/StatCard";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Wallet, 
  Clock, 
  FileText,
  Upload,
  Plus,
  FileBarChart,
  MessageSquare,
  Zap
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';


const revenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
];

const expenseData = [
  { name: 'Rent', value: 2000 },
  { name: 'Salary', value: 8000 },
  { name: 'Marketing', value: 1500 },
  { name: 'Software', value: 500 },
];

const profitData = [
  { name: 'Jan', profit: 2000 },
  { name: 'Feb', profit: 1000 },
  { name: 'Mar', profit: 3000 },
  { name: 'Apr', profit: 2500 },
  { name: 'May', profit: 4000 },
  { name: 'Jun', profit: 3500 },
];

const COLORS = ['#2563EB', '#10B981', '#7C3AED', '#F59E0B'];

const recentActivities = [
  { id: 1, action: "Invoice #1024 paid", time: "2 hours ago", amount: "+$1,200.00", type: "positive" },
  { id: 2, action: "AWS Subscription", time: "5 hours ago", amount: "-$120.00", type: "negative" },
  { id: 3, action: "New client contract signed", time: "1 day ago", amount: "", type: "neutral" },
  { id: 4, action: "Payroll processed", time: "2 days ago", amount: "-$8,450.00", type: "negative" },
];

export function DashboardPage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-slate-500">Here's what's happening with your finances today.</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" onClick={() => navigate('/invoice-upload')}><Plus className="h-4 w-4" /> Add Expense</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Revenue" value="$45,231.89" icon={DollarSign} trend="up" trendValue="20.1" />
        <StatCard title="Total Expenses" value="$12,304.50" icon={CreditCard} trend="up" trendValue="4.1" />
        <StatCard title="Net Profit" value="$32,927.39" icon={TrendingUp} trend="up" trendValue="15.3" />
        <StatCard title="Cash Balance" value="$124,500.00" icon={Wallet} />
        <StatCard title="Pending Payments" value="$4,500.00" icon={Clock} />
        <StatCard title="Pending Invoices" value="$12,400.00" icon={FileText} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => `$${value}`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={3} dot={{r: 4, fill: '#2563EB'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {expenseData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-sm text-slate-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Profit</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => `$${value}`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} cursor={{fill: '#f1f5f9'}} />
                  <Bar dataKey="profit" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="col-span-full lg:col-span-1 space-y-4">
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-indigo-900">
                <Zap className="h-5 w-5 text-indigo-600" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-white/60 p-3 text-sm text-indigo-900 shadow-sm border border-indigo-100/50 backdrop-blur-sm">
                Marketing expenses increased by 12% compared to last month.
              </div>
              <div className="rounded-lg bg-white/60 p-3 text-sm text-indigo-900 shadow-sm border border-indigo-100/50 backdrop-blur-sm">
                Cash flow is expected to improve next month based on pending invoices.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                    {activity.amount && (
                      <div className={`text-sm font-medium ${activity.type === 'positive' ? 'text-secondary' : 'text-slate-900'}`}>
                        {activity.amount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

  );
}
