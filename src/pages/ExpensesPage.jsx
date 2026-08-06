import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Plus, Search, Filter } from "lucide-react";

const dummyExpenses = [
  { id: 1, category: "Rent", amount: "$2,000.00", paymentMethod: "Bank Transfer", date: "2024-05-01" },
  { id: 2, category: "Salary", amount: "$8,450.00", paymentMethod: "Direct Deposit", date: "2024-05-05" },
  { id: 3, category: "Marketing", amount: "$1,200.00", paymentMethod: "Corporate Card", date: "2024-05-12" },
  { id: 4, category: "Travel", amount: "$450.00", paymentMethod: "Corporate Card", date: "2024-05-15" },
  { id: 5, category: "Internet", amount: "$99.00", paymentMethod: "Credit Card", date: "2024-05-18" },
  { id: 6, category: "Electricity", amount: "$150.00", paymentMethod: "Bank Transfer", date: "2024-05-20" },
];

export function ExpensesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
          <p className="text-slate-500">Track and manage your company expenses.</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Add Expense</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {["Rent", "Salary", "Travel", "Marketing", "Electricity", "Internet"].map(category => (
          <Card key={category} className="bg-slate-50 border-slate-100 hover:border-primary/30 transition-colors cursor-pointer shadow-none hover:bg-slate-100/50">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="font-medium text-slate-700">{category}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <CardTitle>Expense History</CardTitle>
          <div className="flex gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input type="search" placeholder="Search expenses..." className="pl-9 bg-slate-50" />
            </div>
            <Button variant="outline" size="icon" className="shrink-0"><Filter className="h-4 w-4 text-slate-500" /></Button>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Payment Method</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {dummyExpenses.map((expense) => (
                <tr key={expense.id} className="bg-white border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{expense.category}</td>
                  <td className="px-6 py-4 font-medium">{expense.amount}</td>
                  <td className="px-6 py-4 text-slate-500">{expense.paymentMethod}</td>
                  <td className="px-6 py-4 text-slate-500">{expense.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
