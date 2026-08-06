import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Search, Plus, Filter, BookOpen, X } from "lucide-react";
import { cn } from "../utils/cn";
import { useGlobalState } from "../context/GlobalStateContext";

export function LedgerPage() {
  const [activeTab, setActiveTab] = useState("journal");
  const { ledgerEntries, addLedgerEntry } = useGlobalState();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("Select Account...");
  const [glAccountFilter, setGlAccountFilter] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [debitAccount, setDebitAccount] = useState("Office Expenses");
  const [creditAccount, setCreditAccount] = useState("Operating Bank Account");
  const [amount, setAmount] = useState("");

  const handleCreateEntry = () => {
    if (!description.trim() || !amount.trim()) return;
    let formattedAmount = amount;
    if (!amount.startsWith("$")) {
      formattedAmount = `$${amount}`;
    }
    addLedgerEntry({
      description,
      debitAccount,
      creditAccount,
      amount: formattedAmount
    });
    setIsModalOpen(false);
    setDescription("");
    setAmount("");
  };

  const filteredJournalEntries = ledgerEntries.filter(entry => 
    entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const glEntries = glAccountFilter 
    ? ledgerEntries.filter(entry => entry.account === glAccountFilter)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ledger Management</h1>
          <p className="text-slate-500">Double-entry bookkeeping and general ledger view.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" /> New Journal Entry
        </Button>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("journal")}
          className={cn("pb-3 text-sm font-medium border-b-2 transition-colors", activeTab === "journal" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700")}
        >
          Journal Entries
        </button>
        <button
          onClick={() => setActiveTab("gl")}
          className={cn("pb-3 text-sm font-medium border-b-2 transition-colors", activeTab === "gl" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700")}
        >
          General Ledger
        </button>
        <button
          onClick={() => setActiveTab("tb")}
          className={cn("pb-3 text-sm font-medium border-b-2 transition-colors", activeTab === "tb" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700")}
        >
          Trial Balance
        </button>
      </div>

      {activeTab === "journal" && (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Journal Entries</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  type="search" 
                  placeholder="Search entries..." 
                  className="pl-9 bg-slate-50" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0"><Filter className="h-4 w-4 text-slate-500" /></Button>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Entry ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Account</th>
                  <th className="px-6 py-4 font-medium text-right">Debit</th>
                  <th className="px-6 py-4 font-medium text-right">Credit</th>
                  <th className="px-6 py-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredJournalEntries.map((entry, idx) => {
                  const isPair = idx > 0 && ledgerEntries[idx - 1].id === entry.id;
                  return (
                    <tr key={idx} className={cn("bg-white hover:bg-slate-50/50 transition-colors", isPair ? "border-b border-slate-200" : "")}>
                      <td className="px-6 py-3 font-medium text-slate-900">{!isPair ? entry.id : ""}</td>
                      <td className="px-6 py-3 text-slate-500">{!isPair ? entry.date : ""}</td>
                      <td className="px-6 py-3 text-slate-700">{!isPair ? entry.description : ""}</td>
                      <td className={cn("px-6 py-3", isPair ? "pl-10 text-slate-500" : "font-medium text-slate-700")}>{entry.account}</td>
                      <td className="px-6 py-3 font-medium text-right">{entry.debit}</td>
                      <td className="px-6 py-3 font-medium text-right">{entry.credit}</td>
                      <td className="px-6 py-3 text-right">
                        {!isPair && (
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", entry.status === 'Posted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')}>
                            {entry.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === "gl" && (
        <Card>
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <BookOpen className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">General Ledger</h3>
            <p className="text-sm text-slate-500 max-w-sm mt-2">
              Select an account to view all related transactions and running balances.
            </p>
            <div className="mt-6 flex gap-2">
              <select 
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-64"
              >
                <option>Select Account...</option>
                <option>Operating Bank Account</option>
                <option>Accounts Payable</option>
                <option>Accounts Receivable</option>
                <option>Rent Expense</option>
                <option>Office Expenses</option>
                <option>IT Software</option>
              </select>
              <Button onClick={() => setGlAccountFilter(selectedAccount !== "Select Account..." ? selectedAccount : null)}>
                View Ledger
              </Button>
            </div>

            {glAccountFilter && (
              <div className="mt-8 w-full text-left">
                <h4 className="font-semibold text-slate-900 mb-3">Showing entries for: <span className="text-primary">{glAccountFilter}</span></h4>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 font-medium">Entry ID</th>
                        <th className="px-6 py-3 font-medium">Date</th>
                        <th className="px-6 py-3 font-medium">Description</th>
                        <th className="px-6 py-3 font-medium text-right">Debit</th>
                        <th className="px-6 py-3 font-medium text-right">Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {glEntries.length > 0 ? (
                        glEntries.map((entry, idx) => (
                          <tr key={idx} className="border-b border-slate-100 bg-white hover:bg-slate-50/50">
                            <td className="px-6 py-3 font-medium">{entry.id}</td>
                            <td className="px-6 py-3 text-slate-500">{entry.date}</td>
                            <td className="px-6 py-3">{entry.description}</td>
                            <td className="px-6 py-3 text-right font-medium">{entry.debit}</td>
                            <td className="px-6 py-3 text-right font-medium">{entry.credit}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-6 text-center text-slate-500">
                            No entries found for this account.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "tb" && (
        <Card>
          <CardHeader>
            <CardTitle>Trial Balance</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 font-medium">Account Name</th>
                      <th className="px-6 py-3 font-medium text-right">Debit Balance</th>
                      <th className="px-6 py-3 font-medium text-right">Credit Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="px-6 py-3">Operating Bank Account</td>
                      <td className="px-6 py-3 text-right font-medium">$124,500.00</td>
                      <td className="px-6 py-3 text-right">-</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="px-6 py-3">Accounts Receivable</td>
                      <td className="px-6 py-3 text-right font-medium">$12,400.00</td>
                      <td className="px-6 py-3 text-right">-</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="px-6 py-3">Accounts Payable</td>
                      <td className="px-6 py-3 text-right">-</td>
                      <td className="px-6 py-3 text-right font-medium">$4,500.00</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="px-6 py-3">Sales Revenue</td>
                      <td className="px-6 py-3 text-right">-</td>
                      <td className="px-6 py-3 text-right font-medium">$145,231.89</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-50/50">
                      <td className="px-6 py-3">Rent Expense</td>
                      <td className="px-6 py-3 text-right font-medium">$10,000.00</td>
                      <td className="px-6 py-3 text-right">-</td>
                    </tr>
                    <tr className="font-bold bg-slate-100 text-slate-900">
                      <td className="px-6 py-4">Total</td>
                      <td className="px-6 py-4 text-right">$146,900.00</td>
                      <td className="px-6 py-4 text-right">$146,900.00</td>
                    </tr>
                  </tbody>
                </table>
             </div>
          </CardContent>
        </Card>
      )}

      {/* New Journal Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Create Journal Entry</CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}><X className="h-5 w-5" /></Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <input 
                  type="text" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="e.g. Office Supplies Purchase"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Debit Account</label>
                <select
                  value={debitAccount}
                  onChange={(e) => setDebitAccount(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option>Office Expenses</option>
                  <option>Rent Expense</option>
                  <option>IT Software</option>
                  <option>Accounts Receivable</option>
                  <option>Operating Bank Account</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Credit Account</label>
                <select
                  value={creditAccount}
                  onChange={(e) => setCreditAccount(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option>Operating Bank Account</option>
                  <option>Accounts Payable</option>
                  <option>Sales Revenue</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Amount</label>
                <input 
                  type="text" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="e.g. $250.00"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button className="flex-1" onClick={handleCreateEntry}>Post Entry</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
