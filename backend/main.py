from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine, SessionLocal
from routers import invoice, reconciliation, chatbot, report, bank_statement

# Initialize FastAPI application
app = FastAPI(
    title="FinCopilot AI Invoice & Accounting API",
    description="FastAPI backend connected to MySQL database with AI OCR & reconciliation",
    version="1.0.0"
)

# Configure CORS for React frontend (localhost:5173)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Automatically create database tables if missing
try:
    models.Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning creating tables: {e}")

# Seed initial invoices if empty
def seed_initial_data():
    try:
        db = SessionLocal()
        if db.query(models.Invoice).count() == 0:
            initial_invoices = [
                models.Invoice(
                    vendor_name="Acme Corp",
                    invoice_number="INV-2024-001",
                    invoice_date="2024-05-15",
                    gst_number="GST120",
                    currency="USD",
                    subtotal=1080.0,
                    tax=120.0,
                    total=1200.0,
                    status="Auto-Approved",
                    approval=True
                ),
                models.Invoice(
                    vendor_name="Global Tech",
                    invoice_number="INV-2024-002",
                    invoice_date="2024-05-18",
                    gst_number="GST345",
                    currency="USD",
                    subtotal=3105.0,
                    tax=345.0,
                    total=3450.0,
                    status="Review Needed",
                    approval=False
                ),
                models.Invoice(
                    vendor_name="Stripe",
                    invoice_number="INV-2024-003",
                    invoice_date="2024-05-20",
                    gst_number="GST4.50",
                    currency="USD",
                    subtotal=40.5,
                    tax=4.5,
                    total=45.0,
                    status="Auto-Approved",
                    approval=True
                ),
                models.Invoice(
                    vendor_name="AWS Services",
                    invoice_number="INV-2024-004",
                    invoice_date="2024-05-22",
                    gst_number="GST89",
                    currency="USD",
                    subtotal=801.0,
                    tax=89.0,
                    total=890.0,
                    status="Review Needed",
                    approval=False
                ),
            ]
            db.add_all(initial_invoices)
            db.commit()
            print("Successfully seeded initial invoice records into MySQL database.")
        db.close()
    except Exception as e:
        print(f"Seeding warning/error: {e}")

seed_initial_data()

# Include Routers
app.include_router(invoice.router, tags=["Invoices"])
app.include_router(reconciliation.router, tags=["Reconciliation"])
app.include_router(bank_statement.router, tags=["Bank Statements"])
app.include_router(chatbot.router, tags=["Chatbot"])
app.include_router(report.router, tags=["Reports"])

@app.get("/")
def root():
    return {
        "status": "API is running",
        "message": "Welcome to FinCopilot FastAPI Backend connected to MySQL."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
