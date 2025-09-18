import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import TicketsPage from './pages/TicketsPage';

export default function App() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => { setAuthed(!!localStorage.getItem('access_token')); }, []);
  return authed ? <TicketsPage onLogout={() => setAuthed(false)} /> : <LoginPage onLoggedIn={() => setAuthed(true)} />;
}
