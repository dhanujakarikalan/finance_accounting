from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class InvoiceBase(BaseModel):
    vendor_name: Optional[str] = "Unknown Vendor"
    invoice_number: Optional[str] = None
    invoice_date: Optional[str] = None
    gst_number: Optional[str] = None
    currency: Optional[str] = "USD"
    subtotal: Optional[float] = 0.0
    tax: Optional[float] = 0.0
    total: Optional[float] = 0.0
    status: Optional[str] = "Auto-Approved"
    approval: Optional[bool] = True

class InvoiceCreate(BaseModel):
    vendor_name: Optional[str] = Field(default="Unknown Vendor", alias="vendor")
    invoice_number: Optional[str] = Field(default=None, alias="invoiceNumber")
    invoice_date: Optional[str] = Field(default=None, alias="date")
    gst_number: Optional[str] = Field(default=None, alias="gst")
    currency: Optional[str] = "USD"
    subtotal: Optional[float] = 0.0
    tax: Optional[float] = 0.0
    total: Optional[float] = Field(default=0.0, alias="amount")
    status: Optional[str] = "Auto-Approved"
    approval: Optional[bool] = True

    class Config:
        populate_by_name = True
        extra = "allow"

class InvoiceUpdate(BaseModel):
    id: Optional[int] = None
    invoice_number: Optional[str] = Field(default=None, alias="invoiceNumber")
    vendor_name: Optional[str] = Field(default=None, alias="vendor")
    invoice_date: Optional[str] = Field(default=None, alias="date")
    gst_number: Optional[str] = Field(default=None, alias="gst")
    currency: Optional[str] = None
    subtotal: Optional[float] = None
    tax: Optional[float] = None
    total: Optional[float] = Field(default=None, alias="amount")
    status: Optional[str] = None
    approval: Optional[bool] = None

    class Config:
        populate_by_name = True
        extra = "allow"

class InvoiceResponse(InvoiceBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ReconciliationRequest(BaseModel):
    vendor_name: Optional[str] = Field(default=None, alias="vendor")
    invoice_number: Optional[str] = Field(default=None, alias="invoiceNumber")
    total: Optional[float] = Field(default=0.0, alias="amount")

    class Config:
        populate_by_name = True
        extra = "allow"

class ReconciliationResponse(BaseModel):
    approved: bool
    reason: str

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str

class ReportResponse(BaseModel):
    total_invoices: int
    total_revenue: float
    total_expenses: float
    net_profit: float
    monthly_trend: List[Dict[str, Any]]
    expense_breakdown: List[Dict[str, Any]]
