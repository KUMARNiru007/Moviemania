'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MovieData, SlideType } from '../types';
import { SLIDE_DURATION } from '../constants';
import { TitleSlide } from './slides/TitleSlide';
import { CastSlide } from './slides/CastSlide';
import { RatingsSlide } from './slides/RatingsSlide';
import { PlotSlide } from './slides/PlotSlide';
import { SentimentSlide } from './slides/SentimentSlide';
import { PosterSlide } from './slides/PosterSlide';
import { X, Sun, Moon, Play, Pause } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface StoryContainerProps {
  data: MovieData;
  onComplete: () => void; 
}

export const StoryContainer: React.FC<StoryContainerProps> = ({ data, onComplete }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const totalSlides = 6;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLastSlide = currentSlide === SlideType.POSTER;

  const handleNext = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
      setProgressKey(prev => prev + 1);
    } else {
      onComplete(); // exit slideshow
    }
  }, [currentSlide, onComplete]);

  const handlePrev = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      setProgressKey(prev => prev + 1);
    }
  }, [currentSlide]);


  // Auto-advance timer
  useEffect(() => {
    if (isPaused || isLastSlide) return;

    timerRef.current = setTimeout(() => {
      handleNext();
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlide, isPaused, handleNext, isLastSlide, progressKey]);

 
  // Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'Enter':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
        case ' ':
          e.preventDefault();
          if (isLastSlide) onComplete();
          else setIsPaused(prev => !prev);
          break;
        case 'Escape':
          onComplete();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onComplete, isLastSlide]);

  // Touch
  const touchStartX = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, a')) return;
    touchStartX.current = e.clientX;
    if (!isLastSlide) setIsPaused(true);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isLastSlide) setIsPaused(false);
    if ((e.target as HTMLElement).closest('button, a')) return;

    const diff = e.clientX - touchStartX.current;
    if (Math.abs(diff) < 10) {
      // It was a tap, not a swipe
      const screenWidth = window.innerWidth;
      if (e.clientX < screenWidth / 3) {
        handlePrev();  // tap left third → go back
      } else {
        handleNext();  // tap right two-thirds → go forward
      }
    }
  };

  //Render the correct slide 
  const renderSlide = () => {
    switch (currentSlide) {
      case SlideType.TITLE:     return <TitleSlide data={data} />;
      case SlideType.CAST:      return <CastSlide data={data} />;
      case SlideType.RATINGS:   return <RatingsSlide data={data} />;
      case SlideType.PLOT:      return <PlotSlide data={data} />;
      case SlideType.SENTIMENT: return <SentimentSlide data={data} />;
      case SlideType.POSTER:    return <PosterSlide data={data} />;
      default: return null;
    }
  };

  return (
    <div
      className={`fixed inset-0 w-full h-[100dvh] select-none cursor-pointer transition-colors ${
        isDark ? 'bg-black' : 'bg-white'
      }`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => !isLastSlide && setIsPaused(false)}
    >
      {/*  Progress bars*/}
      <div className="absolute top-4 left-2 right-2 flex gap-1 z-50">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <div
            key={idx}
            className={`h-1 flex-1 rounded-full overflow-hidden ${
              isDark ? 'bg-neutral-800' : 'bg-neutral-300'
            }`}
          >
            {idx < currentSlide ? (
              <div
                className={`h-full rounded-full ${
                  isDark ? 'bg-white' : 'bg-neutral-800'
                }`}
                style={{ width: '100%' }}
              />
            ) : idx === currentSlide ? (
              <div
                key={progressKey}
                className={`h-full rounded-full ${
                  isDark ? 'bg-white' : 'bg-neutral-800'
                }`}
                style={{
                  width: isLastSlide ? '100%' : isPaused ? undefined : '100%',
                  transition: isLastSlide || isPaused ? 'none' : `width ${SLIDE_DURATION}ms linear`,
                  ...((!isLastSlide && !isPaused) ? {} : {}),
                }}
                ref={(el) => {
                  if (el && !isLastSlide && !isPaused) {
                    // Force reflow to restart CSS transition
                    el.style.width = '0%';
                    el.getBoundingClientRect();
                    el.style.transition = `width ${SLIDE_DURATION}ms linear`;
                    el.style.width = '100%';
                  } else if (el && isPaused) {
                    // Freeze at current width
                    const current = el.getBoundingClientRect().width;
                    const parent = el.parentElement?.getBoundingClientRect().width || 1;
                    el.style.transition = 'none';
                    el.style.width = `${(current / parent) * 100}%`;
                  }
                }}
              />
            ) : (
              <div
                className={`h-full rounded-full ${
                  isDark ? 'bg-white' : 'bg-neutral-800'
                }`}
                style={{ width: '0%' }}
              />
            )}
          </div>
        ))}
      </div>

      {/*  Control buttons*/}
      <div className="absolute top-8 right-4 z-50 flex items-center gap-1">
        {!isLastSlide && (
          <button
            onClick={(e) => { e.stopPropagation(); setIsPaused(prev => !prev); }}
            className={`p-2 rounded-lg transition-all active:scale-90 ${
              isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-black/70 hover:text-black hover:bg-black/10'
            }`}
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); toggleTheme(); }}
          className={`p-2 rounded-lg transition-all active:scale-90 ${
            isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-black/70 hover:text-black hover:bg-black/10'
          }`}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onComplete(); }}
          className={`p-2 rounded-lg transition-all active:scale-90 ${
            isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-black/70 hover:text-black hover:bg-black/10'
          }`}
        >
          <X size={20} />
        </button>
      </div>

      
      <AnimatePresence mode="wait">
        {renderSlide()}
      </AnimatePresence>
    </div>
  );
};