import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import Bubble from '../components/Bubble';
import FloatingLines from '../components/FloatingLines';

const bubbleColors = [
  ['rgba(225,245,238,0.5)', 'rgba(29,158,117,0.3)'],
  ['rgba(238,237,254,0.4)', 'rgba(83,74,183,0.3)'],
  ['rgba(159,225,203,0.4)', 'rgba(15,110,86,0.25)']
];

const styles = {
 page: {
  minHeight: '100vh',
  background: '#020818',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden'
},
  card: {
    background: 'rgba(0, 0, 0, 0.37)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    borderRadius: '20px',
    padding: '2rem 1.8rem',
    width: '340px',
    border: '1px solid rgba(255,255,255,0.2)',
    position: 'relative',
    zIndex: 2
  },
  title: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '24px',
    fontWeight: 500,
    color: '#fff',
    marginBottom: '4px'
  },
  subtitle: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '20px',
    fontWeight: 300
  },
  tabRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px'
  },
  tab: (active) => ({
    flex: 1,
    padding: '8px',
    borderRadius: '50px',
    border: '1px solid rgba(255,255,255,0.25)',
    background: active ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.08)',
    color: active ? '#fff' : 'rgba(255,255,255,0.6)',
    fontWeight: active ? 500 : 400,
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: 'DM Sans, sans-serif'
  }),
  label: {
    display: 'block',
    fontSize: '11px',
    color: '#fff',
    marginBottom: '5px',
    fontWeight: 700,
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    textShadow: '0 1px 4px rgba(0,0,0,0.8)',
    
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: '10px',
    fontSize: '14px',
    background: 'rgba(0,0,0,0.3)',
    color: '#fff',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    marginBottom: '10px'
  },
  button: {
    width: '100%',
    padding: '11px',
    borderRadius: '50px',
    border: 'none',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    background: 'linear-gradient(90deg, #0F6E56, #534AB7)',
    color: '#fff',
    fontFamily: 'DM Sans, sans-serif',
    marginTop: '8px'
  },
  forgotLink: {
    textAlign: 'right',
    marginBottom: '8px'
  },
  switchRow: {
    textAlign: 'center',
    marginTop: '14px',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.65)'
  },
  link: {
    color: '#9FE1CB',
    textDecoration: 'underline'
  }
};

const Login = () => {
  const [tab, setTab] = useState('phone');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { identifier, password });
      login(data.user, data.token);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
    <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
  <FloatingLines
    enabledWaves={['top', 'middle', 'bottom']}
    lineCount={[8, 12, 16]}
    lineDistance={[8, 6, 4]}
    bendRadius={5.0}
    bendStrength={-0.5}
    interactive={true}
    parallax={true}
    linesGradient={['#10e49e','#20a076','#6a6a6a']}
  />
</div>
</div>
      <div style={styles.card}>
        <div style={styles.title}>Welcome back</div>
        <div style={styles.subtitle}>Sign in to continue</div>

        <div style={styles.tabRow}>
          <button style={styles.tab(tab === 'phone')} onClick={() => setTab('phone')}>Phone</button>
          <button style={styles.tab(tab === 'email')} onClick={() => setTab('email')}>Email</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>{tab === 'phone' ? 'Phone number' : 'Email address'}</label>
          <input
            style={styles.input}
            type={tab === 'phone' ? 'text' : 'email'}
            placeholder={tab === 'phone' ? '+91 98765 43210' : 'priya@email.com'}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div style={styles.forgotLink}>
            <Link to="/forgot-password" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
              Forgot password?
            </Link>
          </div>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div style={styles.switchRow}>
          No account?{' '}
          <Link to="/" style={styles.link}>Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;