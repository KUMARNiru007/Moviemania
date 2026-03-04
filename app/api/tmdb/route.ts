import {NextRequest , NextResponse } from 'next/server'

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';

interface Review {
      author: string;
      content: string;
      author_details?: {
        rating: number | null;
      };
}


export async function GET(request : NextRequest) {

    const {searchParams} = new URL(request.url);
    const imdbId  = searchParams.get('imdbId');


    if(!imdbId) {
        return NextResponse.json({
            error : "Enter imdb id"
        },{
            status : 400
        });
    }


    try{
      // Find the TMDB movie ID using the IMDB ID
    const findRes = await fetch(
      `${TMDB_BASE}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
    );
    const findData = await findRes.json();

    // The result is in movie_results array
    const movie = findData.movie_results?.[0];
    if (!movie) {
      return NextResponse.json({ reviews: [] }); // No movie found, return empty
    }

    const reviewsRes = await fetch(
      `${TMDB_BASE}/movie/${movie.id}/reviews?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    const reviewsData = await reviewsRes.json();


    const reviews = (reviewsData.results || []).slice(0, 10).map((r: Review) => ({
      author: r.author,
      content: r.content,
      rating: r.author_details?.rating || null,
    }));

    return NextResponse.json({ reviews });
    } catch  {
    return NextResponse.json({ reviews: [] }); 
  }
}