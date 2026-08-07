from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional
import crud, models, schemas
from database import get_db

router = APIRouter()

@router.post("/reconcile")
async def reconcile_invoice(payload: Dict[str, Any] = Body(...), db: Session = Depends(get_db)):
    try:
        vendor = payload.get("vendor_name") or payload.get("vendor")
        inv_num = payload.get("invoice_number") or payload.get("invoiceNumber") or payload.get("id")
        total = payload.get("total") or payload.get("amount") or 0.0

        is_duplicate, reason = crud.check_duplicate(db, vendor, inv_num, total)
        
        if is_duplicate:
            return {
                "approved": False,
                "reason": "Duplicate invoice"
            }
        
        return {
            "approved": True,
            "reason": ""
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reconciliation error: {str(e)}")

@router.post("/checkDuplicate", response_model=schemas.CheckDuplicateResponse)
async def check_duplicate(payload: schemas.CheckDuplicateRequest, db: Session = Depends(get_db)):
    try:
        inv_number = payload.invoice_number
        existing_invoice = db.query(models.Invoice).filter(models.Invoice.invoice_number == inv_number).first()

        if existing_invoice:
            return {
                "duplicate": True,
                "invoice_id": existing_invoice.id,
                "message": "Duplicate invoice found"
            }

        return {
            "duplicate": False,
            "invoice_id": None,
            "message": "Invoice is unique"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error while checking duplicate: {str(e)}")
