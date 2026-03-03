import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DinoGame } from './components/DinoGame';
import { TelegramUI } from './components/TelegramUI';
import { Lock, Unlock, ShieldCheck } from 'lucide-react';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('isUnlocked') === 'true';
  });
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const UNLOCK_CODE = '21307507';

  useEffect(() => {
    localStorage.setItem('isUnlocked', isUnlocked.toString());
  }, [isUnlocked]);

  const handleLock = () => {
    setIsUnlocked(false);
    localStorage.removeItem('isUnlocked');
  };

  const handleLevelChange = (code: string) => {
    if (code === UNLOCK_CODE) {
      triggerUnlock();
    }
  };

  const triggerUnlock = () => {
    setShowUnlockAnimation(true);
    setTimeout(() => {
      setIsUnlocked(true);
      setShowUnlockAnimation(false);
    }, 3000);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            transition={{ duration: 0.8 }}
            className="h-full w-full"
          >
            <DinoGame onLevelChange={handleLevelChange} />
          </motion.div>
        ) : (
          <motion.div
            key="telegram"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="h-full w-full"
          >
            <TelegramUI onLock={handleLock} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unlock Overlay Animation */}
      <AnimatePresence>
        {showUnlockAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -45 }}
              animate={{ scale: [1, 1.2, 1], rotate: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-gold-500 mb-8"
            >
              <Unlock size={120} strokeWidth={1} />
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl font-bold golden-text tracking-widest uppercase"
            >
              Access Granted
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '200px' }}
              className="h-1 golden-gradient mt-4 rounded-full"
            />
            <p className="mt-8 text-zinc-500 font-mono text-sm animate-pulse">
              Decrypting Golden Network...
            </p>
            <div className="absolute bottom-10 flex items-center gap-2 text-gold-600/40">
              <ShieldCheck size={16} />
              <span className="text-[10px] uppercase tracking-tighter">Secure Protocol 21307507 Active</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
