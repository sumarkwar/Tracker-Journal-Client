import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import Bubble from '../components/Bubble';
import ThreadBackground from '../components/ThreadBackground';

const bubbleColors = [
  ['rgba(251,234,240,0.35)', 'rgba(212,83,126,0.3)'],
  ['rgba(238,237,254,0.3)', 'rgba(83,74,183,0.2)'],
];

const moods = [
  { value: 'amazing', label: 'Amazing', emoji: '🌟', color: '#1D9E75' },
  { value: 'good', label: 'Good', emoji: '☀', color: '#5DCAA5' },
  { value: 'okay', label: 'Okay', emoji: '⛅', color: '#378ADD' },
  { value: 'bad', label: 'Bad', emoji: '🌧', color: '#D4537E' },
  { value: 'terrible', label: 'Terrible', emoji: '⛈', color: '#993556' },
];

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #4B1528 0%, #993556 40%, #534AB7 100%)',
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
  button: {
    width: '100%', padding: '11px',
    borderRadius: '50px', border: 'none',
    fontSize: '14px', fontWeight: 500,
    cursor: 'pointer', color: '#fff',
    fontFamily: 'DM Sans, sans-serif',
    background: 'linear-gradient(90deg, #993556, #534AB7)'
  }
};
const Mood = () => {
  const navigate = useNavigate();
  const [moodLogs, setMoodLogs] = useState([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    try {
      const { data } = await API.get('/mood');
      setMoodLogs(data);
    } catch (err) {
      toast.error('Failed to load moods');
    }
  };

  const handleAdd = async () => {
    if (!selectedMood) return toast.error('Please select a mood!');
    try {
      await API.post('/mood', { mood: selectedMood, note });
      toast.success('Mood logged!');
      setSelectedMood('');
      setNote('');
      fetchMoods();
    } catch (err) {
      toast.error('Failed to log mood');
    }
  };

  return (
    <ThreadBackground
  gradient="linear-gradient(135deg, #4B1528 0%, #993556 40%, #534AB7 100%)"
  lineColors={['#5DCAA5', '#534AB7', '#AFA9EC', '#06B6D4']}
>
  <div style={{ padding: '16px' }}>

        <div style={styles.topBar}>
          <button onClick={() => navigate('/dashboard')} style={{
            background: 'none', border: 'none', color: '#fff',
            fontSize: '20px', cursor: 'pointer'
          }}>←</button>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#fff' }}>
            Mood Tracker
          </div>
          <div style={{ width: '60px' }} />
        </div>

        <div style={styles.card}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#fff', marginBottom: '16px' }}>
            How are you feeling today?
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            {moods.map(m => (
              <div key={m.value} onClick={() => setSelectedMood(m.value)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '6px', cursor: 'pointer',
                padding: '10px 8px', borderRadius: '12px',
                background: selectedMood === m.value ? `${m.color}44` : 'transparent',
                border: selectedMood === m.value ? `1px solid ${m.color}` : '1px solid transparent',
                transition: 'all 0.2s'
              }}>
                <span style={{ fontSize: '24px' }}>{m.emoji}</span>
                <span style={{ fontSize: '11px', color: selectedMood === m.value ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          <input
            style={styles.input}
            type="text"
            placeholder="Add a note (optional)"
            value={note}
            onChange={e => setNote(e.target.value)}
          />

          <button style={styles.button} onClick={handleAdd}>
            Log mood
          </button>
        </div>

        <div style={styles.card}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '15px', color: '#fff', marginBottom: '12px' }}>
            Recent logs
          </div>
          {moodLogs.length === 0 ? (
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '20px 0' }}>
              No mood logs yet. How are you feeling today?
            </div>
          ) : (
            moodLogs.slice(0, 10).map(log => {
              const m = moods.find(x => x.value === log.mood);
              return (
                <div key={log._id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)'
                }}>
                  <span style={{ fontSize: '20px' }}>{m?.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>{m?.label}</div>
                    {log.note && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{log.note}</div>}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                    {new Date(log.date).toLocaleDateString()}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </ThreadBackground>
  );
};

export default Mood;