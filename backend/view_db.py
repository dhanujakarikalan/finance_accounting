from database import SessionLocal
from models import Invoice

def view_database():
    db = SessionLocal()
    try:
        invoices = db.query(Invoice).all()
        print("\n================================ DATABASE INVOICES ================================")
        print(f"Total Invoices Recorded: {len(invoices)}\n")
        
        header = f"{'ID':<5} | {'Invoice #':<15} | {'Vendor Name':<18} | {'Date':<12} | {'Total':<10} | {'Status':<15}"
        print(header)
        print("-" * len(header))
        
        for inv in invoices:
            print(f"{inv.id:<5} | {str(inv.invoice_number):<15} | {str(inv.vendor_name):<18} | {str(inv.invoice_date):<12} | ${inv.total:<9.2f} | {str(inv.status):<15}")
        print("====================================================================================\n")
    except Exception as e:
        print(f"Error querying database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    view_database()
