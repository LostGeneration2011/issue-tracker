import { useState } from 'react';
import { login, register } from '../api/auth';

export default function LoginPage({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('123456');
  const [err, setErr] = useState('');

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      onLoggedIn();
    } catch (e: any) {
      setErr(e.message || 'Login failed');
    }
  }

  async function doRegister() {
    try {
      await register(email, password); // mặc định USER
      alert('Đăng ký thành công, hãy login.');
    } catch (e: any) {
      setErr(e.message || 'Register failed');
    }
  }

  return (
    <div style={{ maxWidth: 380, margin: '48px auto' }}>
      <h2>Đăng nhập</h2>
      <form onSubmit={doLogin}>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" style={{ width:'100%', marginBottom:8 }}/>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Mật khẩu" style={{ width:'100%', marginBottom:8 }}/>
        <button type="submit" style={{ width:'100%', marginBottom:8 }}>Login</button>
      </form>
      <button onClick={doRegister} style={{ width:'100%' }}>Register (USER)</button>
      {err && <p style={{ color:'red' }}>{err}</p>}
    </div>
  );
}
