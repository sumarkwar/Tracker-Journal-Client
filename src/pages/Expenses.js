import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import API from '../api/axios';
import toast from 'react-hot-toast';
import Bubble from '../components/Bubble';

const bubbleColors = [
  ['rgba(238,237,254,0.35)', 'rgba(83,74,183,0.3)'],
  ['rgba(225,245,238,0.3)', 'rgba(29,158,117,0.2)'],
];

const categories = ['food','transport','shopping','health','entertainment','bills','other'];
const catColors = {
  food:'#D4537E', transport:'#534AB7', shopping:'#1D9E75',
  health:'#378ADD', entertainment:'#EF9F27', bills:'#E24B4A', other:'#888780'
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #04342C 0%, #0F6E56 40%, #534AB7 100%)',
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
    background: 'linear-gradient(90deg, #0F6E56, #534AB7)'
  },
  filterBtn: (active) => ({
    padding: '6px 14px', borderRadius: '50px',
    border: '1px solid rgba(255,255,255,0.25)',
    background: active ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.08)',
    color: active ? '#fff' : 'rgba(255,255,255,0.6)',
    fontSize: '12px', cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: active ? 500 : 400
  })
};
const Expenses = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('month');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', amount: '', category: 'food', type: 'expense', note: ''
  });

  useEffect(() => {
    fetchExpenses();
  }, [filter]);

  const fetchExpenses = async () => {
    try {
      const { data } = await API.get(`/expenses?filter=${filter}`);
      setExpenses(data.expenses);
      setTotal(data.total);
    } catch (err) {
      toast.error('Failed to load expenses');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post('/expenses', form);
      toast.success('Added successfully!');
      setShowForm(false);
      setForm({ title: '', amount: '', category: 'food', type: 'expense', note: '' });
      fetchExpenses();
    } catch (err) {
      toast.error('Failed to add');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      toast.success('Deleted!');
      fetchExpenses();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const chartData = categories.map(cat => ({
    name: cat,
    amount: expenses
      .filter(e => e.category === cat && e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0)
  })).filter(d => d.amount > 0);
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
            Expenses
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{
            background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', borderRadius: '20px', padding: '5px 14px',
            fontSize: '12px', cursor: 'pointer'
          }}>
            {showForm ? 'Cancel' : '+ Add'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          {['day','week','month'].map(f => (
            <button key={f} style={styles.filterBtn(filter === f)} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
          <div style={styles.card}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total spent</div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: '#fff', marginTop: '4px' }}>
              Rs.{Math.abs(total)}
            </div>
          </div>
          <div style={styles.card}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Transactions</div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: '#fff', marginTop: '4px' }}>
              {expenses.length}
            </div>
          </div>
        </div>
        {showForm && (
          <div style={styles.card}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#fff', marginBottom: '14px' }}>
              Add new entry
            </div>
            <form onSubmit={handleAdd}>
              <label style={styles.label}>Title</label>
              <input style={styles.input} type="text" placeholder="e.g. Lunch"
                value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />

              <label style={styles.label}>Amount (Rs.)</label>
              <input style={styles.input} type="number" placeholder="150"
                value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />

              <label style={styles.label}>Type</label>
              <select style={{...styles.input, cursor: 'pointer'}}
                value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="expense" style={{background:'#0F6E56'}}>Expense</option>
                <option value="income" style={{background:'#0F6E56'}}>Income</option>
              </select>

              <label style={styles.label}>Category</label>
              <select style={{...styles.input, cursor: 'pointer'}}
                value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {categories.map(c => (
                  <option key={c} value={c} style={{background:'#0F6E56'}}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>

              <label style={styles.label}>Note (optional)</label>
              <input style={styles.input} type="text" placeholder="Any note..."
                value={form.note} onChange={e => setForm({...form, note: e.target.value})} />

              <button style={styles.button} type="submit">Add entry</button>
            </form>
          </div>
        )}

        {chartData.length > 0 && (
          <div style={styles.card}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '15px', color: '#fff', marginBottom: '12px' }}>
              Spending by category
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="amount" radius={[4,4,0,0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={catColors[entry.name] || '#888780'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div style={styles.card}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '15px', color: '#fff', marginBottom: '12px' }}>
            Recent transactions
          </div>
          {expenses.length === 0 ? (
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '20px 0' }}>
              No transactions yet. Add your first one!
            </div>
          ) : (
            expenses.map(exp => (
              <div key={exp._id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: catColors[exp.category] || '#888780'
                  }} />
                  <div>
                    <div style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>{exp.title}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>
                      {exp.category} • {new Date(exp.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    fontSize: '14px', fontWeight: 500,
                    color: exp.type === 'income' ? '#5DCAA5' : '#ED93B1'
                  }}>
                    {exp.type === 'income' ? '+' : '-'}Rs.{exp.amount}
                  </div>
                  <button onClick={() => handleDelete(exp._id)} style={{
                    background: 'rgba(255,255,255,0.1)', border: 'none',
                    color: 'rgba(255,255,255,0.6)', borderRadius: '50%',
                    width: '24px', height: '24px', cursor: 'pointer', fontSize: '12px'
                  }}>x</button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Expenses;