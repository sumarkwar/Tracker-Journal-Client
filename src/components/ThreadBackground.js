import React from 'react';
import FloatingLines from './FloatingLines';

const ThreadBackground = ({ children, gradient = 'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0a1a2e 100%)', lineColors = ['#534AB7', '#D4537E', '#5DCAA5', '#AFA9EC'] }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: gradient,
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'DM Sans, sans-serif'
    }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.4 }}>
        <FloatingLines
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[6, 8, 10]}
          lineDistance={[6, 5, 4]}
          bendRadius={5.0}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
          linesGradient={lineColors}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
};

export default ThreadBackground;