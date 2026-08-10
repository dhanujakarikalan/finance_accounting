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

class BankStatement(Base):
    __tablename__ = "bank_statements"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    filename = Column(String(255), nullable=True)
    bank_name = Column(String(255), nullable=True, default="Chase Business")
    account_number = Column(String(100), nullable=True, default="****4321")
    statement_period = Column(String(100), nullable=True)
    opening_balance = Column(Float, nullable=True, default=0.0)
    closing_balance = Column(Float, nullable=True, default=0.0)
    total_transactions = Column(Integer, nullable=True, default=0)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

class BankTransaction(Base):
    __tablename__ = "bank_transactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    statement_id = Column(Integer, nullable=True)
    txn_id = Column(String(100), nullable=True)
    date = Column(String(100), nullable=True)
    description = Column(String(255), nullable=True)
    amount = Column(Float, nullable=True, default=0.0)
    amount_str = Column(String(50), nullable=True)
    matched_id = Column(String(100), nullable=True)
    match_confidence = Column(Integer, nullable=True, default=0)
    status = Column(String(100), nullable=True, default="Unreconciled")
    created_at = Column(DateTime, default=datetime.utcnow)
