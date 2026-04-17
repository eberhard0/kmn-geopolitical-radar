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

function scoreVader(text: string): SentimentResult {
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

async function scoreFinBERT(text: string): Promise<SentimentResult> {
  const hfToken = process.env.HF_TOKEN || "";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (hfToken) {
    headers["Authorization"] = `Bearer ${hfToken}`;
  }

  try {
    const res = await fetch(
      "https://api-inference.huggingface.co/models/ProsusAI/finbert",
      {
        method: "POST",
        headers,
        body: JSON.stringify({ inputs: text.slice(0, 512) }),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.warn(`FinBERT API error ${res.status}, falling back to VADER`);
      return scoreVader(text);
    }

    const data = await res.json();

    // HF returns [[{label, score}, ...]] sorted by confidence
    const predictions: Array<{ label: string; score: number }> = Array.isArray(data[0]) ? data[0] : data;

    let posScore = 0;
    let negScore = 0;
    let neuScore = 0;
    let topLabel = "neutral";
    let topScore = 0;

    for (const p of predictions) {
      const label = p.label.toLowerCase();
      if (label === "positive") posScore = p.score;
      else if (label === "negative") negScore = p.score;
      else neuScore = p.score;

      if (p.score > topScore) {
        topScore = p.score;
        topLabel = label;
      }
    }

    // Convert to compound-like score: positive pushes up, negative pushes down
    const compound = posScore - negScore;

    return {
      compound_score: Math.round(compound * 1000) / 1000,
      pos_score: Math.round(posScore * 1000) / 1000,
      neg_score: Math.round(negScore * 1000) / 1000,
      neu_score: Math.round(neuScore * 1000) / 1000,
      sentiment_label: topLabel,
      analyzer: "finbert",
    };
  } catch (err) {
    console.warn("FinBERT call failed, falling back to VADER:", err);
    return scoreVader(text);
  }
}

const USE_FINBERT = process.env.USE_FINBERT === "true";

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  if (USE_FINBERT) {
    return scoreFinBERT(text);
  }
  return scoreVader(text);
}
