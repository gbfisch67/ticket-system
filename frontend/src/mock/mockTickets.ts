import type {Ticket} from "../components/kanbanBoard/kanbanBoard.tsx";

export const MOCK_TICKETS: Ticket[] = [
  {
    id: "FET-001",
    title: "Fix scraper CSS selector for target event site",
    status: "doing",
    priority: "high",
    workspace_id: "workspace_dev"
  },
  {
    id: "FET-002",
    title: "Implement API rate limiting for webhooks",
    status: "backlog",
    priority: "medium",
    workspace_id: "workspace_dev"
  },
  {
    id: "FET-003",
    title: "Configure CORS headers for React frontend",
    status: "done",
    priority: "high",
    workspace_id: "workspace_dev"
  },
  {
    id: "FET-004",
    title: "Handle connection timeout in scraper retry logic",
    status: "backlog",
    priority: "high",
    workspace_id: "workspace_dev"
  },
  {
    id: "FET-005",
    title: "Add dark mode toggle component in React UI",
    status: "backlog",
    priority: "low",
    workspace_id: "workspace_friend"
  }
];