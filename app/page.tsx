'use client'

import { useState } from 'react'
import { fetchMovieStory } from '@/services/movieService'
import { MovieData } from '@/types'
import { StoryContainer } from '@/components/StoryContainer'
import { Film, Play, Loader2, AlertCircle, Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'

export default function Home() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  const [imdbId, setImdbId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [storyData, setStoryData] = useState<MovieData | null>(null)
  const [showStory, setShowStory] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imdbId.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchMovieStory(imdbId.trim())

      // Preload the poster image before showing slides
      if (data.poster && data.poster !== 'N/A') {
        await new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => resolve() // proceed even if image fails
          img.src = data.poster
        })
      }

      setStoryData(data)
      setShowStory(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

 
  if (showStory && storyData) {
    return <StoryContainer data={storyData} onComplete={() => setShowStory(false)} />
  }

  return (
    <div className={`min-h-[100dvh] flex flex-col items-center justify-center p-6 overflow-hidden relative transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 z-50 p-2 rounded-lg transition-all border ${isDark ? 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:bg-neutral-800' : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200'}`}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Decorative blurs */}
      <div className={`absolute top-[-20%] left-[-20%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none ${isDark ? 'bg-hero-gold/20' : 'bg-hero-gold/10'}`} />
      <div className={`absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none ${isDark ? 'bg-hero-purple/20' : 'bg-hero-purple/10'}`} />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md z-10"
      >
        {/* Logo + Title */}
        <div className="text-center mb-12">
          <Film size={64} className="mx-auto mb-6" />
          <h1 className="text-5xl md:text-7xl font-bold mb-2 tracking-tight">MovieStory</h1>
          <p className={`font-mono tracking-widest text-sm uppercase ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Your IMDB Cinematic Wrapped
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={imdbId}
            onChange={(e) => { setImdbId(e.target.value); if (error) setError(null); }}
            placeholder="Enter IMDB ID (e.g., tt0816692)"
            className={`w-full border rounded-xl px-6 py-4 text-xl font-mono text-center focus:outline-none focus:border-hero-gold focus:ring-1 focus:ring-hero-gold transition-all ${isDark ? 'bg-neutral-900/50 border-neutral-800 placeholder:text-neutral-600' : 'bg-neutral-100 border-neutral-200 placeholder:text-neutral-400'}`}
          />

          <button
            type="submit"
            disabled={isLoading || !imdbId.trim()}
            className={`w-full rounded-xl px-6 py-4 font-bold text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-white text-black hover:bg-neutral-200' : 'bg-black text-white hover:bg-neutral-800'}`}
          >
            {isLoading ? (
              <><Loader2 className="animate-spin" /> Generating...</>
            ) : (
              <><Play size={20} /> Play Story</>
            )}
          </button>

          {/* Error display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-xl border bg-red-900/20 border-red-800/50"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm text-red-300">Error</p>
                    <p className="text-xs text-neutral-400">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="mt-12 text-center text-xs text-neutral-600 font-mono">
          <p>CINEMATIC EXPERIENCE</p>
          <p className="mt-2 opacity-100">Try &apos;demo&apos; for a preview</p>
        </div>
      </motion.div>
    </div>
  )
}