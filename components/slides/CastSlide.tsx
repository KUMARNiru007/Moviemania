'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { SlideLayout } from '../SlideLayout';
import { MovieData } from '../../types';
import { TextReveal } from '../TextReveal';
import { useTheme } from '@/context/ThemeContext';

export const CastSlide: React.FC<{ data: MovieData }> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const actorList = data.actors.split(', ');
  const genreList = data.genre.split(', ');

  return (
    <SlideLayout gradientStart="#8B5CF6" gradientEnd="#3B82F6">
      <div className="flex-1 flex flex-col justify-center">
        <TextReveal
          text="The people behind the magic."
           highlight="people"
          className={`text-4xl font-bold mb-10 ${isDark ? 'text-white' : 'text-black'}`}
        />

        {/* Director */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8 relative"
        >
          <div className="absolute -inset-4 bg-hero-purple blur-2xl opacity-15 rounded-full" />
          <p className={`relative text-sm font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Directed by
          </p>
          <p className={`relative text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            {data.director}
          </p>
        </motion.div>

        {/* Cast */}
        <div className="space-y-3">
          <p className={`text-sm font-mono uppercase tracking-widest ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Starring
          </p>
          {actorList.map((actor, i) => (
            <motion.p
              key={actor}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + i * 0.2 }}
              className={`text-2xl ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}
            >
              {actor}
            </motion.p>
          ))}
        </div>

        {/* Genre tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="flex flex-wrap gap-2 mt-auto"
        >
          {genreList.map((genre) => (
            <span
              key={genre}
              className={`px-3 py-1 rounded-full text-xs font-mono ${
                isDark ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-200 text-neutral-700'
              }`}
            >
              {genre}
            </span>
          ))}
        </motion.div>
      </div>
    </SlideLayout>
  );
};