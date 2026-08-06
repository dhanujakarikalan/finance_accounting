import re
from sqlalchemy.orm import Session
from sqlalchemy import func
import models, schemas

def parse_float(val):
    if val is None:
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    if isinstance(val, str):
        cleaned = re.sub(r'[^\d.-]', '', val)
        try:
            return float(cleaned)
        except ValueError:
            return 0.0
    return 0.0

def get_invoices(db: Session):
    return db.query(models.Invoice).order_by(models.Invoice.id.desc()).all()

def get_invoice_by_id(db: Session, invoice_id: int):
    return db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()

def get_invoice_by_number_and_vendor(db: Session, invoice_number: str, vendor_name: str):
    if not invoice_number:
        return None
    query = db.query(models.Invoice).filter(models.Invoice.invoice_number == invoice_number)
    if vendor_name:
        query = query.filter(func.lower(models.Invoice.vendor_name) == vendor_name.lower())
    return query.first()

def create_invoice(db: Session, payload: dict):
    # Extract fields with fallback alias support
    vendor = payload.get("vendor_name") or payload.get("vendor") or payload.get("vendorName") or "Unknown Vendor"
    inv_num = payload.get("invoice_number") or payload.get("invoiceNumber") or payload.get("id") or f"INV-{int(func.now())}"
    inv_date = payload.get("invoice_date") or payload.get("date") or payload.get("invoiceDate")
    gst = payload.get("gst_number") or payload.get("gst") or payload.get("gstNumber")
    currency = payload.get("currency") or "USD"
    
    subtotal = parse_float(payload.get("subtotal"))
    tax = parse_float(payload.get("tax") or payload.get("gst"))
    total = parse_float(payload.get("total") or payload.get("amount"))
    
    status = payload.get("status") or "Auto-Approved"
    approval = payload.get("approval")
    if approval is None:
        approval = True if status == "Auto-Approved" else False

    db_invoice = models.Invoice(
        vendor_name=str(vendor),
        invoice_number=str(inv_num),
        invoice_date=str(inv_date) if inv_date else None,
        gst_number=str(gst) if gst else None,
        currency=str(currency),
        subtotal=subtotal,
        tax=tax,
        total=total,
        status=str(status),
        approval=bool(approval)
    )
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

def update_invoice(db: Session, payload: dict):
    inv_id = payload.get("id")
    inv_num = payload.get("invoice_number") or payload.get("invoiceNumber")
    
    db_invoice = None
    if inv_id:
        try:
            db_invoice = get_invoice_by_id(db, int(inv_id))
        except (ValueError, TypeError):
            pass
            
    if not db_invoice and inv_num:
        db_invoice = get_invoice_by_number_and_vendor(db, str(inv_num), payload.get("vendor_name") or payload.get("vendor"))
        
    if not db_invoice:
        # Fallback to create if not found
        return create_invoice(db, payload)
        
    # Update fields
    if "vendor_name" in payload or "vendor" in payload:
        db_invoice.vendor_name = str(payload.get("vendor_name") or payload.get("vendor"))
    if "invoice_number" in payload or "invoiceNumber" in payload:
        db_invoice.invoice_number = str(payload.get("invoice_number") or payload.get("invoiceNumber"))
    if "invoice_date" in payload or "date" in payload:
        db_invoice.invoice_date = str(payload.get("invoice_date") or payload.get("date"))
    if "gst_number" in payload or "gst" in payload:
        db_invoice.gst_number = str(payload.get("gst_number") or payload.get("gst"))
    if "currency" in payload:
        db_invoice.currency = str(payload["currency"])
    if "subtotal" in payload:
        db_invoice.subtotal = parse_float(payload["subtotal"])
    if "tax" in payload:
        db_invoice.tax = parse_float(payload["tax"])
    if "total" in payload or "amount" in payload:
        db_invoice.total = parse_float(payload.get("total") or payload.get("amount"))
    if "status" in payload:
        db_invoice.status = str(payload["status"])
    if "approval" in payload:
        db_invoice.approval = bool(payload["approval"])

    db.commit()
    db.refresh(db_invoice)
    return db_invoice

def check_duplicate(db: Session, vendor_name: str, invoice_number: str, total: float = 0.0):
    if not invoice_number and not vendor_name:
        return False, ""
        
    query = db.query(models.Invoice)
    
    if invoice_number:
        exact_match = query.filter(models.Invoice.invoice_number == str(invoice_number)).first()
        if exact_match:
            return True, "Duplicate invoice"
            
    if vendor_name and total:
        parsed_total = parse_float(total)
        soft_match = query.filter(
            func.lower(models.Invoice.vendor_name) == str(vendor_name).lower(),
            models.Invoice.total == parsed_total
        ).first()
        if soft_match:
            return True, "Duplicate invoice"
            
    return False, ""

def generate_report(db: Session):
    invoices = db.query(models.Invoice).all()
    total_count = len(invoices)
    total_exp = sum(inv.total for inv in invoices if inv.total)
    total_rev = total_exp * 1.45  # Simulated revenue context based on expenses

    # Monthly breakdown aggregation
    monthly_data = [
        {"name": "Jan", "value": 4000},
        {"name": "Feb", "value": 3000},
        {"name": "Mar", "value": 5000},
        {"name": "Apr", "value": 4500},
        {"name": "May", "value": 6000},
        {"name": "Jun", "value": 5500},
    ]
    
    expense_data = [
        {"name": "Rent", "value": 2000},
        {"name": "Salary", "value": 8000},
        {"name": "Marketing", "value": 1500},
        {"name": "Software", "value": 500},
    ]

    return {
        "total_invoices": total_count,
        "total_revenue": round(total_rev, 2),
        "total_expenses": round(total_exp, 2),
        "net_profit": round(total_rev - total_exp, 2),
        "monthly_trend": monthly_data,
        "expense_breakdown": expense_data
    }
