export interface Rating {
    source : string;
    value : string;
}


// audiance review
export interface Review {
    author : string;
    content : string;
    rating : number | null;
}

//Movie data

export interface MovieData {
    title: string;
    year: string;
    rated : string;
    runtime: string;
    genre : string;
    director: string;
    actors: string;
    plot: string;
    poster : string;
    ratings: Rating[]; 
    imdbRating: string;
    imdbId: string;
    boxOffice: string;
    awards: string;

    reviews : Review[]

    sentimentSummary: string;
    sentimentLabel: string;
}

export enum SlideType {
    TITLE =0,
    CAST =1,
    RATINGS = 2,
    PLOT = 3,
    SENTIMENT = 4,
    POSTER = 5,
}