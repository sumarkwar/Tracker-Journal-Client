import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import Bubble from '../components/Bubble';
import ThreadBackground from '../components/ThreadBackground';

const bubbleColors = [
  ['rgba(251,234,240,0.35)', 'rgba(212,83,126,0.3)'],
  ['rgba(244,192,209,0.3)', 'rgba(153,53,86,0.2)'],
];

const symptoms = ['Cramps', 'Headache', 'Bloating', 'Fatigue', 'Mood swings', 'Back pain', 'Nausea'];

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #4B1528 0%, #D4537E 50%, #AFA9EC 100%)',
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
    background: 'linear-gradient(90deg, #D4537E, #7F77DD)'
  }
};
const Period = () => {
  const navigate = useNavigate();
  const [periods, setPeriods] = useState([]);
  const [nextPrediction, setNextPrediction] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [form, setForm] = useState({
    startDate: '', endDate: '', cycleLength: 28, periodLength: 5, notes: ''
  });

  useEffect(() => {
    fetchPeriods();
  }, []);

  const fetchPeriods = async () => {
    try {
      const { data } = await API.get('/period');
      setPeriods(data.periods);
      setNextPrediction(data.nextPrediction);
    } catch (err) {
      toast.error('Failed to load data');
    }
  };

  const toggleSymptom = (s) => {
    setSelectedSymptoms(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post('/period', { ...form, symptoms: selectedSymptoms });
      toast.success('Period logged!');
      setShowForm(false);
      setForm({ startDate: '', endDate: '', cycleLength: 28, periodLength: 5, notes: '' });
      setSelectedSymptoms([]);
      fetchPeriods();
    } catch (err) {
      toast.error('Failed to log period');
    }
  };

  return (
    <ThreadBackground
  gradient="linear-gradient(135deg, #4B1528 0%, #D4537E 50%, #AFA9EC 100%)"
  lineColors={['#5DCAA5', '#534AB7', '#AFA9EC', '#06B6D4']}
>
  <div style={{ padding: '16px' }}>

        <div style={styles.topBar}>
          <button onClick={() => navigate('/dashboard')} style={{
            background: 'none', border: 'none', color: '#fff',
            fontSize: '20px', cursor: 'pointer'
          }}>←</button>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#fff' }}>
            Period Tracker
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{
            background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', borderRadius: '20px', padding: '5px 14px',
            fontSize: '12px', cursor: 'pointer'
          }}>
            {showForm ? 'Cancel' : '+ Log'}
          </button>
        </div>

        {nextPrediction && (
          <div style={{ ...styles.card, background: 'rgba(212,83,126,0.25)' }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Next period predicted
            </div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', color: '#fff' }}>
              {new Date(nextPrediction).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        )}

        {showForm && (
          <div style={styles.card}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#fff', marginBottom: '14px' }}>
              Log period
            </div>
            <form onSubmit={handleAdd}>
              <label style={styles.label}>Start date</label>
              <input style={styles.input} type="date"
                value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} required />

              <label style={styles.label}>End date</label>
              <input style={styles.input} type="date"
                value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} />

              <label style={styles.label}>Cycle length (days)</label>
              <input style={styles.input} type="number" min="20" max="45"
                value={form.cycleLength} onChange={e => setForm({...form, cycleLength: e.target.value})} />

              <label style={styles.label}>Symptoms</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                {symptoms.map(s => (
                  <button key={s} type="button" onClick={() => toggleSymptom(s)} style={{
                    padding: '6px 12px', borderRadius: '20px', cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.3)',
                    background: selectedSymptoms.includes(s) ? 'rgba(212,83,126,0.5)' : 'rgba(255,255,255,0.1)',
                    color: '#fff', fontSize: '12px', fontFamily: 'DM Sans, sans-serif'
                  }}>{s}</button>
                ))}
              </div>

              <label style={styles.label}>Notes</label>
              <input style={styles.input} type="text" placeholder="Any notes..."
                value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />

              <button style={styles.button} type="submit">Save</button>
            </form>
          </div>
        )}

        <div style={styles.card}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '15px', color: '#fff', marginBottom: '12px' }}>
            History
          </div>
          {periods.length === 0 ? (
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '20px 0' }}>
              No periods logged yet
            </div>
          ) : (
            periods.map(p => (
              <div key={p._id} style={{
                padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>
                    {new Date(p.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    {p.endDate && ` — ${new Date(p.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                    Cycle: {p.cycleLength}d
                  </div>
                </div>
                {p.symptoms?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {p.symptoms.map(s => (
                      <span key={s} style={{
                        background: 'rgba(212,83,126,0.3)', borderRadius: '20px',
                        padding: '2px 8px', fontSize: '11px', color: '#fff'
                      }}>{s}</span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </ThreadBackground>
  );
};

export default Period;