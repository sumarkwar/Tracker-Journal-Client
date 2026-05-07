import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import Bubble from '../components/Bubble';
import ThreadBackground from '../components/ThreadBackground';

const bubbleColors = [
  ['rgba(238,237,254,0.35)', 'rgba(83,74,183,0.3)'],
  ['rgba(251,234,240,0.3)', 'rgba(212,83,126,0.2)'],
];

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #26215C 0%, #534AB7 50%, #993556 100%)',
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
const Profile = () => {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const [profile, setProfile] = useState({ name: '', phone: '', email: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/user/profile');
      setProfile({ name: data.name, phone: data.phone, email: data.email || '' });
    } catch (err) {
      toast.error('Failed to load profile');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put('/user/profile', profile);
      login(data, localStorage.getItem('token'));
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error('Passwords do not match!');
    }
    try {
      await API.put('/user/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <ThreadBackground
  gradient="linear-gradient(135deg, #26215C 0%, #534AB7 50%, #993556 100%)"
  lineColors={['#5DCAA5', '#534AB7', '#AFA9EC', '#06B6D4']}
>
  <div style={{ padding: '16px' }}>

        <div style={styles.topBar}>
          <button onClick={() => navigate('/dashboard')} style={{
            background: 'none', border: 'none', color: '#fff',
            fontSize: '20px', cursor: 'pointer'
          }}>←</button>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#fff' }}>
            Profile
          </div>
          <button onClick={handleLogout} style={{
            background: 'rgba(226,75,74,0.3)', border: 'none',
            color: '#fff', borderRadius: '20px', padding: '5px 14px',
            fontSize: '12px', cursor: 'pointer'
          }}>Logout</button>
        </div>

        <div style={{ ...styles.card, textAlign: 'center', padding: '24px' }}>
          <div style={{
            width: '70px', height: '70px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #D4537E, #7F77DD)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', fontWeight: 500, color: '#fff',
            margin: '0 auto 12px'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#fff' }}>
            {user?.name}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
            {user?.phone}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          {['profile', 'password'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: '8px', borderRadius: '50px',
              border: '1px solid rgba(255,255,255,0.25)',
              background: activeTab === tab ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.08)',
              color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.6)',
              fontSize: '13px', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: activeTab === tab ? 500 : 400
            }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'profile' ? (
          <div style={styles.card}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#fff', marginBottom: '14px' }}>
              Edit profile
            </div>
            <form onSubmit={handleUpdateProfile}>
              <label style={styles.label}>Full name</label>
              <input style={styles.input} type="text"
                value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />

              <label style={styles.label}>Phone number</label>
              <input style={styles.input} type="text"
                value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />

              <label style={styles.label}>Email</label>
              <input style={styles.input} type="email" placeholder="Add email"
                value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />

              <button style={styles.button} type="submit">Save changes</button>
            </form>
          </div>
        ) : (
          <div style={styles.card}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#fff', marginBottom: '14px' }}>
              Change password
            </div>
            <form onSubmit={handleChangePassword}>
              <label style={styles.label}>Current password</label>
              <input style={styles.input} type="password" placeholder="Enter current password"
                value={passwords.currentPassword}
                onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} required />

              <label style={styles.label}>New password</label>
              <input style={styles.input} type="password" placeholder="Enter new password"
                value={passwords.newPassword}
                onChange={e => setPasswords({...passwords, newPassword: e.target.value})} required />

              <label style={styles.label}>Confirm new password</label>
              <input style={styles.input} type="password" placeholder="Confirm new password"
                value={passwords.confirmPassword}
                onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} required />

              <button style={styles.button} type="submit">Change password</button>
            </form>
          </div>
        )}

      </div>
    </ThreadBackground>
  );
};

export default Profile;