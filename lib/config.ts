export const SCRAPE_INTERVAL_MINUTES = 30;
export const ESCALATION_WINDOW_HOURS = 24;
export const SENTIMENT_THRESHOLD_ALERT = -0.3;
export const SLOPE_THRESHOLD_ESCALATION = -0.05;
export const SLOPE_THRESHOLD_DEESCALATION = 0.05;
export const SLOPE_THRESHOLD_CRITICAL = -0.1;
export const NUM_ARTICLES_PER_FEED = 20;
export const FETCH_DELAY_MS = 1500;

export const TRACKED_TOPICS = [
  {
    name: "South China Sea",
    queries: ["South China Sea", "Laut China Selatan", "Natuna tensions"],
  },
  {
    name: "ASEAN Relations",
    queries: ["ASEAN diplomacy", "ASEAN summit", "KTT ASEAN"],
  },
  {
    name: "Indonesia Elections",
    queries: ["pemilu Indonesia", "pilkada 2026", "Indonesia election"],
  },
  {
    name: "Trade Policy",
    queries: ["Indonesia tariff", "kebijakan perdagangan", "trade war ASEAN"],
  },
  {
    name: "Commodity Prices",
    queries: [
      "palm oil price",
      "harga CPO",
      "nickel price Indonesia",
      "coal price Indonesia",
    ],
  },
  {
    name: "China-Taiwan",
    queries: ["China Taiwan tensions", "Taiwan strait military"],
  },
  {
    name: "Myanmar Crisis",
    queries: ["Myanmar conflict", "krisis Myanmar", "Myanmar civil war"],
  },
  {
    name: "Truth Social",
    queries: [
      "Truth Social Trump post",
      "Trump Truth Social announcement",
      "Truth Social statement policy",
      "Truth Social market impact",
    ],
  },
];
