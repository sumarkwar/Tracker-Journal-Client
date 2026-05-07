import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import Bubble from '../components/Bubble';
import ThreadBackground from '../components/ThreadBackground';

const bubbleColors = [
  ['rgba(225,245,238,0.35)', 'rgba(29,158,117,0.3)'],
  ['rgba(238,237,254,0.3)', 'rgba(83,74,183,0.2)'],
];

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #04342C 0%, #1D9E75 50%, #26215C 100%)',
    position: 'relative', overflow: 'hidden',
    fontFamily: 'DM Sans, sans-serif', padding: '16px'
  },
  topBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.13)',
    borderRadius: '14px', marginBottom: '14px',
    border: '1px solid rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)'
  },
  card: {
    background: 'rgba(255,255,255,0.12)',
    borderRadius: '14px', padding: '16px',
    border: '1px solid rgba(255,255,255,0.18)',
    backdropFilter: 'blur(8px)',
    marginBottom: '12px'
  },
  input: {
    width: '100%', padding: '10px 14px',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '10px', fontSize: '14px',
    background: 'rgba(255,255,255,0.12)',
    color: '#fff', outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    marginBottom: '10px'
  },
  label: {
    display: 'block', fontSize: '11px',
    color: 'rgba(255,255,255,0.75)',
    marginBottom: '5px', fontWeight: 500,
    letterSpacing: '0.6px', textTransform: 'uppercase'
  },
  button: {
    width: '100%', padding: '11px',
    borderRadius: '50px', border: 'none',
    fontSize: '14px', fontWeight: 500,
    cursor: 'pointer', color: '#fff',
    fontFamily: 'DM Sans, sans-serif',
    background: 'linear-gradient(90deg, #1D9E75, #534AB7)'
  }
};
const Habits = () => {
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', icon: '' });

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const { data } = await API.get('/habits');
      setHabits(data);
    } catch (err) {
      toast.error('Failed to load habits');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post('/habits', form);
      toast.success('Habit added!');
      setShowForm(false);
      setForm({ name: '', icon: '' });
      fetchHabits();
    } catch (err) {
      toast.error('Failed to add habit');
    }
  };

  const handleComplete = async (id) => {
    try {
      await API.put(`/habits/${id}/complete`);
      toast.success('Great job!');
      fetchHabits();
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/habits/${id}`);
      toast.success('Habit removed!');
      fetchHabits();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const isCompletedToday = (habit) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return habit.completedDates?.some(d => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === today.getTime();
    });
  };

  return (
    <ThreadBackground
  gradient="linear-gradient(135deg, #04342C 0%, #1D9E75 50%, #26215C 100%)"
  lineColors={['#5DCAA5', '#534AB7', '#AFA9EC', '#06B6D4']}
>
  <div style={{ padding: '16px' }}>

        <div style={styles.topBar}>
          <button onClick={() => navigate('/dashboard')} style={{
            background: 'none', border: 'none', color: '#fff',
            fontSize: '20px', cursor: 'pointer'
          }}>←</button>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#fff' }}>
            Daily Habits
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{
            background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', borderRadius: '20px', padding: '5px 14px',
            fontSize: '12px', cursor: 'pointer'
          }}>
            {showForm ? 'Cancel' : '+ Add'}
          </button>
        </div>

        {showForm && (
          <div style={styles.card}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#fff', marginBottom: '14px' }}>
              New habit
            </div>
            <form onSubmit={handleAdd}>
              <label style={styles.label}>Habit name</label>
              <input style={styles.input} type="text" placeholder="e.g. Drink 8 glasses of water"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              <label style={styles.label}>Icon (optional)</label>
              <input style={styles.input} type="text" placeholder="e.g. water, run, book"
                value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} />
              <button style={styles.button} type="submit">Add habit</button>
            </form>
          </div>
        )}

        <div style={styles.card}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '15px', color: '#fff', marginBottom: '4px' }}>
            Today's habits
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '14px' }}>
            {habits.filter(isCompletedToday).length}/{habits.length} completed
          </div>

          {habits.length === 0 ? (
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '20px 0' }}>
              No habits yet. Add your first one!
            </div>
          ) : (
            habits.map(habit => {
              const done = isCompletedToday(habit);
              return (
                <div key={habit._id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)'
                }}>
                  <button onClick={() => !done && handleComplete(habit._id)} style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    border: `2px solid ${done ? '#1D9E75' : 'rgba(255,255,255,0.4)'}`,
                    background: done ? '#1D9E75' : 'transparent',
                    cursor: done ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '14px', flexShrink: 0
                  }}>
                    {done ? '✓' : ''}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px', color: '#fff', fontWeight: 500,
                      textDecoration: done ? 'line-through' : 'none',
                      opacity: done ? 0.6 : 1
                    }}>
                      {habit.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                      Streak: {habit.streak} days
                    </div>
                  </div>
                  <button onClick={() => handleDelete(habit._id)} style={{
                    background: 'rgba(255,255,255,0.1)', border: 'none',
                    color: 'rgba(255,255,255,0.6)', borderRadius: '50%',
                    width: '24px', height: '24px', cursor: 'pointer', fontSize: '12px'
                  }}>x</button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </ThreadBackground>
  );
};

export default Habits;