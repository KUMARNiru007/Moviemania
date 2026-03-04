'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { SlideLayout } from '../SlideLayout';
import { MovieData } from '../../types';
import { TextReveal } from '../TextReveal';
import { useTheme } from '@/context/ThemeContext';

export const TitleSlide: React.FC<{ data: MovieData }> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <SlideLayout gradientStart="#F59E0B" gradientEnd="#000000">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Movie poster with scale-in animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, type: "spring" }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-hero-gold blur-3xl opacity-30 animate-pulse-slow" />
          <img
            src={data.poster}
            alt={data.title}
            className="relative z-10 w-48 h-72 object-cover rounded-lg shadow-2xl"
          />
        </motion.div>

        {/* Title with word-by-word reveal */}
        <TextReveal
          text={data.title}
          className={`text-5xl font-bold mb-4 tracking-tight ${isDark ? 'text-white' : 'text-black'}`}
          delay={0.5}
        />

        {/* Year · Rating · Runtime */}
        <TextReveal
          text={`${data.year} · ${data.rated} · ${data.runtime}`}
          className={`text-xl font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}
          delay={1.5}
        />
      </div>
    </SlideLayout>
  );
};