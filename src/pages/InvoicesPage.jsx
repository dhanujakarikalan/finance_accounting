

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Upload, Eye, Edit, Trash2, Download, Search, CheckCircle, AlertTriangle, X, FileText } from "lucide-react";
import { Input } from "../components/ui/Input";
import { cn } from "../utils/cn";
import { useGlobalState } from "../context/GlobalStateContext";
import { WEBHOOK_URL, API_BASE_URL } from "../config";
import Loader from "../components/Loader";

export function InvoicesPage() {
  const [isDragging, setIsDragging] = useState(false);
  const { invoices, approveInvoice, addInvoice } = useGlobalState();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInvoices = invoices.filter((invoice) => 
    invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const triggerBrowse = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFiles = async (files) => {
    if (!files || !files[0]) return;
    const file = files[0];
    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Upload file to FastAPI backend /uploadInvoice endpoint (which forwards to Webhook & saves in MySQL)
      const response = await fetch(`${API_BASE_URL}/uploadInvoice`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const resData = await response.json();
      if (resData && resData.invoice) {
        addInvoice(resData.invoice);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError(`Failed to upload invoice: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Auto-Approved": return "bg-green-100 text-green-800 border border-green-200";
      case "Review Needed": return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "Manual Approved": return "bg-blue-100 text-blue-800 border border-blue-200";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const getConfidenceColor = (score) => {
    if (score >= 95) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const handleReview = (invoice) => {
    setSelectedInvoice(invoice);
    setIsReviewModalOpen(true);
  };

  const handleApprove = () => {
    approveInvoice(selectedInvoice.id, selectedInvoice); // Passes current selected invoice data
    setIsReviewModalOpen(false);
    setSelectedInvoice(null);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Invoice Processing</h1>
          <p className="text-slate-500">Automated OCR and AP classification with Human-in-the-Loop validation.</p>
        </div>
        <Button className="gap-2" onClick={triggerBrowse}><Upload className="h-4 w-4" /> Upload Invoice</Button>
      </div>

      {/* Drag and Drop Upload Area */}
      <Card 
        className={`border-dashed border-2 cursor-pointer transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50'
        }`}
        onClick={triggerBrowse}
        onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); triggerBrowse(); }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerBrowse();
          }
        }}
        tabIndex={0}
        role="button"
      >
        <CardContent className="flex flex-col items-center justify-center py-12"
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer && e.dataTransfer.files) {
              handleFiles(e.dataTransfer.files);
            }
          }}
        >
          <input
            type="file"
            accept="application/pdf,image/jpeg,image/png"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader />
              <p className="text-sm font-medium text-slate-600">Uploading and processing invoice...</p>
            </div>
          ) : (
            <>
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">Upload an invoice</h3>
              <p className="text-sm text-slate-500 mb-4 text-center max-w-sm">
                Drag and drop your invoice files here. AI will extract Vendor, Date, Amount, GST, and suggest GL Account.
              </p>
              <Button variant="outline">Browse Files</Button>
            </>
          )}
        </CardContent>
      </Card>

      {uploadError && (
        <div className="p-3 bg-red-100 border border-red-200 rounded text-red-800 text-sm">
          Error: {uploadError}
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <CardTitle>Processed Invoices</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              type="search" 
              placeholder="Search invoices..." 
              className="pl-9 bg-slate-50" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Invoice Number</th>
                <th className="px-6 py-4 font-medium">Vendor</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">AI Confidence</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice, idx) => (
                <tr key={invoice.db_id ? `db-${invoice.db_id}` : `${invoice.id}-${idx}`} className="bg-white border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{invoice.id}</td>
                  <td className="px-6 py-4">{invoice.vendor}</td>
                  <td className="px-6 py-4">{invoice.date}</td>
                  <td className="px-6 py-4 font-medium">{invoice.amount}</td>
                  <td className="px-6 py-4 font-medium">
                    <span className={getConfidenceColor(invoice.confidence)}>{invoice.confidence}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-max", getStatusColor(invoice.status))}>
                      {invoice.status === 'Review Needed' ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {invoice.status === 'Review Needed' ? (
                        <Button variant="outline" size="sm" onClick={() => handleReview(invoice)}>Review</Button>
                      ) : (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-primary"><Eye className="h-4 w-4" /></Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Human-in-the-loop Review Modal */}
      {isReviewModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Human Review Required</CardTitle>
                <p className="text-sm text-slate-500 mt-1">Invoice {selectedInvoice.id} • AI Confidence: <span className="text-red-500 font-bold">{selectedInvoice.confidence}%</span></p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsReviewModalOpen(false)}><X className="h-5 w-5" /></Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Mock Image Placeholder */}
                <div className="bg-slate-100 rounded-lg border border-slate-200 flex flex-col items-center justify-center h-[400px]">
                  <FileText className="h-16 w-16 text-slate-300 mb-4" />
                  <span className="text-slate-500 font-medium">Invoice Document View</span>
                  <span className="text-xs text-slate-400 mt-2">(Interactive PDF viewer would load here)</span>
                </div>

                {/* Data Extraction Form */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <SparklesIcon className="h-4 w-4 text-primary" /> Extracted Data
                  </h4>
                  
                  {Object.entries(selectedInvoice.fieldConfidence).map(([field, conf]) => (
                    <div key={field} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <label className="font-medium text-slate-700 capitalize">{field === 'glAccount' ? 'GL Account' : field}</label>
                        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100", getConfidenceColor(conf))}>
                          {conf}% Conf
                        </span>
                      </div>
                      <Input 
                        defaultValue={selectedInvoice[field]} 
                        className={conf < 80 ? 'border-yellow-400 focus-visible:ring-yellow-400 bg-yellow-50/50' : ''}
                      />
                      {conf < 80 && <p className="text-xs text-yellow-600 mt-1">Please verify this field carefully.</p>}
                    </div>
                  ))}
                  
                  <div className="pt-6 flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setIsReviewModalOpen(false)}>Cancel</Button>
                    <Button className="flex-1 gap-2" onClick={handleApprove}><CheckCircle className="h-4 w-4" /> Approve & Post to Ledger</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Inline Sparkles icon to avoid another import issue
function SparklesIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
