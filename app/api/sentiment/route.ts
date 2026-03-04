import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { title, reviews } = await request.json();

    const hasRealReviews = !reviews.startsWith('[No audience reviews found');

    const prompt = hasRealReviews
      ? `You are a movie critic AI. Analyze the audience sentiment for the movie "${title}".

        Here are real audience reviews:
        ${reviews}

        Based on these reviews, provide:
        1. A 2-3 sentence summary of how audiences generally feel about this movie.
        2. An overall sentiment classification: exactly one of "positive", "mixed", or "negative".

        You MUST respond in valid JSON format only, no extra text:
        {"summary": "your 2-3 sentence summary here", "label": "positive"}`
      : `You are a movie critic AI. Analyze the likely audience sentiment for the movie "${title}".

        No audience reviews were found, but here is available data about the movie:
        ${reviews}

        Based on the IMDb rating, critic scores, awards, box office performance, and plot, infer:
        1. A 2-3 sentence summary of how audiences likely feel about this movie. Be specific to this movie — mention its strengths or weaknesses based on the data.
        2. An overall sentiment classification: exactly one of "positive", "mixed", or "negative". A movie rated above 7.0 is generally positive. Below 5.0 is generally negative.

        You MUST respond in valid JSON format only, no extra text:
        {"summary": "your 2-3 sentence summary here", "label": "positive"}`;

    
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await res.json();

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json({
      summary: parsed.summary || 'Unable to generate sentiment summary.',
      label: parsed.label || 'mixed',
    });
  } catch (error) {
    // return a safe fallback
    console.error('Sentiment analysis failed:', error);
    return NextResponse.json({
      summary: 'Unable to analyze audience sentiment at this time.',
      label: 'mixed',
    });
  }
}