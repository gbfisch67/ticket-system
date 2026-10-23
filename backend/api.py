from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
import sqlite3
from backend.database.database import init_db, c_ticket, u_ticket_status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    print("DB initialized")

    yield

    print("Shutting down")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Ticket(BaseModel):
    title: str
    status: str
    priority: str
    workspace_id: str

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.abspath(os.path.join(BASE_DIR, "../../tickets.db"))

def get_db_data():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    # Alle Tickets aus der DB holen
    cursor.execute("SELECT * FROM tickets")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.get("/tickets")
def get_tickets():
    data = get_db_data()
    return data

@app.post("/createTicket")
def create_ticket(ticket: Ticket):
    c_ticket(ticket)
    return {
        "status": "success",
        "message": "Ticket created",
        "id": ticket.id,
    }

@app.post("/updateTicket/{ticket_id}")
def patch_ticket_status(ticket_id: str, payload: Ticket):
    updated = u_ticket_status(ticket_id, payload.workspace_id, payload.status)

    if not updated:
        raise HTTPException(status_code=404, detail="Ticket not found")

    return {"message": "Status updated", "id": ticket_id}
