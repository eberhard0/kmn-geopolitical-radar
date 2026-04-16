import vader from "vader-sentiment";

interface SentimentResult {
  compound_score: number;
  pos_score: number;
  neg_score: number;
  neu_score: number;
  sentiment_label: string;
  analyzer: string;
}

function labelFromCompound(score: number): string {
  if (score >= 0.05) return "positive";
  if (score <= -0.05) return "negative";
  return "neutral";
}

export function analyzeSentiment(text: string): SentimentResult {
  const scores = vader.SentimentIntensityAnalyzer.polarity_scores(text);
  return {
    compound_score: scores.compound,
    pos_score: scores.pos,
    neg_score: scores.neg,
    neu_score: scores.neu,
    sentiment_label: labelFromCompound(scores.compound),
    analyzer: "vader",
  };
}
