import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Bubble from '../components/Bubble';

const bubbleColors = [
  ['rgba(238,237,254,0.35)', 'rgba(83,74,183,0.3)'],
  ['rgba(251,234,240,0.3)', 'rgba(212,83,126,0.25)'],
  ['rgba(225,245,238,0.3)', 'rgba(29,158,117,0.2)'],
  ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.1)']
];

const glitterColors = ['#D4537E','#AFA9EC','#5DCAA5','rgba(255,255,255,0.9)','#ED93B1','#7F77DD'];

const Glitter = () => {
  const glitters = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    size: 2 + Math.random() * 6,
    left: Math.random() * 98,
    top: Math.random() * 95,
    color: glitterColors[Math.floor(Math.random() * glitterColors.length)],
    duration: 1.2 + Math.random() * 3,
    delay: Math.random() * 5,
    round: Math.random() > 0.5
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
      <style>{`
        @keyframes glitter {
          0%,100% { opacity: 0; transform: scale(0.4) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.1) rotate(60deg); }
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0.22; }
          100% { transform: translateY(-560px) scale(1.1); opacity: 0; }
        }
      `}</style>
      {glitters.map(g => (
        <div key={g.id} style={{
          position: 'absolute',
          width: g.size,
          height: g.size,
          left: `${g.left}%`,
          top: `${g.top}%`,
          background: g.color,
          borderRadius: g.round ? '50%' : '1px',
          animation: `glitter ${g.duration}s ease-in-out ${g.delay}s infinite`
        }} />
      ))}
    </div>
  );
};

const navItems = [
  { label: 'Home', path: '/dashboard', icon: '⌂' },
  { label: 'Expenses', path: '/expenses', icon: '₹' },
  { label: 'Medicine', path: '/medicine', icon: '+' },
  { label: 'Period', path: '/period', icon: 'P' },
  { label: 'Fitness', path: '/fitness', icon: 'F' },
  { label: 'Mood', path: '/mood', icon: 'M' },
  { label: 'Habits', path: '/habits', icon: 'H' },
  { label: 'Journal', path: '/journal', icon: 'J' },
  { label: 'Profile', path: '/profile', icon: 'U' },
];
const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    expenses: null, medicines: [], habits: [], moods: []
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [exp, med, hab, mood] = await Promise.all([
          API.get('/expenses?filter=week'),
          API.get('/medicine'),
          API.get('/habits'),
          API.get('/mood')
        ]);
        setSummary({
          expenses: exp.data,
          medicines: med.data,
          habits: hab.data,
          moods: mood.data
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchSummary();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const todayMood = summary.moods[0];
  const nextMedicine = summary.medicines.find(m => m.reminderEnabled);
  const completedHabits = summary.habits.filter(h => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return h.completedDates?.some(d => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === today.getTime();
    });
  });
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #26215C 0%, #534AB7 38%, #993556 70%, #1D9E75 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'DM Sans, sans-serif'
    }}>
      <style>{`
        .nav-item:hover { background: rgba(255,255,255,0.25) !important; }
        .feature-card:hover { transform: translateY(-2px); background: rgba(255,255,255,0.18) !important; }
        .feature-card { transition: all 0.2s; }
      `}</style>

      <Bubble colors={bubbleColors} />
      <Glitter />

      <div style={{ position: 'relative', zIndex: 2, padding: '16px' }}>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'rgba(255,255,255,0.13)',
          borderRadius: '14px', marginBottom: '14px',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#fff', fontWeight: 500 }}>
              Hey, {user?.name} ✨
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>{today}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={handleLogout} style={{
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff', borderRadius: '20px', padding: '5px 12px',
              fontSize: '12px', cursor: 'pointer'
            }}>Logout</button>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(212,83,126,0.55)',
              border: '1.5px solid rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 500, color: '#fff'
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex', gap: '6px', marginBottom: '16px',
          overflowX: 'auto', paddingBottom: '4px'
        }}>
          {navItems.map(item => (
            <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
              <div className="nav-item" style={{
                padding: '6px 14px', borderRadius: '50px',
                fontSize: '12px',
                color: item.path === '/dashboard' ? '#fff' : 'rgba(255,255,255,0.6)',
                background: item.path === '/dashboard' ? 'rgba(255,255,255,0.22)' : 'transparent',
                whiteSpace: 'nowrap', cursor: 'pointer',
                fontWeight: item.path === '/dashboard' ? 500 : 400
              }}>
                {item.label}
              </div>
            </Link>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
          {[
            { label: 'This week', value: summary.expenses ? `Rs.${Math.abs(summary.expenses.total)}` : '0', sub: 'expenses' },
            { label: 'Habits done', value: `${completedHabits.length}/${summary.habits.length}`, sub: 'today' },
            { label: 'Mood today', value: todayMood ? todayMood.mood : 'none', sub: 'latest log' }
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.12)',
              borderRadius: '12px', padding: '12px 10px',
              border: '1px solid rgba(255,255,255,0.18)',
              backdropFilter: 'blur(8px)'
            }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
                {stat.label}
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#fff', fontWeight: 500 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '10px', color: '#9FE1CB', marginTop: '2px' }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {nextMedicine && (
          <div style={{
            background: 'rgba(255,255,255,0.12)', borderRadius: '12px',
            padding: '12px 14px', marginBottom: '12px',
            border: '1px solid rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <span style={{ fontSize: '20px' }}>+</span>
            <div>
              <div style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>Next medicine</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                {nextMedicine.name} — {nextMedicine.times?.[0] || 'check schedule'}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {navItems.filter(n => n.path !== '/dashboard').map(item => (
            <div key={item.path} className="feature-card" onClick={() => navigate(item.path)} style={{
              background: 'rgba(255,255,255,0.11)',
              borderRadius: '12px', padding: '16px',
              border: '1px solid rgba(255,255,255,0.17)',
              backdropFilter: 'blur(8px)',
              cursor: 'pointer'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '6px' }}>{item.icon}</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '14px', color: '#fff', fontWeight: 500 }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;