'use client'

import React from 'react';
import { motion, Variants } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;    
  delay?: number;       
  highlight?: string;    
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = "",
  delay = 0,
  highlight,
}) => {

  const words = text.split(" ");

  
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: delay * 0.1,
      },
    },
  };

  /* Word animation */
  const child: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
      style={{
        overflow: "hidden",
        display: "flex",
        flexWrap: "wrap",
        gap: "0.25em",
      }}
    >
      {words.map((word, index) => {

        /* Remove punctuation for exact highlight match */
        const cleanWord = word.replace(/[.,!?]/g, "");
        const isHighlight = highlight && cleanWord === highlight;

        return (
          <motion.span
            key={index}
            variants={child}
            className={
              isHighlight
                ? "text-amber-400 italic font-[var(--font-playfair)] tracking-tight drop-shadow-[0_0_6px_rgba(251,191,36,0.35)]"
                : ""
            }
          >
            {word}
          </motion.span>
        );
      })}
    </motion.div>
  );
};