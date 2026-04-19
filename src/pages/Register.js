import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import Bubble from '../components/Bubble';

const bubbleColors = [
  ['rgba(251,234,240,0.6)', 'rgba(212,83,126,0.4)'],
  ['rgba(238,237,254,0.5)', 'rgba(127,119,221,0.35)'],
  ['rgba(244,192,209,0.5)', 'rgba(153,53,86,0.3)'],
  ['rgba(175,169,236,0.4)', 'rgba(83,74,183,0.3)']
];

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #4B1528 0%, #993556 25%, #D4537E 55%, #AFA9EC 80%, #534AB7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  card: {
    background: 'rgba(255,255,255,0.13)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    borderRadius: '20px',
    padding: '2rem 1.8rem',
    width: '340px',
    border: '1px solid rgba(255,255,255,0.28)',
    position: 'relative',
    zIndex: 2
  },
  title: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '24px',
    fontWeight: 500,
    color: '#fff',
    marginBottom: '4px',
    background: 'linear-gradient(90deg, #F4C0D1, #AFA9EC)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '20px',
    fontWeight: 300
  },
  label: {
    display: 'block',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.75)',
    marginBottom: '5px',
    fontWeight: 500,
    letterSpacing: '0.6px',
    textTransform: 'uppercase'
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '10px',
    fontSize: '14px',
    background: 'rgba(255,255,255,0.12)',
    color: '#fff',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    marginBottom: '12px'
  },
  button: {
    width: '100%',
    padding: '11px',
    borderRadius: '50px',
    border: 'none',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    background: 'linear-gradient(90deg, #D4537E, #7F77DD)',
    color: '#fff',
    fontFamily: 'DM Sans, sans-serif',
    marginTop: '8px',
    letterSpacing: '0.3px'
  },
  switchRow: {
    textAlign: 'center',
    marginTop: '14px',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.65)'
  },
  link: {
    color: '#F4C0D1',
    textDecoration: 'underline',
    cursor: 'pointer'
  }
};

const Register = () => {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      login(data.user, data.token);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <Bubble colors={bubbleColors} />
      <div style={styles.card}>
        <div style={{ fontSize: '20px', marginBottom: '8px' }}>✨</div>
        <div style={styles.title}>Create account</div>
        <div style={styles.subtitle}>Join us — it only takes a minute</div>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Full name</label>
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Priya Sharma"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Phone number</label>
          <input
            style={styles.input}
            type="text"
            name="phone"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>
            Email <span style={{ opacity: 0.5, fontSize: '10px', textTransform: 'none' }}>(optional)</span>
          </label>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="priya@email.com"
            value={form.email}
            onChange={handleChange}
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Create a password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', textAlign: 'center', marginTop: '8px' }}>
  By registering you agree to our{' '}
  <Link to="/terms" style={{ color: '#F4C0D1' }}>Terms & Conditions</Link>
</div>

        <div style={styles.switchRow}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;