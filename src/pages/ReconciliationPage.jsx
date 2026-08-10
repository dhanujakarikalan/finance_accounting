import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { CheckCircle, AlertTriangle, ArrowRightLeft, Sparkles, RefreshCcw, Upload, FileText, X } from "lucide-react";
import { cn } from "../utils/cn";
import { useGlobalState } from "../context/GlobalStateContext";

export function ReconciliationPage() {
  const { bankFeed, ledgerEntries, autoMatchBankFeed, updateLedgerEntryStatus, uploadBankStatement } = useGlobalState();
  const [isMatching, setIsMatching] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const fileInputRef = useRef(null);

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

  const handleStatementFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(null);

    const res = await uploadBankStatement(file);
    setIsUploading(false);

    if (res && res.success) {
      setUploadSuccess(`Bank statement "${file.name}" uploaded successfully! Transactions extracted and added to Bank Feed.`);
      setTimeout(() => {
        setIsUploadModalOpen(false);
        setUploadSuccess(null);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bank Reconciliation</h1>
          <p className="text-slate-500">Match bank statements with accounting ledger entries.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setIsUploadModalOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Upload className="h-4 w-4" />
            Upload Statement
          </Button>
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

      {/* Upload Bank Statement Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upload Bank Statement</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsUploadModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload your bank statement (PDF, CSV, Excel, or Image). Transactions will be extracted and auto-matched with your ledger.
            </p>

            <div 
              className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-slate-50 dark:bg-slate-800/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,.csv,.xlsx,.xls,.png,.jpg,.jpeg"
                onChange={handleStatementFileChange} 
              />
              <Upload className="h-10 w-10 text-emerald-500 mx-auto mb-3 animate-bounce" />
              <p className="font-medium text-slate-700 dark:text-slate-200 text-sm">Click to select Bank Statement</p>
              <p className="text-xs text-slate-400 mt-1">Supports PDF, CSV, XLSX, PNG (Max 10MB)</p>
            </div>

            {isUploading && (
              <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 font-medium py-2">
                <RefreshCcw className="h-4 w-4 animate-spin" />
                Parsing statement & extracting transactions...
              </div>
            )}

            {uploadSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
