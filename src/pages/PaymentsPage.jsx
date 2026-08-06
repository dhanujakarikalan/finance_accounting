import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { DollarSign, ArrowUpRight, ArrowDownLeft, Clock, Calendar, X } from "lucide-react";
import { cn } from "../utils/cn";
import { useGlobalState } from "../context/GlobalStateContext";

export function PaymentsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { payments, addPayment, updatePaymentStatus } = useGlobalState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("schedule"); // 'schedule' or 'receive'
  const [formEntity, setFormEntity] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formDueDate, setFormDueDate] = useState(new Date().toISOString().split('T')[0]);

  const openModal = (type) => {
    setModalType(type);
    setFormEntity("");
    setFormAmount("");
    setFormDueDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formEntity.trim() || !formAmount.trim()) return;
    
    // Ensure amount starts with $
    let formattedAmount = formAmount;
    if (!formAmount.startsWith("$")) {
      formattedAmount = `$${formAmount}`;
    }

    addPayment({
      type: modalType === "schedule" ? "outbound" : "inbound",
      entity: formEntity,
      amount: formattedAmount,
      dueDate: formDueDate,
      status: "Scheduled"
    });

    setIsModalOpen(false);
  };

  const handleAction = (payment) => {
    const nextStatus = payment.type === "outbound" ? "Paid" : "Received";
    updatePaymentStatus(payment.id, nextStatus);
  };

  const filteredPayments = activeTab === "all" ? payments : payments.filter(p => p.type === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payment Management</h1>
          <p className="text-slate-500">Schedule vendor payments and track customer receivables.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => openModal("receive")}>
            <ArrowDownLeft className="h-4 w-4" /> Receive Payment
          </Button>
          <Button className="gap-2" onClick={() => openModal("schedule")}>
            <ArrowUpRight className="h-4 w-4" /> Schedule Payment
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-slate-500">Total AP (To Pay)</h3>
              <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">$2,890.00</p>
            <p className="text-sm text-slate-500 mt-1">Due next 30 days</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-slate-500">Total AR (To Receive)</h3>
              <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center">
                <ArrowDownLeft className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">$4,650.00</p>
            <p className="text-sm text-slate-500 mt-1">Expected next 30 days</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-slate-500">Overdue AR</h3>
              <div className="h-10 w-10 bg-red-50 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">$3,450.00</p>
            <p className="text-sm text-slate-500 mt-1">Requires follow-up</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <CardTitle>Payment Schedule</CardTitle>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("all")}
              className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", activeTab === "all" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700")}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("outbound")}
              className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", activeTab === "outbound" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700")}
            >
              Payables
            </button>
            <button
              onClick={() => setActiveTab("inbound")}
              className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", activeTab === "inbound" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700")}
            >
              Receivables
            </button>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Entity</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="bg-white border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    {payment.type === 'outbound' ? (
                      <span className="flex items-center gap-1 text-blue-600 font-medium bg-blue-50 w-max px-2 py-1 rounded-md text-xs">
                        <ArrowUpRight className="h-3 w-3" /> Payable
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-600 font-medium bg-green-50 w-max px-2 py-1 rounded-md text-xs">
                        <ArrowDownLeft className="h-3 w-3" /> Receivable
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{payment.entity}</td>
                  <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" /> {payment.dueDate}
                  </td>
                  <td className="px-6 py-4 font-medium">{payment.amount}</td>
                  <td className="px-6 py-4">
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", 
                      payment.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 
                      payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      payment.status === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
                    )}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {payment.status === 'Paid' || payment.status === 'Received' ? (
                      <span className="text-xs text-slate-400 font-medium italic">Completed</span>
                    ) : (
                      payment.type === 'outbound' ? (
                        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => handleAction(payment)}>Pay Now</Button>
                      ) : (
                        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => handleAction(payment)}>Record Payment</Button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  {modalType === "schedule" ? "Schedule Vendor Payment" : "Receive Customer Payment"}
                </CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}><X className="h-5 w-5" /></Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Entity / Vendor Name</label>
                <input 
                  type="text" 
                  value={formEntity} 
                  onChange={(e) => setFormEntity(e.target.value)} 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Amount</label>
                <input 
                  type="text" 
                  value={formAmount} 
                  onChange={(e) => setFormAmount(e.target.value)} 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="e.g. $1,200.00"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Due Date</label>
                <input 
                  type="date" 
                  value={formDueDate} 
                  onChange={(e) => setFormDueDate(e.target.value)} 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button className="flex-1" onClick={handleSubmit}>Save Payment</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
