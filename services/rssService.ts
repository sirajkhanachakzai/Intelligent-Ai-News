
import { Article } from "../types";

/**
 * Using corsproxy.io as it is generally more reliable for high-traffic RSS feeds.
 * It returns the raw content directly, unlike allorigins which wraps it in JSON.
 */
const CORS_PROXY = "https://corsproxy.io/?";

export const fetchRssFeed = async (url: string, sourceName: string): Promise<Article[]> => {
  try {
    // We add a cache-busting parameter to ensure we get fresh news
    const fetchUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
    const response = await fetch(fetchUrl);

    if (!response.ok) {
      throw new Error(`Proxy responded with status: ${response.status}`);
    }

    const xmlText = await response.text();
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    
    // Check for parsing errors
    const parseError = xmlDoc.getElementsByTagName("parsererror");
    if (parseError.length > 0) {
      throw new Error("Error parsing XML response");
    }

    const items = Array.from(xmlDoc.querySelectorAll("item")).slice(0, 15);
    
    return items.map((item, index) => {
      const title = item.querySelector("title")?.textContent || "No Title";
      const link = item.querySelector("link")?.textContent || "#";
      const pubDate = item.querySelector("pubDate")?.textContent || new Date().toISOString();
      
      // Attempt to find a good content snippet
      let description = item.querySelector("description")?.textContent || "";
      // Handle cases where content is in <content:encoded>
      const encodedContent = item.getElementsByTagName("content:encoded")?.[0]?.textContent;
      if (encodedContent && (!description || description.length < 50)) {
        description = encodedContent;
      }
      
      const contentSnippet = description
        .replace(/<[^>]*>?/gm, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ')
        .trim()
        .slice(0, 250);

      // Fix: Use btoa instead of Buffer for base64 encoding in the browser environment to generate a unique ID component
      let linkHash = "";
      try {
        linkHash = btoa(link).slice(0, 10);
      } catch (e) {
        linkHash = Math.random().toString(36).substring(7);
      }

      return {
        id: `${sourceName.replace(/\s+/g, '-')}-${linkHash}-${index}`,
        title,
        link,
        source: sourceName,
        pubDate,
        contentSnippet: contentSnippet || "Summary analysis pending...",
        processed: false
      };
    });
  } catch (error) {
    console.error(`Detailed RSS fetch error for ${sourceName}:`, error);
    // Return empty array on failure so the app doesn't crash
    return [];
  }
};
