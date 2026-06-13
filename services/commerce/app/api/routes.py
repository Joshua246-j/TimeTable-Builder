"""Commerce domain routes — invoices and payments.

In-memory stores back the demo endpoints. Swap them for the SQLAlchemy
`get_session` dependency (see app.core.database) to persist to RDS.
"""

from uuid import uuid4

from fastapi import APIRouter, HTTPException

from app.schemas import (
    Invoice,
    InvoiceCreate,
    InvoiceStatus,
    Payment,
    PaymentCreate,
)

router = APIRouter(tags=["commerce"])

_invoices: dict[str, Invoice] = {}
_payments: dict[str, Payment] = {}


@router.get("/invoices", response_model=list[Invoice])
async def list_invoices() -> list[Invoice]:
    return list(_invoices.values())


@router.post("/invoices", response_model=Invoice, status_code=201)
async def create_invoice(payload: InvoiceCreate) -> Invoice:
    invoice = Invoice(id=str(uuid4()), **payload.model_dump())
    _invoices[invoice.id] = invoice
    return invoice


@router.get("/invoices/{invoice_id}", response_model=Invoice)
async def get_invoice(invoice_id: str) -> Invoice:
    if invoice_id not in _invoices:
        raise HTTPException(status_code=404, detail="invoice not found")
    return _invoices[invoice_id]


@router.post("/payments", response_model=Payment, status_code=201)
async def create_payment(payload: PaymentCreate) -> Payment:
    invoice = _invoices.get(payload.invoice_id)
    if invoice is None:
        raise HTTPException(status_code=404, detail="invoice not found")
    payment = Payment(id=str(uuid4()), **payload.model_dump())
    _payments[payment.id] = payment
    invoice.status = InvoiceStatus.paid
    return payment


@router.get("/payments", response_model=list[Payment])
async def list_payments() -> list[Payment]:
    return list(_payments.values())
