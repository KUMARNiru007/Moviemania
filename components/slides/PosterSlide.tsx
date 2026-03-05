'use client'

import React, { useEffect, useState, useRef } from 'react';
import { SlideLayout } from '../SlideLayout';
import { MovieData } from '../../types';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Download, Check, Loader2, Star, Clock, Award, Film, User, ThumbsUp, Minus, ThumbsDown } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useTheme } from '@/context/ThemeContext';

export const PosterSlide: React.FC<{ data: MovieData }> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  const sentimentIcon = data.sentimentLabel === 'positive'
    ? <ThumbsUp size={14} className="text-green-400" />
    : data.sentimentLabel === 'negative'
    ? <ThumbsDown size={14} className="text-red-400" />
    : <Minus size={14} className="text-yellow-400" />;

  const sentimentColor = data.sentimentLabel === 'positive'
    ? 'text-green-400' : data.sentimentLabel === 'negative'
    ? 'text-red-400' : 'text-yellow-400';

  // Fire confetti 
  useEffect(() => {
    const end = Date.now() + 3000;
    const frame = () => {
      confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#DC2626', '#FACC15', '#FFFFFF'] });
      confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#DC2626', '#FACC15', '#FFFFFF']});
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!posterRef.current || isDownloading) return;

    setIsDownloading(true);
    try {
      const dataUrl = await toPng(posterRef.current, { cacheBust: true, pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `moviemania-${data.imdbId}.png`;
      link.href = dataUrl;
      link.click();
      setHasDownloaded(true);
      setTimeout(() => setHasDownloaded(false), 3000);
    } catch (err) {
      console.error('Failed to generate image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <SlideLayout gradientStart="#000000" gradientEnd="#171717">
      <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto no-scrollbar">
       
        <div className="relative">
          <div className="absolute -inset-8 bg-hero-gold blur-3xl opacity-15 rounded-3xl animate-pulse-slow" />
        <motion.div
          ref={posterRef}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className={`relative w-full max-w-lg rounded-2xl border overflow-hidden ${
            isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-200'
          }`}
        >
          {/* Two-column layout: poster + info */}
          <div className="flex">
            {/* Left: Full poster image */}
            <div className="w-36 shrink-0">
              <img
                src={data.poster}
                alt={data.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: All details */}
            <div className={`flex-1 p-4 flex flex-col justify-between min-h-0`}>
              {/* Title + Rating */}
              <div>
                <h2 className={`text-lg font-bold leading-tight ${isDark ? 'text-white' : 'text-black'}`}>
                  {data.title}
                </h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star size={14} className="fill-hero-gold text-hero-gold" />
                  <span className="text-sm font-bold text-hero-gold">{data.imdbRating}/10</span>
                </div>
              </div>

              {/* Meta */}
              <div className={`flex items-center gap-2 text-[11px] mt-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                <span>{data.year}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isDark ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-200 text-neutral-500'}`}>{data.rated}</span>
                <span className="flex items-center gap-0.5"><Clock size={10} /> {data.runtime}</span>
              </div>

              {/* Genre tags */}
              <div className="flex flex-wrap gap-1 mt-2">
                {data.genre.split(', ').map((g) => (
                  <span
                    key={g}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      isDark ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Director */}
              <div className={`flex items-center gap-1.5 text-[11px] mt-3 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                <Film size={10} className={isDark ? 'text-neutral-500' : 'text-neutral-400'} />
                <span>{data.director}</span>
              </div>

              {/* Cast */}
              <div className={`flex items-start gap-1.5 text-[11px] mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                <User size={10} className={`mt-0.5 shrink-0 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                <span>{data.actors}</span>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className={`px-4 pb-4`}>
            {/* Ratings row */}
            {data.ratings.length > 0 && (
              <div className={`flex items-center justify-around text-xs py-3 border-y mt-1 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
                {data.ratings.map((r) => (
                  <div key={r.source} className="text-center">
                    <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-black'}`}>{r.value}</p>
                    <p className={`text-[10px] mt-0.5 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      {r.source.replace('Internet Movie Database', 'IMDb')}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Sentiment + Awards + Box Office */}
            <div className={`flex items-center justify-between text-[11px] mt-3 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              <div className="flex items-center gap-1.5">
                {sentimentIcon}
                <span className={`capitalize font-semibold ${sentimentColor}`}>{data.sentimentLabel}</span>
              </div>
              {data.boxOffice && data.boxOffice !== 'N/A' && (
                <span>Box Office: <span className="font-semibold">{data.boxOffice}</span></span>
              )}
            </div>

            {data.awards && data.awards !== 'N/A' && (
              <div className={`flex items-center gap-1.5 text-[11px] mt-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                <Award size={11} className="text-hero-gold shrink-0" />
                <span>{data.awards}</span>
              </div>
            )}

            {/* Brand footer */}
            <div className={`mt-3 pt-3 border-t text-center ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
              <p className={`text-[10px] font-mono tracking-[0.2em] uppercase ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>
                moviemania
              </p>
            </div>
          </div>
        </motion.div>
        </div>

        {/* Download button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={handleDownload}
          className={`mt-6 flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all active:scale-95 ${
            isDark ? 'bg-white text-black hover:bg-neutral-200' : 'bg-black text-white hover:bg-neutral-800'
          }`}
        >
          {isDownloading ? <Loader2 size={18} className="animate-spin" /> : hasDownloaded ? <Check size={18} /> : <Download size={18} />}
          {isDownloading ? 'Saving...' : hasDownloaded ? 'Saved!' : 'Save Card'}
        </motion.button>
      </div>
    </SlideLayout>
  );
};