from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import Dict, Any, List
import crud, schemas
from database import get_db

router = APIRouter()

@router.post("/saveInvoice")
async def save_invoice(payload: Dict[str, Any] = Body(...), db: Session = Depends(get_db)):
    try:
        db_invoice = crud.create_invoice(db, payload)
        return {
            "status": "Saved",
            "invoice": {
                "id": db_invoice.id,
                "invoice_number": db_invoice.invoice_number,
                "vendor_name": db_invoice.vendor_name,
                "total": db_invoice.total,
                "status": db_invoice.status
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save invoice: {str(e)}")

@router.get("/getInvoices")
async def get_invoices(db: Session = Depends(get_db)):
    try:
        invoices = crud.get_invoices(db)
        result = []
        for inv in invoices:
            # Format currency string for frontend compatibility
            amount_str = f"${inv.total:,.2f}" if inv.total is not None else "$0.00"
            gst_str = f"${inv.tax:,.2f}" if inv.tax is not None else "$0.00"
            result.append({
                "id": inv.invoice_number or f"INV-{inv.id}",
                "db_id": inv.id,
                "vendor": inv.vendor_name or "Unknown Vendor",
                "vendor_name": inv.vendor_name or "Unknown Vendor",
                "invoice_number": inv.invoice_number,
                "date": inv.invoice_date or "2024-05-15",
                "amount": amount_str,
                "total": inv.total or 0.0,
                "gst": gst_str,
                "tax": inv.tax or 0.0,
                "currency": inv.currency or "USD",
                "status": inv.status or "Auto-Approved",
                "approval": inv.approval,
                "confidence": 98 if inv.status == "Auto-Approved" else 75,
                "glAccount": "Office Expenses"
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve invoices: {str(e)}")

@router.post("/updateInvoice")
async def update_invoice(payload: Dict[str, Any] = Body(...), db: Session = Depends(get_db)):
    try:
        updated = crud.update_invoice(db, payload)
        return {
            "status": "Updated",
            "invoice": {
                "id": updated.id,
                "invoice_number": updated.invoice_number,
                "vendor_name": updated.vendor_name,
                "total": updated.total,
                "status": updated.status
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update invoice: {str(e)}")
