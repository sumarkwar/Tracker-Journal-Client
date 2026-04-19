import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import Bubble from '../components/Bubble';

const bubbleColors = [
  ['rgba(230,241,251,0.35)', 'rgba(24,95,165,0.3)'],
  ['rgba(225,245,238,0.3)', 'rgba(29,158,117,0.2)'],
];

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #042C53 0%, #185FA5 50%, #5DCAA5 100%)',
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
    background: 'linear-gradient(90deg, #185FA5, #5DCAA5)'
  }
};
const Medicine = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', dosage: '', times: '', startDate: '', endDate: '', notes: '', reminderEnabled: true
  });

  useEffect(() => {
    fetchMedicines();
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      checkMedicineReminders();
    }, 60000);
    return () => clearInterval(interval);
  }, [medicines]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      await Notification.requestPermission();
    }
  };

  const checkMedicineReminders = () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    medicines.forEach(med => {
      if (!med.reminderEnabled) return;
      med.times?.forEach(time => {
        if (time === currentTime) {
          if (Notification.permission === 'granted') {
            new Notification(`Time to take ${med.name}!`, {
              body: `Dosage: ${med.dosage}`,
              icon: '/favicon.ico'
            });
          }
          toast(`Time to take ${med.name}! Dosage: ${med.dosage}`, {
            icon: '💊', duration: 10000
          });
        }
      });
    });
  };

  const fetchMedicines = async () => {
    try {
      const { data } = await API.get('/medicine');
      setMedicines(data);
    } catch (err) {
      toast.error('Failed to load medicines');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const timesArray = form.times.split(',').map(t => t.trim());
      await API.post('/medicine', { ...form, times: timesArray });
      toast.success('Medicine added!');
      setShowForm(false);
      setForm({ name: '', dosage: '', times: '', startDate: '', endDate: '', notes: '', reminderEnabled: true });
      fetchMedicines();
    } catch (err) {
      toast.error('Failed to add medicine');
    }
  };

  const handleToggle = async (id, current) => {
    try {
      await API.put(`/medicine/${id}`, { reminderEnabled: !current });
      fetchMedicines();
      toast.success(current ? 'Reminder off' : 'Reminder on');
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/medicine/${id}`);
      toast.success('Deleted!');
      fetchMedicines();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };
  return (
    <div style={styles.page}>
      <Bubble colors={bubbleColors} />
      <div style={{ position: 'relative', zIndex: 2 }}>

        <div style={styles.topBar}>
          <button onClick={() => navigate('/dashboard')} style={{
            background: 'none', border: 'none', color: '#fff',
            fontSize: '20px', cursor: 'pointer'
          }}>←</button>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#fff' }}>
            Medicine Reminders
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
              Add medicine
            </div>
            <form onSubmit={handleAdd}>
              <label style={styles.label}>Medicine name</label>
              <input style={styles.input} type="text" placeholder="e.g. Paracetamol"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />

              <label style={styles.label}>Dosage</label>
              <input style={styles.input} type="text" placeholder="e.g. 500mg"
                value={form.dosage} onChange={e => setForm({...form, dosage: e.target.value})} required />

              <label style={styles.label}>Reminder times (comma separated)</label>
              <input style={styles.input} type="text" placeholder="e.g. 08:00, 14:00, 20:00"
                value={form.times} onChange={e => setForm({...form, times: e.target.value})} required />

              <label style={styles.label}>Start date</label>
              <input style={styles.input} type="date"
                value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} />

              <label style={styles.label}>End date (optional)</label>
              <input style={styles.input} type="date"
                value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} />

              <label style={styles.label}>Notes</label>
              <input style={styles.input} type="text" placeholder="e.g. Take after food"
                value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <input type="checkbox" checked={form.reminderEnabled}
                  onChange={e => setForm({...form, reminderEnabled: e.target.checked})}
                  style={{ width: '16px', height: '16px' }} />
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Enable reminder notifications</span>
              </div>

              <button style={styles.button} type="submit">Add medicine</button>
            </form>
          </div>
        )}

        {medicines.length === 0 ? (
          <div style={{ ...styles.card, textAlign: 'center', padding: '30px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>+</div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
              No medicines added yet
            </div>
          </div>
        ) : (
          medicines.map(med => (
            <div key={med._id} style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#fff', fontWeight: 500 }}>
                    {med.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
                    {med.dosage}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {med.times?.map((t, i) => (
                      <span key={i} style={{
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: '20px', padding: '3px 10px',
                        fontSize: '11px', color: '#fff'
                      }}>{t}</span>
                    ))}
                  </div>
                  {med.notes && (
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginTop: '6px' }}>
                      {med.notes}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                  <button onClick={() => handleToggle(med._id, med.reminderEnabled)} style={{
                    padding: '5px 12px', borderRadius: '20px', border: 'none',
                    background: med.reminderEnabled ? 'rgba(29,158,117,0.4)' : 'rgba(255,255,255,0.1)',
                    color: '#fff', fontSize: '11px', cursor: 'pointer'
                  }}>
                    {med.reminderEnabled ? 'Reminder ON' : 'Reminder OFF'}
                  </button>
                  <button onClick={() => handleDelete(med._id)} style={{
                    padding: '5px 12px', borderRadius: '20px', border: 'none',
                    background: 'rgba(226,75,74,0.3)', color: '#fff',
                    fontSize: '11px', cursor: 'pointer'
                  }}>Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Medicine;