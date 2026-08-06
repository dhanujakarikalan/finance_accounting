from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from datetime import datetime
from database import Base

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    vendor_name = Column(String(255), nullable=True, default="Unknown Vendor")
    invoice_number = Column(String(255), nullable=True, index=True)
    invoice_date = Column(String(255), nullable=True)
    gst_number = Column(String(255), nullable=True)
    currency = Column(String(50), nullable=True, default="USD")
    subtotal = Column(Float, nullable=True, default=0.0)
    tax = Column(Float, nullable=True, default=0.0)
    total = Column(Float, nullable=True, default=0.0)
    status = Column(String(100), nullable=True, default="Auto-Approved")
    approval = Column(Boolean, nullable=True, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
