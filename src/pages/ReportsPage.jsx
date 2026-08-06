import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import Loader from "../components/Loader";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const pnlData = [
  { name: 'Jan', revenue: 4000, expense: 2400 },
  { name: 'Feb', revenue: 3000, expense: 1398 },
  { name: 'Mar', revenue: 2000, expense: 9800 },
  { name: 'Apr', revenue: 2780, expense: 3908 },
  { name: 'May', revenue: 1890, expense: 4800 },
  { name: 'Jun', revenue: 2390, expense: 3800 },
];

const cashFlowData = [
  { name: 'Q1', inflow: 12000, outflow: 8000 },
  { name: 'Q2', inflow: 15000, outflow: 9500 },
  { name: 'Q3', inflow: 11000, outflow: 12000 },
  { name: 'Q4', inflow: 18000, outflow: 10000 },
];

const expenseCategoryData = [
  { name: 'Payroll', value: 45 },
  { name: 'Marketing', value: 25 },
  { name: 'Operations', value: 20 },
  { name: 'Software', value: 10 },
];

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPnlData, setCurrentPnlData] = useState(pnlData);
  const [currentCashFlowData, setCurrentCashFlowData] = useState(cashFlowData);

  const handleDownloadPDF = () => {
    const content = `FINCOPILOT - FINANCIAL REPORT (YTD)\nGenerated on: ${new Date().toLocaleDateString()}\n\nProfit & Loss Data:\n${JSON.stringify(currentPnlData, null, 2)}\n\nCash Flow Summary Data:\n${JSON.stringify(currentCashFlowData, null, 2)}`;
    const blob = new Blob([content], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `financial_report_${new Date().getFullYear()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadExcel = () => {
    let csv = "Period,Revenue,Expense\n";
    currentPnlData.forEach(row => {
      csv += `${row.name},${row.revenue},${row.expense}\n`;
    });
    csv += "\nQuarter,Inflow,Outflow\n";
    currentCashFlowData.forEach(row => {
      csv += `${row.name},${row.inflow},${row.outflow}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `financial_report_${new Date().getFullYear()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newPnl = currentPnlData.map(row => ({
        ...row,
        revenue: Math.round(row.revenue * (0.85 + Math.random() * 0.35)),
        expense: Math.round(row.expense * (0.85 + Math.random() * 0.25))
      }));
      const newCashFlow = currentCashFlowData.map(row => ({
        ...row,
        inflow: Math.round(row.inflow * (0.85 + Math.random() * 0.35)),
        outflow: Math.round(row.outflow * (0.85 + Math.random() * 0.25))
      }));
      setCurrentPnlData(newPnl);
      setCurrentCashFlowData(newCashFlow);
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-slate-500">Comprehensive financial analysis and reporting.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Button variant="outline" className="gap-2" onClick={handleDownloadPDF}>
            <FileText className="h-4 w-4" /> Download PDF
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleDownloadExcel}>
            <FileSpreadsheet className="h-4 w-4" /> Download Excel
          </Button>
          <Button className="gap-2 min-w-[140px] flex items-center justify-center" onClick={handleGenerateReport} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader />
                <span>Generating...</span>
              </>
            ) : (
              "Generate Report"
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profit & Loss (YTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentPnlData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Legend iconType="circle" />
                  <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentCashFlowData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Legend iconType="circle" />
                  <Bar dataKey="inflow" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="outflow" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {expenseCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center h-[300px]">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">Software Subscriptions</span>
                  <span className="text-sm font-medium text-slate-900">65%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">Consulting Services</span>
                  <span className="text-sm font-medium text-slate-900">25%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-secondary h-2.5 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">Other Income</span>
                  <span className="text-sm font-medium text-slate-900">10%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-accent h-2.5 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
