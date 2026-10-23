import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.abspath(os.path.join(BASE_DIR, "../../tickets.db"))

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute("""
    CREATE TABLE IF NOT EXISTS tickets (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT,
              status TEXT,
              priority TEXT,
              workspace_id TEXT
    )
    """)

    conn.commit()
    conn.close()

def generate_next_ticket_id(cursor) -> str:
    # Liefert das Ergebnis als Tuple (X,)
    cursor.execute("SELECT COUNT(*) FROM tickets")
    # Holt das Ergebnis von Z. 26 als normale Zahl
    count = cursor.fetchone()[0]

    if count == 0:
        return "FET-001"

    next_ticket_id = count + 1
    return f"FET-{next_ticket_id:03d}"

def c_ticket(ticket):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    ticket_id = generate_next_ticket_id(c)

    c.execute("""
    INSERT INTO tickets (title, status, priority, workspace_id)
    VALUES (?, ?, ?, ?, ?)
    """, (ticket_id, ticket.title, ticket.status, ticket.priority, ticket.workspace_id))

    conn.commit()
    conn.close()

    print("Ticket Inserted")

def u_ticket_status(ticket_id: str, workspace_id: str, new_status: str) -> bool:
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute(
        """
        UPDATE tickets 
        SET status = ?
        WHERE ticket_id = ? AND workspace_id = ?
    """,
        (new_status, ticket_id, workspace_id),
    )

    rows_affected = c.rowcount
    conn.commit()
    conn.close()

    return rows_affected > 0

