'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Spark {
  id: number;
  x: number;
  y: number;
}

export default function ClickSpark() {
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newSpark = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };
      
      setSparks((prev) => [...prev, newSpark]);

      // Remove spark after animation
      setTimeout(() => {
        setSparks((prev) => prev.filter((spark) => spark.id !== newSpark.id));
      }, 1000);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {sparks.map((spark) => (
          <SparkEffect key={spark.id} x={spark.x} y={spark.y} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function SparkEffect({ x, y }: { x: number; y: number }) {
  // Create 8 particles in different directions
  const particles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 8;
    const distance = 50 + Math.random() * 30;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    };
  });

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-primary to-orange-400"
          style={{
            left: x,
            top: y,
          }}
          initial={{ 
            scale: 0,
            x: 0,
            y: 0,
            opacity: 1,
          }}
          animate={{
            scale: [0, 1, 0],
            x: particle.x,
            y: particle.y,
            opacity: [1, 1, 0],
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
          }}
        />
      ))}
      
      {/* Center bright flash */}
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-white"
        style={{
          left: x - 8,
          top: y - 8,
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 1.5, 0], opacity: [1, 0.5, 0] }}
        transition={{ duration: 0.3 }}
      />
    </>
  );
}
