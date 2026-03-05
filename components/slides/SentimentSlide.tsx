'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { SlideLayout } from '../SlideLayout';
import { MovieData } from '../../types';
import { TextReveal } from '../TextReveal';
import { useTheme } from '@/context/ThemeContext';
import { ThumbsUp, Minus, ThumbsDown } from 'lucide-react';

const sentimentConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  positive: { icon: <ThumbsUp size={28} />, color: 'text-green-400', bg: 'bg-green-500/20 border-green-500/30' },
  mixed:    { icon: <Minus size={28} />, color: 'text-yellow-400', bg: 'bg-yellow-500/20 border-yellow-500/30' },
  negative: { icon: <ThumbsDown size={28} />, color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/30' },
};

export const SentimentSlide: React.FC<{ data: MovieData }> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const sentiment = sentimentConfig[data.sentimentLabel] || sentimentConfig.mixed;

  return (
    <SlideLayout gradientStart="#10B981" gradientEnd="#3B82F6">
      <div className="flex-1 flex flex-col justify-center">
        <TextReveal
          text="What audiences think."
          highlight="audiences"
          className={`text-4xl font-bold mb-10 ${isDark ? 'text-white' : 'text-black'}`}
        />

        {/* Sentiment badge */}
        <div className="relative w-fit mb-8">
          <div className={`absolute -inset-4 blur-2xl opacity-20 rounded-full ${
            data.sentimentLabel === 'positive' ? 'bg-green-500' :
            data.sentimentLabel === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
          }`} />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className={`relative inline-flex items-center gap-3 px-6 py-3 rounded-full border ${sentiment.bg}`}
          >
            <span className={sentiment.color}>{sentiment.icon}</span>
            <span className={`text-xl font-bold capitalize ${sentiment.color}`}>
              {data.sentimentLabel}
            </span>
          </motion.div>
        </div>

        {/* AI Summary */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className={`text-lg leading-relaxed mb-8 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}
        >
          {data.sentimentSummary}
        </motion.p>

        {/* Sample reviews */}
        {data.reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="mt-auto space-y-2"
          >
            <p className={`text-xs font-mono uppercase tracking-widest mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
              From audiences
            </p>
            {data.reviews.slice(0, 2).map((review, i) => (
              <p key={i} className={`text-sm italic ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                &ldquo;{review.content.slice(0, 100)}&hellip;&rdquo; — {review.author}
              </p>
            ))}
          </motion.div>
        )}
      </div>
    </SlideLayout>
  );
};