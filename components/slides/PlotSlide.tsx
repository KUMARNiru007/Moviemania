'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { SlideLayout } from '../SlideLayout';
import { MovieData } from '../../types';
import { TextReveal } from '../TextReveal';
import { useTheme } from '@/context/ThemeContext';

export const PlotSlide: React.FC<{ data: MovieData }> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <SlideLayout gradientStart="#3B82F6" gradientEnd="#8B5CF6">
      <div className="flex-1 flex flex-col justify-center">
        <TextReveal
          text="The story."
          className={`text-4xl font-bold mb-10 ${isDark ? 'text-white' : 'text-black'}`}
        />

        <div className="relative">
          <div className="absolute -inset-6 bg-hero-blue blur-3xl opacity-10 rounded-3xl" />
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className={`relative text-lg leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}
          >
            {data.plot}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-auto flex items-center gap-4"
        >
          <span className={`text-sm font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
            {data.runtime}
          </span>
          <span className={`text-sm font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
            {data.rated}
          </span>
          <span className={`text-sm font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
            $ {data.boxOffice}
          </span>
        </motion.div>
      </div>
    </SlideLayout>
  );
};