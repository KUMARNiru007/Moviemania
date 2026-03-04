'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { SlideLayout } from '../SlideLayout';
import { MovieData } from '../../types';
import { TextReveal } from '../TextReveal';
import { useTheme } from '@/context/ThemeContext';
import { Trophy } from 'lucide-react';

// Helper: extract a numeric percentage from rating strings like "8.7/10", "73%", "74/100"
function ratingToPercent(value: string): number {
  if (value.includes('/100')) return parseFloat(value);
  if (value.includes('/10')) return (parseFloat(value) / 10) * 100;
  if (value.includes('%')) return parseFloat(value);
  return 50;
}

export const RatingsSlide: React.FC<{ data: MovieData }> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <SlideLayout gradientStart="#EF4444" gradientEnd="#F59E0B">
      <div className="flex-1 flex flex-col justify-center">
        <TextReveal
          text="The verdict is in."
          className={`text-4xl font-bold mb-10 ${isDark ? 'text-white' : 'text-black'}`}
        />

        {/* Ratings with animated bars */}
        <div className="space-y-6 relative">
          <div className="absolute -inset-4 bg-hero-gold blur-3xl opacity-10 rounded-3xl" />
          {data.ratings.map((rating, i) => {
            const percent = ratingToPercent(rating.value);
            return (
              <motion.div
                key={rating.source}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.3 }}
                className="relative"
              >
                <div className="flex justify-between mb-2">
                  <span className={`text-sm font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {rating.source}
                  </span>
                  <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                    {rating.value}
                  </span>
                </div>
                <div className={`h-5 rounded-full overflow-hidden ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                  <motion.div
                    className="h-full rounded-full bg-hero-gold"
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ delay: 1 + i * 0.3, duration: 1, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Awards */}
        {data.awards && data.awards !== 'N/A' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="mt-auto"
          >
            <p className={`text-sm font-mono flex items-center gap-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
              <Trophy size={16} className="text-hero-gold" /> {data.awards}
            </p>
          </motion.div>
        )}
      </div>
    </SlideLayout>
  );
};