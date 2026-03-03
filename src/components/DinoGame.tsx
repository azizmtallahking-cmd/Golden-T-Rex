import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoldenDinoLogo } from './GoldenDinoLogo';

interface DinoGameProps {
  onLevelChange: (level: string) => void;
}

export const DinoGame: React.FC<DinoGameProps> = ({ onLevelChange }) => {
  const [level, setLevel] = useState('');
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>(null);

  // Simple Dino Game Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dinoY = 150;
    let dinoVelocity = 0;
    let isJumping = false;
    let obstacles: { x: number; width: number; height: number }[] = [];
    let clouds: { x: number; y: number; speed: number; size: number }[] = [];
    let stars: { x: number; y: number; opacity: number }[] = [];
    let frame = 0;

    // Initialize stars
    for (let i = 0; i < 50; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * 100,
        opacity: Math.random()
      });
    }

    const update = () => {
      if (isGameOver) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Stars
      stars.forEach(star => {
        ctx.fillStyle = `rgba(250, 176, 5, ${star.opacity * 0.5})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 1, 0, Math.PI * 2);
        ctx.fill();
        star.opacity = 0.2 + Math.abs(Math.sin(frame * 0.05 + star.x)); // Twinkle
      });

      // Draw Golden Sun
      const sunGlow = ctx.createRadialGradient(canvas.width - 100, 50, 0, canvas.width - 100, 50, 60);
      sunGlow.addColorStop(0, 'rgba(250, 176, 5, 0.2)');
      sunGlow.addColorStop(1, 'rgba(250, 176, 5, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(canvas.width - 100, 50, 60, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(250, 176, 5, 0.1)';
      ctx.beginPath();
      ctx.arc(canvas.width - 100, 50, 20, 0, Math.PI * 2);
      ctx.fill();

      // Draw Ground
      ctx.strokeStyle = '#fab00533';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 190);
      ctx.lineTo(canvas.width, 190);
      ctx.stroke();

      // Ground details (cracks/lines)
      for (let i = 0; i < canvas.width; i += 40) {
        const offset = (frame * 5) % 40;
        ctx.beginPath();
        ctx.moveTo(i - offset, 190);
        ctx.lineTo(i - offset - 10, 200);
        ctx.stroke();
      }

      // Golden Dust
      if (frame % 5 === 0) {
        ctx.fillStyle = 'rgba(250, 176, 5, 0.3)';
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, 185 + Math.random() * 10, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Clouds
      if (frame % 120 === 0) {
        clouds.push({
          x: canvas.width,
          y: 20 + Math.random() * 60,
          speed: 1 + Math.random() * 1.5,
          size: 20 + Math.random() * 30
        });
      }

      clouds = clouds.filter(cloud => {
        cloud.x -= cloud.speed;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.size * 0.6, cloud.y - cloud.size * 0.2, cloud.size * 0.8, 0, Math.PI * 2);
        ctx.arc(cloud.x - cloud.size * 0.6, cloud.y - cloud.size * 0.2, cloud.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
        return cloud.x > -cloud.size * 2;
      });

      // Gravity
      dinoVelocity += 0.8;
      dinoY += dinoVelocity;

      if (dinoY > 150) {
        dinoY = 150;
        dinoVelocity = 0;
        isJumping = false;
      }

      // Draw Pixelated Golden Dino
      ctx.save();
      ctx.fillStyle = '#fab005';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#fab005';
      
      // Body
      ctx.fillRect(50, dinoY, 30, 30);
      // Head
      ctx.fillRect(70, dinoY - 10, 20, 20);
      // Eye
      ctx.fillStyle = '#000';
      ctx.fillRect(82, dinoY - 5, 4, 4);
      // Tail
      ctx.fillStyle = '#fab005';
      ctx.fillRect(40, dinoY + 10, 10, 10);
      // Legs
      const legOffset = Math.sin(frame * 0.2) * 5;
      ctx.fillRect(55, dinoY + 30, 5, 5 + (isJumping ? 0 : legOffset));
      ctx.fillRect(70, dinoY + 30, 5, 5 + (isJumping ? 0 : -legOffset));
      
      ctx.restore();

      // Obstacles (Golden Spikes/Cactus)
      if (frame % 80 === 0) {
        obstacles.push({ 
          x: canvas.width, 
          width: 20 + Math.random() * 15, 
          height: 30 + Math.random() * 20 
        });
      }

      obstacles = obstacles.filter(obs => {
        obs.x -= 6 + (score / 1000); // Speed up
        
        ctx.fillStyle = '#fab005';
        ctx.globalAlpha = 0.8;
        // Draw Spike
        ctx.beginPath();
        ctx.moveTo(obs.x, 190);
        ctx.lineTo(obs.x + obs.width / 2, 190 - obs.height);
        ctx.lineTo(obs.x + obs.width, 190);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Collision
        if (obs.x < 80 && obs.x + obs.width > 50 && dinoY + 30 > 190 - obs.height) {
          setIsGameOver(true);
        }

        return obs.x > -obs.width;
      });

      setScore(prev => prev + 1);
      frame++;
      gameLoopRef.current = requestAnimationFrame(update);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (isGameOver) {
          setIsGameOver(false);
          setScore(0);
          obstacles = [];
          clouds = [];
          update();
        } else if (!isJumping) {
          dinoVelocity = -13;
          isJumping = true;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    update();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isGameOver]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLevel(val);
    onLevelChange(val);
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-[#0a0a0a] overflow-hidden font-sans">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gold-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gold-500/5 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center flex flex-col items-center z-10"
      >
        <div className="relative group w-32 h-32 mb-6">
          <div className="absolute -inset-1 bg-gold-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-500">
            <GoldenDinoLogo />
          </div>
        </div>
        <h1 className="text-5xl font-black golden-text tracking-tighter mb-2 italic">Golden T-Rex</h1>
        <p className="text-gold-500/40 uppercase tracking-[0.3em] text-[10px] font-bold">The Ultimate Golden Experience</p>
      </motion.div>

      <div className="relative z-10">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={250} 
          className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        />
        
        <AnimatePresence>
          {isGameOver && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md rounded-2xl"
            >
              <h2 className="text-4xl font-black text-red-500 mb-4 tracking-tighter italic">EXTINCT!</h2>
              <p className="text-gold-500/60 text-sm uppercase tracking-widest mb-8">Press SPACE to evolve again</p>
              <div className="flex gap-8">
                <div className="text-center">
                  <p className="text-[10px] text-zinc-500 uppercase mb-1">Final Score</p>
                  <p className="text-3xl font-bold text-white">{Math.floor(score / 10)}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 w-80 z-10">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-600 to-gold-400 rounded-xl blur opacity-20"></div>
          <input
            type="text"
            value={level}
            onChange={handleInputChange}
            placeholder="Enter Secret Level Code..."
            className="relative w-full bg-black/80 border border-white/10 rounded-xl p-4 text-gold-400 focus:outline-none focus:border-gold-500/50 transition-all text-center tracking-[0.2em] placeholder:text-zinc-700"
          />
        </div>
      </div>

      {/* Bottom Left Stats */}
      <div className="absolute bottom-8 left-8 flex flex-col gap-1 z-20">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gold-500 rounded-full shadow-[0_0_10px_rgba(250,176,5,0.5)]"></div>
          <div>
            <p className="text-[10px] text-gold-500/40 uppercase font-bold tracking-widest">Current Level</p>
            <p className="text-xl font-black text-white italic">LVL {Math.floor(score / 1000) + 1}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-[10px] text-gold-500/40 uppercase font-bold tracking-widest">Golden Score</p>
          <p className="text-3xl font-black golden-text italic">{Math.floor(score / 10)}</p>
        </div>
      </div>

      {/* Bottom Right Hint */}
      <div className="absolute bottom-8 right-8 text-right z-20">
        <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-1">Controls</p>
        <div className="flex items-center gap-2 justify-end">
          <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-gold-500/60 font-bold">SPACE</span>
          <span className="text-[10px] text-zinc-500">TO JUMP</span>
        </div>
      </div>
    </div>
  );
};
