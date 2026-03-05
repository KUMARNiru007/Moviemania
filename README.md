# Moviemania - AI Movie Insight Builder

Moviemania is an AI-powered web application that generates rich insights
about a movie using its **IMDb ID**.

The application fetches movie metadata, gathers audience reviews, and
analyzes sentiment using AI to present results in an **interactive
story-style interface** with animated slides.

By entering an IMDb ID (for example: `tt0133093`), users can instantly
explore:

-   Movie poster
-   Title and release year
-   Cast information
-   Ratings
-   Plot summary
-   AI‑generated audience sentiment insights

------------------------------------------------------------------------

# Features

### Movie Data Retrieval

-   Fetch movie information using an **IMDb ID**
-   Display poster, cast, ratings, and release year

### AI Sentiment Insights

-   Analyze audience reviews using AI
-   Generate a short **sentiment summary**
-   Classify overall sentiment as:
    -   Positive
    -   Mixed
    -   Negative

### Interactive Story UI

-   Movie insights displayed as **animated slides**
-   Smooth transitions and text reveal effects

### Responsive Design

-   Works across desktop and mobile devices
-   Clean modern UI built with Tailwind

### Testing

-   Includes unit tests using **Jest and React Testing Library**

------------------------------------------------------------------------

# Tech Stack

## Frontend

**Next.js (React + TypeScript)**\
Used to build a scalable full‑stack application with server components
and API routes.

## Styling

**Tailwind CSS**\
Utility‑first CSS framework for rapid and responsive UI development.

## Animation

**Framer Motion**\
Used for interactive transitions and storytelling animations.

## APIs

-   **OMDb API** -- Movie metadata such as title, plot, ratings and
    cast\
-   **TMDB API** -- Audience reviews and additional movie information

## AI

**Google Gemini API**\
Used to analyze audience reviews and generate sentiment summaries.

## Testing

-   Jest\
-   React Testing Library

------------------------------------------------------------------------

# Data & AI Processing Flow

Moviemania combines multiple APIs to generate movie insights.

### Parallel Data Fetching

When a user enters an IMDb ID:

1.  **OMDb API** and **TMDB API** requests are triggered
    **simultaneously**.
2.  This reduces waiting time and improves performance.

```{=html}
    User enters IMDb ID
            │
            ├──────────────► OMDb API (movie metadata)
            │
            └──────────────► TMDB API (reviews)
 ```

------------------------------------------------------------------------

## 1. Movie Metadata -- OMDb API

The **OMDb API** provides core movie information.

Request example:

    https://www.omdbapi.com/?i=<imdbId>&apikey=<OMDB_API_KEY>

Returned data includes:

-   Title
-   Poster
-   Cast
-   Release year
-   IMDb rating
-   Plot summary
-   Awards and box office

------------------------------------------------------------------------

## 2. Audience Reviews -- TMDB API

TMDB is used to retrieve audience reviews.

Process:

1.  Convert IMDb ID → TMDB movie ID using the **Find API**
2.  Fetch movie reviews using the TMDB movie ID

Endpoints used:

    /find/{imdbId}?external_source=imdb_id
    /movie/{tmdbMovieId}/reviews

The application extracts a subset of reviews and prepares them for AI
analysis.

------------------------------------------------------------------------

## 3. Sentiment Analysis -- Gemini AI

The reviews are sent to the **Gemini API** for sentiment analysis.

Gemini generates:

-   A **short audience sentiment summary**
-   A **sentiment label** (positive / mixed / negative)

Example response:

``` json
{
  "summary": "Audience praised the performances and story while noting some pacing issues.",
  "label": "positive"
}
```

This result is displayed in the **Sentiment Slide**.

------------------------------------------------------------------------

# Project Structure

    Moviemania
    │
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── api/
    │       ├── omdb/route.ts
    │       ├── sentiment/route.ts
    │       └── tmdb/route.ts
    │
    ├── components/
    │   ├── SlideLayout.tsx
    │   ├── StoryContainer.tsx
    │   ├── TextReveal.tsx
    │   └── slides/
    │       ├── CastSlide.tsx
    │       ├── PlotSlide.tsx
    │       ├── PosterSlide.tsx
    │       ├── RatingsSlide.tsx
    │       ├── SentimentSlide.tsx
    │       └── TitleSlide.tsx
    │
    ├── context/
    │   └── ThemeContext.tsx
    │
    ├── services/
    │   └── movieService.ts
    │
    ├── lib/
    ├── public/
    │
    ├── __tests__/
    │   └── page.test.tsx
    │
    ├── constants.ts
    ├── types.ts
    │
    ├── jest.config.js
    ├── eslint.config.mjs
    ├── next.config.ts
    ├── tsconfig.json
    ├── postcss.config.mjs
    ├── package.json
    └── README.md

------------------------------------------------------------------------

# Environment Variables

Create a `.env.local` file and add:

    OMDB_API_KEY=your_omdb_api_key
    TMDB_API_KEY=your_tmdb_api_key
    GEMINI_API_KEY=your_gemini_api_key

------------------------------------------------------------------------

# Usage

1.  Enter a valid **IMDb Movie ID** (example: `tt0133093`)
2.  The application fetches movie data and reviews
3.  AI generates audience sentiment insights
4.  Results are displayed in interactive slides

------------------------------------------------------------------------

# Screenshot

    ![Moviemania Screenshot](/image.png)

------------------------------------------------------------------------

# Assumptions

-   IMDb IDs provided are valid.
-   API keys for OMDb, TMDB, and Gemini are configured.
-   AI sentiment summaries depend on available review data.

------------------------------------------------------------------------

# License

This project is created for **FullStack Devloper Internship task**.
