import './kanbanBoard.css'
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {MOCK_TICKETS} from "../../mock/mockTickets.ts";
import PriorityBadge from "../priorityBadge/PriorityBadge.tsx";


export interface Ticket {
    id: string,
    title: string;
    status: string;
    priority: string;
    workspace_id: string;
}

const KanbanBoard = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [draggedTicketId, setDraggedTicketId] = useState<string | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

    useEffect(() => {
        if (import.meta.env.DEV) {
            setTickets(MOCK_TICKETS);
            return;
        }

        const fetchTickets = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/tickets");

                if (res.status === 401) {
                    return;
                }

                if (!res.ok) throw new Error("Failed to load");

                const data: Ticket[] = await res.json();
                setTickets(data);
            } catch (err) {
                console.error(err);
            }
        };

        void fetchTickets();
    }, [])

    const handleDragStart = (e: React.DragEvent, ticketId: string) => {
        setDraggedTicketId(ticketId)
        e.currentTarget.classList.add("dragging");
    }

    const handleDragEnd = (e: React.DragEvent) => {
        setDraggedTicketId(null);
        setDragOverColumn(null);
        e.currentTarget.classList.remove("dragging");
    };

    const handleDragOver = (e: React.DragEvent, status: string) => {
        e.preventDefault(); // Erlaubt das Drop-Event
        if (dragOverColumn !== status) {
            setDragOverColumn(status);
        }
    };

    const handleDragLeave = () => {
        setDragOverColumn(null);
    };

    const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
        e.preventDefault();
        setDragOverColumn(null);

        if (!draggedTicketId) return;

        // 1. Optimistic Update im State
        setTickets((prevTickets) =>
            prevTickets.map((ticket) =>
                ticket.id === draggedTicketId ? { ...ticket, status: targetStatus } : ticket
            )
        );

        // 2. Patch-Anfrage an dein FastAPI Backend (falls nicht im DEV-Mock)
        if (!import.meta.env.DEV) {
            try {
                await fetch(`http://127.0.0.1:8000/tickets/${draggedTicketId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: targetStatus }),
                });
            } catch (err) {
                console.error("Fehler beim Status-Update:", err);
            }
        }
    };

    const handleCreateTicket = () => {

    }

    return (
        <div className="board-site-wrapper">
            <div className="board-site-header">
                <div className="board-site-title">Kanban-Board</div>
                <div className="create-ticket-btn" onClick={handleCreateTicket}>Create Ticket</div>
            </div>
            <div className="board-wrapper">
                {["Backlog", "Doing", "Done"].map((columnStatus) => (
                <div
                    key={columnStatus}
                    className={`board-${columnStatus.toLowerCase()}-column`}
                    onDragOver={(e) => handleDragOver(e, columnStatus.toLowerCase())}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, columnStatus.toLowerCase())}
                >
                    <div className={`board-column-title ${columnStatus.toLowerCase()}`}>{columnStatus}</div>
                        {tickets
                            .filter((t) => t.status === columnStatus.toLowerCase())
                            .map((ticket) => (
                            <div
                                key={ticket.id}
                                className="ticket-wrapper"
                                draggable
                                onDragStart={(e) => handleDragStart(e, ticket.id)}
                                onDragEnd={handleDragEnd}
                            >
                                <div className="ticket-title">{ticket.title}</div>
                                <div className="ticket-badge-wrapper">
                                    <div className="ticket-id">{ticket.id}</div>
                                    <div className="ticket-priority"><PriorityBadge priority={ticket.priority} /></div>                                </div>
                            </div>                            )
                        )}
                </div>
                ))}
            </div>
        </div>
    )
}

export default KanbanBoard