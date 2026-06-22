from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, Field


class InvoiceStatus(str, Enum):
    open = "open"
    paid = "paid"
    void = "void"


class InvoiceCreate(BaseModel):
    customer_id: str
    amount: Decimal = Field(gt=0)
    currency: str = "USD"
    description: str | None = None


class Invoice(InvoiceCreate):
    id: str
    status: InvoiceStatus = InvoiceStatus.open


class PaymentCreate(BaseModel):
    invoice_id: str
    amount: Decimal = Field(gt=0)
    method: str = "card"


class Payment(PaymentCreate):
    id: str
    status: str = "succeeded"
