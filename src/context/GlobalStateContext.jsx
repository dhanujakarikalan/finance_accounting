import React, { createContext, useContext, useState } from 'react';

const GlobalStateContext = createContext();

export const useGlobalState = () => useContext(GlobalStateContext);

export const GlobalStateProvider = ({ children }) => {
  // --- INITIAL DATA ---
  const [invoices, setInvoices] = useState([
    { id: "INV-2024-001", vendor: "Acme Corp", date: "2024-05-15", amount: "$1,200.00", gst: "$120.00", status: "Auto-Approved", confidence: 98, glAccount: "Office Expenses" },
    { id: "INV-2024-002", vendor: "Global Tech", date: "2024-05-18", amount: "$3,450.00", gst: "$345.00", status: "Review Needed", confidence: 76, glAccount: "IT Software", fieldConfidence: { vendor: 95, date: 90, amount: 65, gst: 60, glAccount: 88 } },
    { id: "INV-2024-003", vendor: "Stripe", date: "2024-05-20", amount: "$45.00", gst: "$4.50", status: "Auto-Approved", confidence: 99, glAccount: "Bank Fees" },
    { id: "INV-2024-004", vendor: "AWS Services", date: "2024-05-22", amount: "$890.00", gst: "$89.00", status: "Review Needed", confidence: 65, glAccount: "Hosting Services", fieldConfidence: { vendor: 60, date: 95, amount: 88, gst: 92, glAccount: 70 } },
  ]);

  const [ledgerEntries, setLedgerEntries] = useState([
    { id: "JE-1001", date: "2024-05-15", description: "Office Rent", account: "Rent Expense", debit: "$2,000.00", credit: "-", status: "Posted" },
    { id: "JE-1001", date: "2024-05-15", description: "Office Rent", account: "Operating Bank Account", debit: "-", credit: "$2,000.00", status: "Posted" },
    { id: "JE-1002", date: "2024-05-18", description: "AWS Hosting", account: "IT Software", debit: "$890.00", credit: "-", status: "Unreconciled" },
    { id: "JE-1002", date: "2024-05-18", description: "AWS Hosting", account: "Accounts Payable", debit: "-", credit: "$890.00", status: "Unreconciled" },
    { id: "JE-1004", date: "2024-05-19", description: "Customer Payments", account: "Operating Bank Account", debit: "$4,500.00", credit: "-", status: "Unreconciled" },
    { id: "JE-1004", date: "2024-05-19", description: "Customer Payments", account: "Accounts Receivable", debit: "-", credit: "$4,500.00", status: "Unreconciled" },
    { id: "JE-1005", date: "2024-05-20", description: "Stationery", account: "Office Expenses", debit: "$120.00", credit: "-", status: "Unreconciled" },
    { id: "JE-1005", date: "2024-05-20", description: "Stationery", account: "Accounts Payable", debit: "-", credit: "$120.00", status: "Unreconciled" },
  ]);

  const [payments, setPayments] = useState([
    { id: "PAY-001", type: "outbound", entity: "AWS Hosting", amount: "$890.00", dueDate: "2024-05-25", status: "Scheduled" },
    { id: "PAY-002", type: "outbound", entity: "Office Rent", amount: "$2,000.00", dueDate: "2024-06-01", status: "Scheduled" },
    { id: "PAY-003", type: "inbound", entity: "Acme Corp (Inv #1024)", amount: "$1,200.00", dueDate: "2024-05-30", status: "Pending" },
    { id: "PAY-004", type: "inbound", entity: "Global Tech", amount: "$3,450.00", dueDate: "2024-06-05", status: "Overdue" },
  ]);

  const [bankFeed, setBankFeed] = useState([
    { id: "TXN-001", date: "2024-05-18", description: "AWS Hosting Services", amount: "-$890.00", matchedId: null },
    { id: "TXN-002", date: "2024-05-19", description: "Stripe Payout", amount: "+$4,500.00", matchedId: null },
    { id: "TXN-003", date: "2024-05-20", description: "Office Supplies Inc", amount: "-$125.50", matchedId: null },
  ]);

  // --- ACTIONS ---

  const approveInvoice = (invoiceId, updatedData) => {
    // 1. Update the invoice status
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId ? { ...inv, ...updatedData, status: "Manual Approved", confidence: 100 } : inv
    ));

    const approvedInv = invoices.find(inv => inv.id === invoiceId);
    if (!approvedInv) return;
    const dataToUse = updatedData || approvedInv;

    // 2. Create Journal Entry
    const newJeId = `JE-${Date.now().toString().slice(-4)}`;
    const newEntries = [
      { id: newJeId, date: dataToUse.date, description: `Invoice: ${dataToUse.vendor}`, account: dataToUse.glAccount, debit: dataToUse.amount, credit: "-", status: "Posted" },
      { id: newJeId, date: dataToUse.date, description: `Invoice: ${dataToUse.vendor}`, account: "Accounts Payable", debit: "-", credit: dataToUse.amount, status: "Posted" },
    ];
    setLedgerEntries(prev => [...newEntries, ...prev]);

    // 3. Schedule Payment
    const newPayment = {
      id: `PAY-${Date.now().toString().slice(-3)}`,
      type: "outbound",
      entity: dataToUse.vendor,
      amount: dataToUse.amount,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days from now
      status: "Scheduled"
    };
    setPayments(prev => [...prev, newPayment]);
  };

  const autoMatchBankFeed = () => {
    setBankFeed(prev => prev.map((txn, idx) => {
      if (idx === 0) return { ...txn, matchedId: "JE-1002", matchConfidence: 99 };
      if (idx === 1) return { ...txn, matchedId: "JE-1004", matchConfidence: 95 };
      if (idx === 2) return { ...txn, matchedId: "JE-1005", matchConfidence: 75 }; // Variance
      return txn;
    }));

    setLedgerEntries(prev => prev.map((je, idx) => {
      // Very naive matching for prototype
      if (je.id === "JE-1002" || je.id === "JE-1004") return { ...je, status: "Reconciled" };
      if (je.id === "JE-1005") return { ...je, status: "Variance" };
      return je;
    }));
  };

  const addInvoice = (invoiceData) => {
    const confidence = invoiceData.confidence || Math.round(Math.random() * 20 + 80);
    const status = confidence >= 85 ? "Auto-Approved" : "Review Needed";
    
    const newInvoice = {
      id: invoiceData.id || `INV-${Date.now().toString().slice(-4)}`,
      vendor: invoiceData.vendor || "Unknown Vendor",
      date: invoiceData.date || new Date().toISOString().split('T')[0],
      amount: invoiceData.amount || "$0.00",
      gst: invoiceData.gst || "$0.00",
      status: status,
      confidence: confidence,
      glAccount: invoiceData.glAccount || "Unassigned",
      fieldConfidence: invoiceData.fieldConfidence || {
        vendor: confidence - 5,
        date: confidence + 2,
        amount: confidence - 10,
        gst: confidence - 15,
        glAccount: confidence - 8
      }
    };

    setInvoices(prev => [newInvoice, ...prev]);

    if (status === "Auto-Approved") {
      const newJeId = `JE-${Date.now().toString().slice(-4)}`;
      const newEntries = [
        { id: newJeId, date: newInvoice.date, description: `Invoice: ${newInvoice.vendor}`, account: newInvoice.glAccount, debit: newInvoice.amount, credit: "-", status: "Posted" },
        { id: newJeId, date: newInvoice.date, description: `Invoice: ${newInvoice.vendor}`, account: "Accounts Payable", debit: "-", credit: newInvoice.amount, status: "Posted" },
      ];
      setLedgerEntries(prev => [...newEntries, ...prev]);

      const newPayment = {
        id: `PAY-${Date.now().toString().slice(-3)}`,
        type: "outbound",
        entity: newInvoice.vendor,
        amount: newInvoice.amount,
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "Scheduled"
      };
      setPayments(prev => [...prev, newPayment]);
    }
  };

  const updatePaymentStatus = (paymentId, newStatus) => {
    setPayments(prev => prev.map(p => 
      p.id === paymentId ? { ...p, status: newStatus } : p
    ));
  };

  const addPayment = (paymentData) => {
    const newPayment = {
      id: paymentData.id || `PAY-${Date.now().toString().slice(-3)}`,
      type: paymentData.type || "outbound",
      entity: paymentData.entity || "Unknown Entity",
      amount: paymentData.amount || "$0.00",
      dueDate: paymentData.dueDate || new Date().toISOString().split('T')[0],
      status: paymentData.status || "Scheduled"
    };
    setPayments(prev => [newPayment, ...prev]);
  };

  const updateLedgerEntryStatus = (entryId, newStatus) => {
    setLedgerEntries(prev => prev.map(entry => 
      entry.id === entryId ? { ...entry, status: newStatus } : entry
    ));
  };

  const addLedgerEntry = (entryData) => {
    const jeId = `JE-${Date.now().toString().slice(-4)}`;
    const date = entryData.date || new Date().toISOString().split('T')[0];
    const desc = entryData.description || "Manual Entry";

    const newEntries = [
      { id: jeId, date, description: desc, account: entryData.debitAccount, debit: entryData.amount, credit: "-", status: "Posted" },
      { id: jeId, date, description: desc, account: entryData.creditAccount, debit: "-", credit: entryData.amount, status: "Posted" },
    ];
    setLedgerEntries(prev => [...newEntries, ...prev]);
  };

  const [theme, setTheme] = useState("light");

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <GlobalStateContext.Provider value={{
      invoices,
      ledgerEntries,
      payments,
      bankFeed,
      approveInvoice,
      autoMatchBankFeed,
      addInvoice,
      updatePaymentStatus,
      addPayment,
      updateLedgerEntryStatus,
      addLedgerEntry,
      theme,
      changeTheme
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
