import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import Bubble from '../components/Bubble';

const bubbleColors = [
  ['rgba(238,237,254,0.35)', 'rgba(83,74,183,0.3)'],
  ['rgba(251,234,240,0.3)', 'rgba(212,83,126,0.2)'],
];

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #26215C 0%, #534AB7 50%, #4B1528 100%)',
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
    background: 'linear-gradient(90deg, #534AB7, #D4537E)'
  }
};
const Journal = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', mood: '' });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data } = await API.get('/journal');
      setEntries(data);
    } catch (err) {
      toast.error('Failed to load journal');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post('/journal', form);
      toast.success('Entry saved!');
      setShowForm(false);
      setForm({ title: '', content: '', mood: '' });
      fetchEntries();
    } catch (err) {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/journal/${id}`);
      toast.success('Entry deleted!');
      setSelected(null);
      fetchEntries();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div style={styles.page}>
      <Bubble colors={bubbleColors} />
      <div style={{ position: 'relative', zIndex: 2 }}>

        <div style={styles.topBar}>
          <button onClick={() => selected ? setSelected(null) : navigate('/dashboard')} style={{
            background: 'none', border: 'none', color: '#fff',
            fontSize: '20px', cursor: 'pointer'
          }}>←</button>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#fff' }}>
            {selected ? selected.title : 'Journal'}
          </div>
          {!selected && (
            <button onClick={() => setShowForm(!showForm)} style={{
              background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff', borderRadius: '20px', padding: '5px 14px',
              fontSize: '12px', cursor: 'pointer'
            }}>
              {showForm ? 'Cancel' : '+ New'}
            </button>
          )}
          {selected && (
            <button onClick={() => handleDelete(selected._id)} style={{
              background: 'rgba(226,75,74,0.3)', border: 'none',
              color: '#fff', borderRadius: '20px', padding: '5px 14px',
              fontSize: '12px', cursor: 'pointer'
            }}>Delete</button>
          )}
        </div>

        {selected ? (
          <div style={styles.card}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>
              {new Date(selected.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              {selected.mood && ` • ${selected.mood}`}
            </div>
            <div style={{ fontSize: '15px', color: '#fff', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
              {selected.content}
            </div>
          </div>
        ) : (
          <>
            {showForm && (
              <div style={styles.card}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#fff', marginBottom: '14px' }}>
                  New entry
                </div>
                <form onSubmit={handleAdd}>
                  <label style={styles.label}>Title</label>
                  <input style={styles.input} type="text" placeholder="Give your entry a title"
                    value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                  <label style={styles.label}>How are you feeling?</label>
                  <input style={styles.input} type="text" placeholder="e.g. Happy, Grateful, Tired"
                    value={form.mood} onChange={e => setForm({...form, mood: e.target.value})} />
                  <label style={styles.label}>Write your thoughts</label>
                  <textarea style={{...styles.input, minHeight: '150px', resize: 'vertical'}}
                    placeholder="Dear diary..."
                    value={form.content} onChange={e => setForm({...form, content: e.target.value})} required />
                  <button style={styles.button} type="submit">Save entry</button>
                </form>
              </div>
            )}

            {entries.length === 0 ? (
              <div style={{ ...styles.card, textAlign: 'center', padding: '30px' }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#fff', marginBottom: '8px' }}>
                  Your journal is empty
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                  Start writing your thoughts today
                </div>
              </div>
            ) : (
              entries.map(entry => (
                <div key={entry._id} style={{ ...styles.card, cursor: 'pointer' }}
                  onClick={() => setSelected(entry)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#fff', fontWeight: 500, marginBottom: '6px' }}>
                        {entry.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                        {new Date(entry.date).toLocaleDateString()} {entry.mood && `• ${entry.mood}`}
                      </div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.6',
                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {entry.content}
                      </div>
                    </div>
                    <div style={{ fontSize: '18px', marginLeft: '10px', opacity: 0.6 }}>→</div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Journal;