import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import Bubble from '../components/Bubble';
import ThreadBackground from '../components/ThreadBackground';

const bubbleColors = [
  ['rgba(225,245,238,0.35)', 'rgba(29,158,117,0.3)'],
  ['rgba(230,241,251,0.3)', 'rgba(24,95,165,0.2)'],
];

const workoutTypes = ['Running', 'Walking', 'Cycling', 'Swimming', 'Gym', 'Yoga', 'Dance', 'Other'];

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #042C53 0%, #185FA5 40%, #1D9E75 100%)',
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
    background: 'linear-gradient(90deg, #185FA5, #1D9E75)'
  }
};
const Fitness = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    steps: '', water: '', weight: '',
    workout: { type: '', duration: '', calories: '' },
    sleep: ''
  });

  useEffect(() => {
    fetchFitness();
  }, []);

  const fetchFitness = async () => {
    try {
      const { data } = await API.get('/fitness');
      setRecords(data);
    } catch (err) {
      toast.error('Failed to load fitness data');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post('/fitness', form);
      toast.success('Logged successfully!');
      setShowForm(false);
      setForm({ steps: '', water: '', weight: '', workout: { type: '', duration: '', calories: '' }, sleep: '' });
      fetchFitness();
    } catch (err) {
      toast.error('Failed to log');
    }
  };

  const today = records[0];

  return (
    <ThreadBackground
  gradient="linear-gradient(135deg, #042C53 0%, #185FA5 40%, #1D9E75 100%)"
  lineColors={['#5DCAA5', '#534AB7', '#AFA9EC', '#06B6D4']}
>
  <div style={{ padding: '16px' }}>

        <div style={styles.topBar}>
          <button onClick={() => navigate('/dashboard')} style={{
            background: 'none', border: 'none', color: '#fff',
            fontSize: '20px', cursor: 'pointer'
          }}>←</button>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#fff' }}>
            Fitness Tracker
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{
            background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', borderRadius: '20px', padding: '5px 14px',
            fontSize: '12px', cursor: 'pointer'
          }}>
            {showForm ? 'Cancel' : '+ Log'}
          </button>
        </div>

        {today && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '12px' }}>
            {[
              { label: 'Steps', value: today.steps || 0, unit: 'steps' },
              { label: 'Water', value: today.water || 0, unit: 'glasses' },
              { label: 'Weight', value: today.weight || '--', unit: 'kg' },
              { label: 'Sleep', value: today.sleep || '--', unit: 'hrs' },
            ].map((stat, i) => (
              <div key={i} style={styles.card}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {stat.label}
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: '#fff', margin: '4px 0' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '11px', color: '#9FE1CB' }}>{stat.unit}</div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div style={styles.card}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#fff', marginBottom: '14px' }}>
              Log today
            </div>
            <form onSubmit={handleAdd}>
              <label style={styles.label}>Steps</label>
              <input style={styles.input} type="number" placeholder="e.g. 8000"
                value={form.steps} onChange={e => setForm({...form, steps: e.target.value})} />

              <label style={styles.label}>Water (glasses)</label>
              <input style={styles.input} type="number" placeholder="e.g. 8"
                value={form.water} onChange={e => setForm({...form, water: e.target.value})} />

              <label style={styles.label}>Weight (kg)</label>
              <input style={styles.input} type="number" placeholder="e.g. 60"
                value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} />

              <label style={styles.label}>Sleep (hours)</label>
              <input style={styles.input} type="number" placeholder="e.g. 7"
                value={form.sleep} onChange={e => setForm({...form, sleep: e.target.value})} />

              <label style={styles.label}>Workout type</label>
              <select style={{...styles.input, cursor: 'pointer'}}
                value={form.workout.type}
                onChange={e => setForm({...form, workout: {...form.workout, type: e.target.value}})}>
                <option value="" style={{background:'#185FA5'}}>Select workout</option>
                {workoutTypes.map(w => (
                  <option key={w} value={w} style={{background:'#185FA5'}}>{w}</option>
                ))}
              </select>

              <label style={styles.label}>Duration (minutes)</label>
              <input style={styles.input} type="number" placeholder="e.g. 30"
                value={form.workout.duration}
                onChange={e => setForm({...form, workout: {...form.workout, duration: e.target.value}})} />

              <label style={styles.label}>Calories burned</label>
              <input style={styles.input} type="number" placeholder="e.g. 200"
                value={form.workout.calories}
                onChange={e => setForm({...form, workout: {...form.workout, calories: e.target.value}})} />

              <button style={styles.button} type="submit">Save log</button>
            </form>
          </div>
        )}

        <div style={styles.card}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '15px', color: '#fff', marginBottom: '12px' }}>
            Recent logs
          </div>
          {records.length === 0 ? (
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '20px 0' }}>
              No fitness logs yet. Start tracking today!
            </div>
          ) : (
            records.slice(0, 7).map(r => (
              <div key={r._id} style={{
                padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>
                    {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                    {r.workout?.type && `${r.workout.type} • `}
                    {r.steps ? `${r.steps} steps` : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {r.water > 0 && (
                    <span style={{ fontSize: '12px', color: '#9FE1CB' }}>{r.water} glasses</span>
                  )}
                  {r.workout?.calories > 0 && (
                    <span style={{ fontSize: '12px', color: '#AFA9EC' }}>{r.workout.calories} cal</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </ThreadBackground>
  );
};

export default Fitness;