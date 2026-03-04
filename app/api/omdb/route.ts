import {NextRequest , NextResponse} from 'next/server'

const OMDB_API_KEY = process.env.OMDB_API_KEY;

interface CacheEntry {
    data: Record<string, unknown>;
    timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 10*60*1000; //10 min

export async function GET(request :NextRequest) {

    const { searchParams } = new URL(request.url);
    const imdbId = searchParams.get('i');


    // check imdbId
    if(!imdbId) {
        return NextResponse.json({
            error: 'Enter IMDB ID'
        },
    {status:400});
    }


    //check cache
    const cached = cache.get(imdbId);
    if(cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return NextResponse.json(cached.data);
    }

    try {
        const res = await fetch(
            `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}&plot=full`
        );
        const data = await res.json();

        if(data.Response == 'False'){
            return NextResponse.json({
                error :data.Error
            },{
                status:404
            });
        }

        //Set cache
        cache.set(imdbId, { data, timestamp: Date.now() });

       return NextResponse.json(data);
    } catch {
        return NextResponse.json({
            error:"error getting movie data"
        } ,{
            status:500
        });
    }
}