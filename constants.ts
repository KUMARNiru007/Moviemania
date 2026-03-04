import { MovieData } from './types';


export const SLIDE_DURATION = 6000; // 6s


// mock data
export const MOCK_DATA: MovieData = {
  title: "Interstellar",
  year: "2014",
  rated: "PG-13",
  runtime: "169 min",
  genre: "Adventure, Drama, Sci-Fi",
  director: "Christopher Nolan",
  actors: "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
  plot: "Earth's future has been riddled by disasters, famines, and droughts. There is only one way to ensure mankind's survival: Interstellar travel. A newly discovered wormhole in the far reaches of our solar system allows a team of astronauts to go where no man has gone before, a planet that may have the right environment to sustain human life.",
  poster: "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_SX300.jpg",
  ratings: [
    { source: "Internet Movie Database", value: "8.7/10" },
    { source: "Rotten Tomatoes", value: "73%" },
    { source: "Metacritic", value: "74/100" },
  ],
  imdbRating: "8.7",
  imdbId: "tt0816692",
  boxOffice: "$203,227,580",
  awards: "Won 1 Oscar. 45 wins & 148 nominations total",
  reviews: [
    { author: "MovieFan42", content: "A masterpiece of sci-fi cinema. Nolan outdid himself with stunning visuals and emotional depth.", rating: 9 },
    { author: "CinemaLover", content: "Visually stunning but the plot gets convoluted in the third act. Still a must-watch.", rating: 7 },
    { author: "SpaceGeek", content: "The most emotionally powerful space movie ever made. Hans Zimmer's score is perfection.", rating: 10 },
  ],
  sentimentSummary: "Audiences overwhelmingly praise Interstellar for its stunning visuals, emotional depth, and Hans Zimmer's iconic score. While some critics find the third act convoluted, most viewers consider it a modern sci-fi masterpiece that balances scientific ambition with genuine human emotion.",
  sentimentLabel: "positive",
};