import React, { useEffect, useState } from 'react';
import { typewriterRoles } from '../data';

export default function GradientTypewriter({
  className = '',
  colors = ['#40f2ffff', '#4079ff', '#40fffcff', '#4079ff', '#40f9ffff'],
  animationSpeed = 3,
  typingSpeed = 90,
  deletingSpeed = 45,
  pauseDuration = 1800,
}) {
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = typewriterRoles[textIndex];
    const handleTyping = () => {
      if (isDeleting) {
        if (displayedText.length > 0) {
          setDisplayedText(currentText.substring(0, displayedText.length - 1));
        } else {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % typewriterRoles.length);
        }
      } else if (displayedText.length < currentText.length) {
        setDisplayedText(currentText.substring(0, displayedText.length + 1));
      } else {
        setTimeout(() => setIsDeleting(true), pauseDuration);
      }
    };
    const timer = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, textIndex, deletingSpeed, typingSpeed, pauseDuration]);

  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <div className={`relative flex w-full items-center justify-start ${className}`}>
      <div
        className="animate-gradient-bg inline-block bg-cover text-left text-xl font-medium text-transparent lg:text-3xl"
        style={{
          ...gradientStyle,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
        }}
      >
        <span>{displayedText}</span>
        <span
          className="animate-blink ml-1 inline-block w-0.5 bg-slate-800 dark:bg-white"
          style={{ height: '1.25em', verticalAlign: 'bottom' }}
        />
      </div>
    </div>
  );
}