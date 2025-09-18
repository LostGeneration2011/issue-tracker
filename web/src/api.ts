// web/src/api.ts
export type Ticket = {
  _id: string;
  code: string;
  title: string;
  status: string;
  priority: string;
  assigneeEmail?: string;
  tags?: string[];
};

export type User = {
  _id: string;
  email: string;
  role: string;
};

// URL backend
const API_URL = "http://localhost:3000";

// Đăng ký user
export async function register(email: string, password: string, role: string = "USER") {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });
  if (!res.ok) throw new Error("Register failed");
  return res.json();
}

// Đăng nhập user
export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json(); // { access_token }
}

// Lấy tickets (cần Bearer token)
export async function getTickets(token: string, query: { limit?: number } = {}) {
  const params = new URLSearchParams(query as any).toString();
  const res = await fetch(`${API_URL}/tickets?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Get tickets failed");
  return res.json(); // { items, total }
}

// Tạo ticket mới
export async function createTicket(token: string, ticket: Omit<Ticket, "_id">) {
  const res = await fetch(`${API_URL}/tickets`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(ticket),
  });
  if (!res.ok) throw new Error("Create ticket failed");
  return res.json();
}
