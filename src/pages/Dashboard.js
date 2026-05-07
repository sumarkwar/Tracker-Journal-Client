import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import SplashCursor from '../components/SplashCursor';
import GooeyNav from '../components/GooeyNav';
import LiquidEther from '../components/LiquidEther';

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

  const navItems = [
    { label: 'Expenses', href: '/expenses' },
    { label: 'Medicine', href: '/medicine' },
    { label: 'Period', href: '/period' },
    { label: 'Fitness', href: '/fitness' },
    { label: 'Mood', href: '/mood' },
    { label: 'Habits', href: '/habits' },
    { label: 'Journal', href: '/journal' },
    { label: 'Profile', href: '/profile' },
  ];

  const bentoItems = [
    { color: '#1a0a2e', title: 'Expenses', description: `Rs.${Math.abs(summary.expenses?.total || 0)} this week`, label: 'Finance', path: '/expenses' },
    { color: '#0a1a2e', title: 'Medicine', description: nextMedicine ? `Next: ${nextMedicine.name}` : 'No reminders set', label: 'Health', path: '/medicine' },
    { color: '#1a0a1a', title: 'Period', description: 'Track your cycle', label: 'Wellness', path: '/period' },
    { color: '#0a2e1a', title: 'Fitness', description: 'Log your workout', label: 'Activity', path: '/fitness' },
    { color: '#2e1a0a', title: 'Mood', description: todayMood ? `Feeling ${todayMood.mood}` : 'Log today\'s mood', label: 'Mental', path: '/mood' },
    { color: '#1a2e0a', title: 'Habits', description: `${completedHabits.length}/${summary.habits.length} done today`, label: 'Daily', path: '/habits' },
    { color: '#0a0a2e', title: 'Journal', description: 'Write your thoughts', label: 'Personal', path: '/journal' },
    { color: '#2e0a1a', title: 'Profile', description: `Hi, ${user?.name}`, label: 'Account', path: '/profile' },
  ];
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'DM Sans, sans-serif'
    }}>
      <style>{`
        .dash-card:hover { transform: translateY(-2px); }
        .dash-card { transition: all 0.2s; }
      `}</style>

      <SplashCursor
  SIM_RESOLUTION={64}
  DYE_RESOLUTION={512}
  DENSITY_DISSIPATION={4}
  VELOCITY_DISSIPATION={3}
  SPLAT_RADIUS={0.15}
  SPLAT_FORCE={4000}
  RAINBOW_MODE={true}
  TRANSPARENT={true}
/>

      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, opacity: 0.6
      }}>
        <LiquidEther
          colors={['#534AB7', '#D4537E', '#5DCAA5', '#AFA9EC']}
          mouseForce={15}
          resolution={0.3}
          autoDemo={true}
          autoSpeed={0.3}
        />
      </div>

      <Glitter />

      <div style={{ position: 'relative', zIndex: 2, padding: '16px' }}>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '14px', marginBottom: '14px',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(10px)'
        }}>
          <div>
            <div style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '18px', color: '#fff', fontWeight: 500
            }}>
              Hey, {user?.name} ✨
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
              {today}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={handleLogout} style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', borderRadius: '20px',
              padding: '5px 12px', fontSize: '12px', cursor: 'pointer'
            }}>Logout</button>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #D4537E, #7F77DD)',
              border: '1.5px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px', fontWeight: 500, color: '#fff'
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
          {[
            { label: 'This week', value: `Rs.${Math.abs(summary.expenses?.total || 0)}`, sub: 'expenses' },
            { label: 'Habits done', value: `${completedHabits.length}/${summary.habits.length}`, sub: 'today' },
            { label: 'Mood today', value: todayMood ? todayMood.mood : 'none', sub: 'latest log' }
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '12px', padding: '12px 10px',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)'
            }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
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
            background: 'rgba(255,255,255,0.06)', borderRadius: '12px',
            padding: '12px 14px', marginBottom: '14px',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <span style={{ fontSize: '20px' }}>💊</span>
            <div>
              <div style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>Next medicine</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                {nextMedicine.name} — {nextMedicine.times?.[0] || 'check schedule'}
              </div>
            </div>
          </div>
        )}

        <GooeyNav
          items={navItems.map(item => ({
            label: item.label,
            href: '#',
            onClick: () => navigate(item.href)
          }))}
          particleCount={12}
          particleDistances={[80, 8]}
          particleR={80}
          animationTime={500}
          colors={[1, 2, 3, 1, 2, 3, 1, 4]}
          initialActiveIndex={0}
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px'
        }}>
          {bentoItems.map((item, i) => (
            <div
              key={i}
              className="dash-card"
              onClick={() => navigate(item.path)}
              style={{
                background: item.color,
                borderRadius: '14px',
                padding: '16px',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(8px)'
              }}
            >
              <div style={{
                fontSize: '10px', fontWeight: 600,
                letterSpacing: '1px', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '8px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                {item.label}
              </div>
              <div style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '18px', color: '#fff', fontWeight: 500,
                marginBottom: '4px'
              }}>
                {item.title}
              </div>
              <div style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.55)',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                {item.description}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;