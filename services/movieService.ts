import { MovieData } from '../types'
import { MOCK_DATA } from '../constants'

export async function fetchMovieStory(imdbId : string): Promise<MovieData> {
    if(imdbId.toLocaleLowerCase() === 'demo'){
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_DATA), 1500));
    }

    if(!imdbId.startsWith('tt')) {
        throw new Error('Invalid IMDB id')
    }

    try {
        const [omdbRes, tmdbRes] = await Promise.all([
            fetch(`/api/omdb?i=${imdbId}`),
            fetch(`/api/tmdb?imdbId=${imdbId}`),
        ]);

        if (!omdbRes.ok) {
            const err = await omdbRes.json();
            throw new Error(err.error || 'Movie not found.');
        }

        const omdb = await omdbRes.json();
        const tmdb = await tmdbRes.json();
        const reviews = tmdb.reviews || [];

        let sentimentSummary = 'No audience reviews available for analysis.';
        let sentimentLabel = 'mixed';

        // Build review text — use actual reviews if available, otherwise use plot + ratings as context
        const hasReviews = reviews.length > 0;
        let reviewTexts: string;

        if (hasReviews) {
            reviewTexts = reviews
                .slice(0, 5)
                .map((r: { content: string }) => r.content)
                .join('\n---\n');
        } else {
            // Fallback: give the AI plot, ratings, and awards to infer sentiment
            const ratingStr = (omdb.Ratings || [])
                .map((r: { Source: string; Value: string }) => `${r.Source}: ${r.Value}`)
                .join(', ');
            reviewTexts = `[No audience reviews found. Use the following data to infer audience sentiment]\nPlot: ${omdb.Plot}\nIMDb Rating: ${omdb.imdbRating}/10\nRatings: ${ratingStr}\nAwards: ${omdb.Awards || 'N/A'}\nBox Office: ${omdb.BoxOffice || 'N/A'}`;
        }

        const sentimentRes = await fetch('/api/sentiment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: omdb.Title, reviews: reviewTexts }),
        });

        if (sentimentRes.ok) {
            const sentiment = await sentimentRes.json();
            sentimentSummary = sentiment.summary;
            sentimentLabel = sentiment.label;
        }

     return {
         title: omdb.Title,
         year: omdb.Year,
         rated: omdb.Rated,
         runtime: omdb.Runtime,
         genre: omdb.Genre,
         director: omdb.Director,
         actors: omdb.Actors,
         plot: omdb.Plot,
         poster: omdb.Poster,
         ratings: (omdb.Ratings || []).map((r: { Source: string; Value: string }) => ({
                source: r.Source,
                value: r.Value,
                })),
         imdbRating: omdb.imdbRating,
         imdbId: omdb.imdbID,
         boxOffice: omdb.BoxOffice || 'N/A',
         awards: omdb.Awards || 'N/A',
         reviews,
         sentimentSummary,
         sentimentLabel,
    };
    } catch (error) {
        console.error('Error fetching movie story:', error);
        throw error; 
  }
}