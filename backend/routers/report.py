from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import crud
from database import get_db

router = APIRouter()

@router.get("/generateReport")
async def generate_report(db: Session = Depends(get_db)):
    try:
        report = crud.generate_report(db)
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report generation error: {str(e)}")
