import { useEffect, useMemo, useState } from 'react';
import { getTickets } from '../api/tickets';
import type { Ticket, TicketQuery } from '../api/tickets';
import { logout } from '../api/auth';

const STATUS = ['OPEN','IN_PROGRESS','RESOLVED','CLOSED'] as const;
const PRIORITY = ['LOW','MEDIUM','HIGH','CRITICAL'] as const;

export default function TicketsPage({ onLogout }: { onLogout: () => void }) {
  const [items, setItems] = useState<Ticket[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // filters
  const [status, setStatus] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [assigneeEmail, setAssigneeEmail] = useState('');
  const [search, setSearch] = useState('');

  const q = useMemo<TicketQuery>(() => ({
    status: status as any || undefined,
    priority: priority as any || undefined,
    assigneeEmail: assigneeEmail || undefined,
    search: search || undefined,
    limit: 10,
  }), [status, priority, assigneeEmail, search]);

  async function load(initial = false) {
    const res = await getTickets({ ...q, cursor: initial ? undefined : undefined }); // initial page
    setItems(res.items);
    setNextCursor(res.nextCursor);
  }

  async function loadMore() {
    if (!nextCursor) return;
    const res = await getTickets({ ...q, cursor: nextCursor });
    setItems(prev => [...prev, ...res.items]);
    setNextCursor(res.nextCursor);
  }

  useEffect(() => { load(true); }, [q.status, q.priority, q.assigneeEmail, q.search]);

  function handleLogout() {
    logout();
    onLogout();
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <h2>Tickets</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Bộ lọc */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
        <select value={status} onChange={(e)=>setStatus(e.target.value)} >
          <option value="">Status (all)</option>
          {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={priority} onChange={(e)=>setPriority(e.target.value)}>
          <option value="">Priority (all)</option>
          {PRIORITY.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <input value={assigneeEmail} onChange={(e)=>setAssigneeEmail(e.target.value)} placeholder="assigneeEmail (optional)"/>
        <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="search (title/desc/tags)"/>
      </div>

      {/* Bảng hiển thị */}
      <table border={1} cellPadding={8} cellSpacing={0} style={{ width:'100%' }}>
        <thead>
          <tr>
            <th style={{ textAlign:'left' }}>code</th>
            <th style={{ textAlign:'left' }}>title</th>
            <th>status</th>
            <th>priority</th>
            <th>assigneeEmail</th>
            <th>createdAt</th>
          </tr>
        </thead>
        <tbody>
          {items.map(t => (
            <tr key={t._id}>
              <td>{t.code}</td>
              <td>{t.title}</td>
              <td>{t.status}</td>
              <td>{t.priority}</td>
              <td>{t.assigneeEmail || '-'}</td>
              <td>{t.createdAt ? new Date(t.createdAt).toLocaleString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 12 }}>
        <button disabled={!nextCursor} onClick={loadMore}>
          {nextCursor ? 'Load more' : 'No more'}
        </button>
      </div>
    </div>
  );
}
