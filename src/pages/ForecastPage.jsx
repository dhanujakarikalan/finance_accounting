import { StatCard } from "../components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { TrendingUp, AlertCircle, Lightbulb } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar
} from 'recharts';

const forecastData = [
  { name: 'Jul', actual: 4000, predicted: 4000 },
  { name: 'Aug', actual: 4500, predicted: 4400 },
  { name: 'Sep', actual: 4200, predicted: 4300 },
  { name: 'Oct', actual: null, predicted: 4800 },
  { name: 'Nov', actual: null, predicted: 5100 },
  { name: 'Dec', actual: null, predicted: 5600 },
];

const growthData = [
  { name: 'Q1', revenue: 12000, target: 15000 },
  { name: 'Q2', revenue: 15000, target: 18000 },
  { name: 'Q3', revenue: null, target: 22000 },
  { name: 'Q4', revenue: null, target: 26000 },
];

export function ForecastPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Forecast</h1>
          <p className="text-slate-500">Predictive financial modeling powered by AI.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Predicted Revenue (Next 30d)" value="$5,200.00" icon={TrendingUp} trend="up" trendValue="8.4" className="border-l-4 border-l-primary" />
        <StatCard title="Predicted Expenses" value="$3,100.00" icon={AlertCircle} trend="down" trendValue="2.1" className="border-l-4 border-l-secondary" />
        <StatCard title="Expected Profit" value="$2,100.00" icon={TrendingUp} trend="up" trendValue="12.5" className="border-l-4 border-l-primary" />
        <StatCard title="Cash Flow Prediction" value="Positive" icon={Lightbulb} className="border-l-4 border-l-secondary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Forecast Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Area type="monotone" dataKey="actual" stroke="#2563EB" fillOpacity={1} fill="url(#colorActual)" strokeWidth={2} />
                    <Area type="monotone" dataKey="predicted" stroke="#8B5CF6" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Growth Trajectory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={growthData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Bar dataKey="revenue" barSize={40} fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="target" stroke="#F59E0B" strokeWidth={3} dot={{ r: 6, fill: '#F59E0B' }} strokeDasharray="3 3" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-200">
                <Lightbulb className="h-5 w-5 text-yellow-400" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4 border border-white/10 backdrop-blur-sm">
                <h4 className="font-medium text-indigo-100 mb-1">Optimize Marketing Spend</h4>
                <p className="text-sm text-slate-300">
                  Reduce marketing expenses by 8% in Q3. Historical data shows seasonal dip in conversion rates during July-August.
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 border border-white/10 backdrop-blur-sm">
                <h4 className="font-medium text-indigo-100 mb-1">Cash Buffer Alert</h4>
                <p className="text-sm text-slate-300">
                  Predicted tax liabilities in October may strain cash flow. Consider maintaining a 15% higher cash buffer starting September.
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 border border-white/10 backdrop-blur-sm">
                <h4 className="font-medium text-indigo-100 mb-1">Vendor Renegotiation</h4>
                <p className="text-sm text-slate-300">
                  Your AWS costs have grown 22% MoM. Consider reserving instances to save an estimated $400/month.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
