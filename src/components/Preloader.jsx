import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { profile } from '../data';

const Preloader = ({ onFinished }) => {
  const [typedText, setTypedText] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const fullText = '✨ AI/ML Engineer';

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showContent) {
      if (typedText.length < fullText.length) {
        const t = setTimeout(() => setTypedText(fullText.slice(0, typedText.length + 1)), 140);
        return () => clearTimeout(t);
      }
      if (typedText.length === fullText.length) {
        const exit = setTimeout(() => {
          setFadeOut(true);
          setTimeout(onFinished, 700);
        }, 1200);
        return () => clearTimeout(exit);
      }
    }
  }, [typedText, showContent, onFinished]);

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.7, ease: 'easeInOut' } }}
          className="bg-animated fixed inset-0 z-50 flex flex-col items-center justify-center text-white"
        >
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
              className="relative z-10 p-4 text-center"
            >
              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.2, ease: 'easeOut' } }}
                className="font-display mb-4 text-4xl font-bold md:text-6xl"
                style={{ color: '#00ffdc', textShadow: '0 2px 0 rgba(0, 255, 220, 0.45), 0 0 24px rgba(56, 189, 248, 0.35), 0 0 64px rgba(37, 99, 235, 0.28)' }}
              >
                Varun B P
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.8, delay: 0.5 } }}
                className="font-mono mb-8 text-lg text-slate-300 md:text-xl"
              >
                <span>{typedText}</span>
                <span className="animate-blink">|</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.7 } }}
                className="flex justify-center gap-6"
              >
                <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="transition-all duration-300 hover:scale-110 hover:text-[#00ffdc]">
                  <FaGithub size={32} />
                </a>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition-all duration-300 hover:scale-110 hover:text-[#00ffdc]">
                  <FaLinkedin size={32} />
                </a>
                <a href={`mailto:${profile.email}`} aria-label="Email" className="transition-all duration-300 hover:scale-110 hover:text-[#00ffdc]">
                  <FaEnvelope size={32} />
                </a>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;