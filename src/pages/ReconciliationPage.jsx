import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { CheckCircle, AlertTriangle, ArrowRightLeft, Sparkles, RefreshCcw } from "lucide-react";
import { cn } from "../utils/cn";
import { useGlobalState } from "../context/GlobalStateContext";

export function ReconciliationPage() {
  const { bankFeed, ledgerEntries, autoMatchBankFeed, updateLedgerEntryStatus } = useGlobalState();
  const [isMatching, setIsMatching] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleAutoMatch = () => {
    setIsMatching(true);
    setTimeout(() => {
      autoMatchBankFeed();
      setIsMatching(false);
    }, 1500);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  const handleFixVariance = (entryId) => {
    updateLedgerEntryStatus(entryId, "Reconciled");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bank Reconciliation</h1>
          <p className="text-slate-500">Match bank statements with accounting ledger entries.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleSync} disabled={isSyncing}>
            <RefreshCcw className={cn("h-4 w-4", isSyncing ? "animate-spin" : "")} />
            {isSyncing ? "Syncing..." : "Sync Bank Feed"}
          </Button>
          <Button onClick={handleAutoMatch} disabled={isMatching} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            {isMatching ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            AI Auto-Match
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bank Feed */}
        <Card>
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-lg">Bank Statement (Chase Business)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {bankFeed.map((txn) => (
                <div key={txn.id} className={cn("p-4 flex items-center justify-between transition-colors", txn.matchedId ? "bg-green-50/30" : "bg-white")}>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-slate-500">{new Date(txn.date).getDate()}</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{txn.description}</p>
                      <p className="text-xs text-slate-500">{txn.date} • {txn.id}</p>
                      
                      {txn.matchedId && txn.matchConfidence >= 90 && (
                        <p className="text-xs text-green-600 flex items-center gap-1 mt-1 font-medium">
                          <CheckCircle className="h-3 w-3" /> Auto-matched (Conf: {txn.matchConfidence}%)
                        </p>
                      )}
                      {txn.matchedId && txn.matchConfidence < 90 && (
                        <p className="text-xs text-yellow-600 flex items-center gap-1 mt-1 font-medium">
                          <AlertTriangle className="h-3 w-3" /> Possible Match (Conf: {txn.matchConfidence}%)
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={cn("font-semibold", txn.amount.startsWith('+') ? "text-green-600" : "text-slate-900")}>
                    {txn.amount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ledger Entries */}
        <Card>
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-lg">Our Ledger Records</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {ledgerEntries.map((entry) => (
                <div key={entry.id} className={cn("p-4 flex items-center justify-between transition-colors", 
                  entry.status === 'Reconciled' ? "bg-green-50/30" : 
                  entry.status === 'Variance' ? "bg-yellow-50/50" : "bg-white"
                )}>
                  <div className="flex gap-4">
                     <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-slate-500">{new Date(entry.date).getDate()}</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{entry.description}</p>
                      <p className="text-xs text-slate-500">{entry.date} • {entry.id}</p>
                      <span className={cn("mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider", 
                        entry.status === 'Reconciled' ? "bg-green-100 text-green-700" :
                        entry.status === 'Variance' ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-600"
                      )}>
                        {entry.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn("font-semibold mb-1", (entry.amount || entry.credit !== "-") ? "text-green-600" : "text-slate-900")}>
                      {entry.amount || (entry.debit !== "-" ? `-${entry.debit}` : `+${entry.credit}`)}
                    </div>
                    {entry.status === 'Variance' && (
                       <Button variant="outline" size="sm" className="h-7 text-xs border-yellow-300 hover:bg-yellow-50" onClick={() => handleFixVariance(entry.id)}>Fix Variance</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Visual connection indicator when matched (Optional decorative element) */}
      <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center opacity-20 pointer-events-none">
        <ArrowRightLeft className="h-24 w-24 text-slate-400" />
      </div>
    </div>
  );
}
