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
      transition: { staggerChildren: 0.12, delayChildren: delay * 0.1 },
    
    },
  };


  const child: Variants = {
    hidden: { opacity: 0, y: 20 },   
    visible: {
      opacity: 1,
      y: 0,                   // slides up to normal position
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
  };

  return (
    <motion.div
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap", gap: "0.25em" }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {words.map((word, index) => {
        const isHighlight = highlight && word.includes(highlight);
        return (
          <motion.span
            variants={child}
            key={index}
            className={isHighlight ? "text-hero-gold italic font-serif" : ""}
          >
            {word}
          </motion.span>
        );
      })}
    </motion.div>
  );
};