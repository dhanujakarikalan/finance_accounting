// src/pages/InvoiceUploadPage.jsx
import React, { useState } from "react";
import FileUploader from "../components/FileUploader";
import { Button } from "../components/ui/Button";

// Mock initial data (could be replaced by real API later)
const initialInvoices = [
  { id: "INV-2024-001", vendor: "Acme Corp", date: "2024-05-15", amount: "$1,200.00", confidence: 98, status: "Auto-Approved" },
  { id: "INV-2024-002", vendor: "Global Tech", date: "2024-05-18", amount: "$3,450.00", confidence: 76, status: "Review Needed" },
  { id: "INV-2024-003", vendor: "Stripe", date: "2024-05-20", amount: "$45.00", confidence: 99, status: "Auto-Approved" },
  { id: "INV-2024-004", vendor: "AWS Services", date: "2024-05-22", amount: "$890.00", confidence: 65, status: "Review Needed" },
];

export default function InvoiceUploadPage() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [search, setSearch] = useState("");

  const handleResult = (data) => {
    // Expect data to contain vendor, date, amount, confidence (0‑1)
    const newInvoice = {
      id: `INV-${Date.now()}`,
      vendor: data.vendor || "Unknown",
      date: data.date || new Date().toISOString().split("T")[0],
      amount: data.amount || "$0",
      confidence: Math.round((data.confidence || 0) * 100),
      status: (data.confidence || 0) >= 0.8 ? "Auto-Approved" : "Review Needed",
    };
    setInvoices((prev) => [newInvoice, ...prev]);
  };

  const filtered = invoices.filter(
    (inv) =>
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.vendor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">AI Invoice Processing</h1>
      <p className="mb-6 text-gray-600">
        Automated OCR and AP classification with Human‑in‑the‑Loop validation.
      </p>

      {/* Upload Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Upload Invoice</h2>
        <FileUploader onResult={handleResult} />
      </section>

      {/* Processed Invoices */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Processed Invoices</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search invoices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button onClick={() => setSearch("")}>
              Clear
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Invoice Number</th>
                <th className="px-4 py-2 text-left">Vendor</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">AI Confidence</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className="border-b">
                  <td className="px-4 py-2">{inv.id}</td>
                  <td className="px-4 py-2">{inv.vendor}</td>
                  <td className="px-4 py-2">{inv.date}</td>
                  <td className="px-4 py-2">{inv.amount}</td>
                  <td className="px-4 py-2">{inv.confidence}%</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-sm text-xs ${
                        inv.status === "Auto-Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {inv.status === "Review Needed" && (
                      <Button variant="outline" onClick={() => alert(`Review ${inv.id}`)}>
                        Review
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
