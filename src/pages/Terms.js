import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Bubble from '../components/Bubble';

const bubbleColors = [
  ['rgba(238,237,254,0.35)', 'rgba(83,74,183,0.3)'],
  ['rgba(251,234,240,0.3)', 'rgba(212,83,126,0.25)'],
];

const Terms = () => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #26215C 0%, #534AB7 50%, #993556 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'DM Sans, sans-serif',
      padding: '30px 16px'
    }}>
      <Bubble colors={bubbleColors} />
      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: '680px', margin: '0 auto',
        background: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(18px)',
        borderRadius: '20px',
        padding: '2rem',
        border: '1px solid rgba(255,255,255,0.25)'
      }}>
        <div style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '26px', color: '#fff',
          marginBottom: '6px', fontWeight: 500
        }}>
          Terms & Conditions
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
          Last updated: April 2026
        </div>
        <section style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '15px', fontFamily: 'Playfair Display, serif', color: '#fff', marginBottom: '8px', fontWeight: 500 }}>
            1. Medical Disclaimer
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
            Project26 is a personal wellness tracking application designed for general informational purposes only.
            It is <strong>not a medical device</strong> and does not provide medical advice, diagnosis, or treatment.
            The information and tracking features provided through this app — including but not limited to medicine reminders,
            period tracking, fitness logging, and mood tracking — are intended solely to help users organize and monitor
            their personal health habits.<br /><br />
            <strong>This app does not replace a qualified doctor, physician, nurse, pharmacist, or any other licensed healthcare professional.</strong>
            Always seek the advice of your doctor or qualified health provider with any questions you may have regarding
            a medical condition. Never disregard professional medical advice or delay seeking it because of something
            you read or tracked in this app.
          </div>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '15px', fontFamily: 'Playfair Display, serif', color: '#fff', marginBottom: '8px', fontWeight: 500 }}>
            2. No Emergency Services
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
            Project26 is not designed for use in medical emergencies. If you are experiencing a medical emergency,
            please call your local emergency services (such as 112 in India) immediately. Do not rely on this app
            for emergency medical situations.
          </div>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '15px', fontFamily: 'Playfair Display, serif', color: '#fff', marginBottom: '8px', fontWeight: 500 }}>
            3. User Responsibilities
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
            By using this app you agree that:<br /><br />
            • You are at least 13 years of age.<br />
            • You will use this app for personal, non-commercial purposes only.<br />
            • You are responsible for maintaining the confidentiality of your account credentials.<br />
            • You will not use this app to harm, harass, or mislead others.<br />
            • You understand that health data you enter is stored securely and is only accessible by you.<br />
            • You will not hold Project26 or its developer liable for any health decisions made based on information tracked in this app.
          </div>
        </section>
        <section style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '15px', fontFamily: 'Playfair Display, serif', color: '#fff', marginBottom: '8px', fontWeight: 500 }}>
            4. Data & Privacy
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
            Your personal data including name, phone number, email, and health tracking data is stored securely
            in an encrypted database. We do not sell, share, or distribute your personal data to any third party.
            Your health data belongs to you and is only used to provide you with the app features.<br /><br />
            You may request deletion of your account and all associated data at any time by contacting us.
          </div>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '15px', fontFamily: 'Playfair Display, serif', color: '#fff', marginBottom: '8px', fontWeight: 500 }}>
            5. Limitation of Liability
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
            To the fullest extent permitted by applicable law, Project26 and its developer shall not be liable
            for any indirect, incidental, special, consequential, or punitive damages, including but not limited to
            loss of data, personal injury, or health complications arising from the use or inability to use this app.<br /><br />
            The app is provided on an "as is" and "as available" basis without warranties of any kind, either
            express or implied.
          </div>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '15px', fontFamily: 'Playfair Display, serif', color: '#fff', marginBottom: '8px', fontWeight: 500 }}>
            6. Medicine Reminders
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
            The medicine reminder feature is provided as a convenience tool only. Project26 does not verify,
            validate, or take responsibility for the accuracy of medicine names, dosages, or timings entered
            by the user. Always consult your doctor or pharmacist before taking any medication.
            Missing a reminder notification does not constitute a failure of the app and we are not responsible
            for any consequences arising from missed medications.
          </div>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '15px', fontFamily: 'Playfair Display, serif', color: '#fff', marginBottom: '8px', fontWeight: 500 }}>
            7. Period & Health Tracking
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
            The period cycle tracker and fitness tracker features provide estimates and predictions based on
            data entered by the user. These predictions are not medically accurate and should not be used
            as a substitute for medical advice. If you have concerns about your menstrual health or fitness,
            please consult a qualified healthcare professional.
          </div>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '15px', fontFamily: 'Playfair Display, serif', color: '#fff', marginBottom: '8px', fontWeight: 500 }}>
            8. Changes to Terms
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
            We reserve the right to update these Terms and Conditions at any time. Continued use of the app
            after changes are posted constitutes your acceptance of the new terms.
          </div>
        </section>

        <section style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '15px', fontFamily: 'Playfair Display, serif', color: '#fff', marginBottom: '8px', fontWeight: 500 }}>
            9. Governing Law
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
            These terms are governed by the laws of India. Any disputes arising from the use of this app
            shall be subject to the exclusive jurisdiction of the courts of India.
          </div>
        </section>
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '12px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '12px', padding: '14px',
          marginBottom: '20px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <input
            type="checkbox"
            id="agree"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ marginTop: '2px', width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <label htmlFor="agree" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.7', cursor: 'pointer' }}>
            I have read and agree to the Terms and Conditions. I understand that Project26 is not a medical
            application and does not replace professional medical advice.
          </label>
        </div>

        <button
          onClick={() => agreed && navigate('/') }
          disabled={!agreed}
          style={{
            width: '100%', padding: '12px',
            borderRadius: '50px', border: 'none',
            fontSize: '14px', fontWeight: 500,
            cursor: agreed ? 'pointer' : 'not-allowed',
            background: agreed ? 'linear-gradient(90deg, #D4537E, #7F77DD)' : 'rgba(255,255,255,0.2)',
            color: '#fff', fontFamily: 'DM Sans, sans-serif',
            transition: 'all 0.3s'
          }}>
          {agreed ? 'I Agree — Continue to App' : 'Please read and agree to continue'}
        </button>

      </div>
    </div>
  );
};

export default Terms;