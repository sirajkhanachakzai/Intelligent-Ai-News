
import { GoogleGenAI, Type } from "@google/genai";
import { Article, Category, Sentiment } from "../types";

// Fix: Strictly follow the initialization guidelines using process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeArticle = async (article: Partial<Article>): Promise<{
  summary: string;
  category: Category;
  sentiment: Sentiment;
  sentimentScore: number;
}> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following news article snippet and provide a summary, category, and sentiment analysis.
      Title: ${article.title}
      Snippet: ${article.contentSnippet}
      
      Categories: Tech, Finance, Politics, Brands, Other.
      Sentiment: Positive, Neutral, Negative.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A concise 2-3 line summary" },
            category: { type: Type.STRING, enum: ["Tech", "Finance", "Politics", "Brands", "Other"] },
            sentiment: { type: Type.STRING, enum: ["Positive", "Neutral", "Negative"] },
            sentimentScore: { type: Type.NUMBER, description: "Numerical sentiment from -1 (very negative) to 1 (very positive)" }
          },
          required: ["summary", "category", "sentiment", "sentimentScore"]
        }
      }
    });

    // Fix: Access response.text as a property directly, ensuring it is trimmed and available
    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      summary: article.contentSnippet || "Failed to generate summary.",
      category: "Other",
      sentiment: "Neutral",
      sentimentScore: 0
    };
  }
};
