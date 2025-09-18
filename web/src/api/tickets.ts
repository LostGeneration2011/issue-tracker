import { http } from './http';

export type Ticket = {
  _id: string;
  code: string;
  title: string;
  description?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assigneeEmail?: string;
  tags?: string[];
  createdAt?: string;
};

export type TicketQuery = {
  status?: Ticket['status'];
  priority?: Ticket['priority'];
  assigneeEmail?: string;
  search?: string;
  limit?: number;
  cursor?: string;
};

export async function getTickets(q: TicketQuery) {
  const params = new URLSearchParams();
  if (q.status) params.set('status', q.status);
  if (q.priority) params.set('priority', q.priority);
  if (q.assigneeEmail) params.set('assigneeEmail', q.assigneeEmail);
  if (q.search) params.set('search', q.search);
  if (q.limit) params.set('limit', String(q.limit));
  if (q.cursor) params.set('cursor', q.cursor);

  const query = params.toString() ? `?${params.toString()}` : '';
  return http.get<{ items: Ticket[]; nextCursor: string | null }>(`/tickets${query}`);
}
