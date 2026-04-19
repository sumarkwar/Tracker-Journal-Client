import React, { useEffect, useRef } from 'react';

const Bubble = ({ colors }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';

    for (let i = 0; i < 14; i++) {
      const b = document.createElement('div');
      const sz = 20 + Math.random() * 85;
      const col = colors[Math.floor(Math.random() * colors.length)];
      b.style.cssText = `
        position: absolute;
        width: ${sz}px;
        height: ${sz}px;
        left: ${Math.random() * 95}%;
        bottom: ${-sz}px;
        background: ${col[0]};
        border: 1px solid ${col[1]};
        border-radius: 50%;
        animation: floatUp ${6 + Math.random() * 10}s linear ${Math.random() * 7}s infinite;
        pointer-events: none;
      `;
      container.appendChild(b);
    }
  }, [colors]);

  return <div ref={containerRef} style={{
    position: 'absolute', inset: 0,
    overflow: 'hidden', pointerEvents: 'none'
  }} />;
};

export default Bubble;