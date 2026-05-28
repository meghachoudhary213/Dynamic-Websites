"use client";

import React, { useRef, useEffect } from 'react';

export default function MarbleRocksCanvas({ effect = 'marble_glow', colors = {} }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse coordinates
    const handleMouseMove = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Initialize elements based on effect
    // 1. Particle Node Mesh
    const particles = [];
    const particleCount = 65;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    // 2. Ripple Circles
    const ripples = [];
    const maxRipples = 5;

    // 3. Flowing Mist Nodes
    const mists = [];
    const mistCount = 5;
    for (let i = 0; i < mistCount; i++) {
      mists.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 200 + 150,
        color: i % 2 === 0 ? (colors.primary || '#6366f1') : (colors.secondary || '#a855f7')
      });
    }

    let frame = 0;

    // Animation Loop
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;

      // Color fallbacks
      const primaryColor = colors.primary || '#6366f1';
      const secondaryColor = colors.secondary || '#a855f7';
      const accentColor = colors.accent || '#f43f5e';

      // Render styles dynamically
      if (effect === 'electronic_grid' || effect === 'neon_grids' || effect === 'glowing_grids') {
        // Futuristic Digital Grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.lineWidth = 1;
        const gridSize = 45;

        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // Draw glowing hover node
        if (mouseRef.current.active) {
          const grad = ctx.createRadialGradient(
            mouseRef.current.x, mouseRef.current.y, 0,
            mouseRef.current.x, mouseRef.current.y, 160
          );
          grad.addColorStop(0, hexToRgba(primaryColor, 0.12));
          grad.addColorStop(0.5, hexToRgba(secondaryColor, 0.04));
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(mouseRef.current.x, mouseRef.current.y, 160, 0, Math.PI * 2);
          ctx.fill();

          // Intersecting target crosshair lines
          ctx.strokeStyle = hexToRgba(primaryColor, 0.1);
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(mouseRef.current.x, 0);
          ctx.lineTo(mouseRef.current.x, canvas.height);
          ctx.moveTo(0, mouseRef.current.y);
          ctx.lineTo(canvas.width, mouseRef.current.y);
          ctx.stroke();
        }
      } 
      
      else if (effect === 'canvas_ripples' || effect === 'river_flow') {
        // Narmada flowing water ripple wave equations
        ctx.strokeStyle = hexToRgba(primaryColor, 0.04);
        ctx.lineWidth = 1.5;

        const waveSpacing = 35;
        const speed = 0.005;

        for (let i = 0; i < canvas.height; i += waveSpacing) {
          ctx.beginPath();
          for (let x = 0; x < canvas.width; x += 10) {
            // Wave computation
            const waveY = i + Math.sin(x * 0.003 + frame * speed + i) * 12 + Math.cos(x * 0.001 + frame * speed * 0.5) * 8;
            if (x === 0) ctx.moveTo(x, waveY);
            else ctx.lineTo(x, waveY);
          }
          ctx.stroke();
        }

        // Create random subtle ripples at mouse coordinates occasionally
        if (mouseRef.current.active && frame % 10 === 0 && ripples.length < maxRipples) {
          ripples.push({
            x: mouseRef.current.x,
            y: mouseRef.current.y,
            radius: 1,
            maxRadius: Math.random() * 100 + 50,
            alpha: 0.3
          });
        }

        // Render mouse ripples
        ripples.forEach((r, idx) => {
          r.radius += 1.5;
          r.alpha -= 0.004;

          ctx.strokeStyle = hexToRgba(secondaryColor, r.alpha);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.stroke();

          // Clean finished ripples
          if (r.alpha <= 0 || r.radius >= r.maxRadius) {
            ripples.splice(idx, 1);
          }
        });
      } 
      
      else if (effect === 'cybernetic_mesh') {
        // Glowing dot connection networks
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

          ctx.fillStyle = hexToRgba(primaryColor, p.alpha);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw links between nearby particles
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100) {
              const alpha = (1 - dist / 100) * 0.15;
              ctx.strokeStyle = hexToRgba(secondaryColor, alpha);
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }

          // Link to mouse coordinates
          if (mouseRef.current.active) {
            const dx = particles[i].x - mouseRef.current.x;
            const dy = particles[i].y - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              const alpha = (1 - dist / 150) * 0.25;
              ctx.strokeStyle = hexToRgba(accentColor, alpha);
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
              ctx.stroke();
            }
          }
        }
      } 
      
      else if (effect === 'misty_parallax') {
        // Floating premium atmospheric dust mist
        mists.forEach((m) => {
          m.x += m.vx;
          m.y += m.vy;

          if (m.x - m.radius < -200 || m.x + m.radius > canvas.width + 200) m.vx *= -1;
          if (m.y - m.radius < -200 || m.y + m.radius > canvas.height + 200) m.vy *= -1;

          const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.radius);
          grad.addColorStop(0, hexToRgba(m.color, 0.05));
          grad.addColorStop(0.6, hexToRgba(m.color, 0.01));
          grad.addColorStop(1, 'transparent');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        // Interactive mouse halo
        if (mouseRef.current.active) {
          const grad = ctx.createRadialGradient(
            mouseRef.current.x, mouseRef.current.y, 0,
            mouseRef.current.x, mouseRef.current.y, 220
          );
          grad.addColorStop(0, hexToRgba(accentColor, 0.04));
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(mouseRef.current.x, mouseRef.current.y, 220, 0, Math.PI * 2);
          ctx.fill();
        }
      } 
      
      else {
        // Default: 'marble_glow'
        // Soft cosmic shimmer representation representing marble rocks
        ctx.fillStyle = 'rgba(255, 255, 255, 0.002)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Fluid shimmering colors
        const width = canvas.width;
        const height = canvas.height;

        const pulse = Math.sin(frame * 0.003) * 30;
        
        const g1 = ctx.createRadialGradient(width * 0.2, height * 0.2 + pulse, 10, width * 0.3, height * 0.3, width * 0.5);
        g1.addColorStop(0, hexToRgba(primaryColor, 0.04));
        g1.addColorStop(1, 'transparent');
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, width, height);

        const g2 = ctx.createRadialGradient(width * 0.8, height * 0.8 - pulse, 10, width * 0.7, height * 0.7, width * 0.5);
        g2.addColorStop(0, hexToRgba(secondaryColor, 0.04));
        g2.addColorStop(1, 'transparent');
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, width, height);

        // Micro light points sparkling
        if (frame % 8 === 0) {
          ripples.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: 0.1,
            maxRadius: Math.random() * 3 + 2,
            alpha: Math.random() * 0.8 + 0.2
          });
        }

        ripples.forEach((r, idx) => {
          r.radius += 0.04;
          ctx.fillStyle = `rgba(255, 255, 255, ${r.alpha})`;
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.fill();

          if (r.radius >= r.maxRadius) {
            ripples.splice(idx, 1);
          }
        });
      }

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [effect, colors]);

  // Helper utility to convert HEX colors to RGBA
  function hexToRgba(hex, alpha = 1) {
    if (!hex) return `rgba(255, 255, 255, ${alpha})`;
    
    // Check if hex is a valid string
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(char => char + char).join('');
    }
    
    if (cleanHex.length === 6) {
      const num = parseInt(cleanHex, 16);
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Check if it's already an rgb/rgba string or HSL
    if (hex.startsWith('rgb')) {
      return hex.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
    }
    
    return `rgba(99, 102, 241, ${alpha})`;
  }

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none bg-slate-950 transition-colors duration-1000" 
    />
  );
}
