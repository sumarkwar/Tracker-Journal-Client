import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import Bubble from '../components/Bubble';

const bubbleColors = [
  ['rgba(230,241,251,0.5)', 'rgba(24,95,165,0.3)'],
  ['rgba(181,212,244,0.4)', 'rgba(55,138,221,0.25)'],
  ['rgba(225,245,238,0.4)', 'rgba(93,202,165,0.25)']
];

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #042C53 0%, #185FA5 45%, #5DCAA5 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  card: {
    background: 'rgba(255,255,255,0.12)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    borderRadius: '20px',
    padding: '2rem 1.8rem',
    width: '340px',
    border: '1px solid rgba(255,255,255,0.25)',
    position: 'relative',
    zIndex: 2
  },
  title: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '24px',
    color: '#fff',
    marginBottom: '4px'
  },
  subtitle: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '20px',
    fontWeight: 300
  },
  label: {
    display: 'block',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.75)',
    marginBottom: '5px',
    fontWeight: 500,
    letterSpacing: '0.6px',
    textTransform: 'uppercase'
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '10px',
    fontSize: '14px',
    background: 'rgba(255,255,255,0.12)',
    color: '#fff',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    marginBottom: '12px'
  },
  otpRow: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '14px'
  },
  otpBox: {
    width: '42px',
    height: '48px',
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: 500,
    border: '1px solid rgba(255,255,255,0.28)',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.12)',
    color: '#fff',
    outline: 'none'
  },
  button: (gradient) => ({
    width: '100%',
    padding: '11px',
    borderRadius: '50px',
    border: 'none',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    background: gradient,
    color: '#fff',
    fontFamily: 'DM Sans, sans-serif',
    marginBottom: '10px'
  }),
  switchRow: {
    textAlign: 'center',
    marginTop: '12px',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.65)'
  }
};

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/send-otp', { identifier });
      toast.success('OTP sent!');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    }
    setLoading(false);
  };

  const handleOtpChange = (val, idx) => {
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`).focus();
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/reset-password', {
        identifier,
        otp: otp.join(''),
        newPassword
      });
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <Bubble colors={bubbleColors} />
      <div style={styles.card}>
        <div style={styles.title}>Reset password</div>
        <div style={styles.subtitle}>
          {step === 1 ? "We'll send a code to your phone or email" : 'Enter the OTP you received'}
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <label style={styles.label}>Phone or email</label>
            <input
              style={styles.input}
              type="text"
              placeholder="+91 98765 43210"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
            <button style={styles.button('linear-gradient(90deg, #185FA5, #5DCAA5)')} type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', textAlign: 'center', marginBottom: '10px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Enter 6-digit code
            </div>
            <div style={styles.otpRow}>
              {otp.map((val, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  style={styles.otpBox}
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                />
              ))}
            </div>
            <label style={styles.label}>New password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button style={styles.button('linear-gradient(90deg, #378ADD, #5DCAA5)')} type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
        )}

        <div style={styles.switchRow}>
          <Link to="/login" style={{ color: 'rgba(255,255,255,0.65)' }}>Back to sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;