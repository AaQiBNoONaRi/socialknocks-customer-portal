import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
// In a real scenario, we handle missing keys gracefully, but for this demo context we assume it exists or fail hard if needed.

const ai = new GoogleGenAI({ apiKey });

export const generatePostContent = async (topic: string, platform: string, tone: string): Promise<string> => {
  try {
    const prompt = `Generate a social media post for ${platform}.
    Topic: ${topic}
    Tone: ${tone}
    Include hashtags and emoji usage. Keep it under 280 characters if for Twitter/X.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating content. Please check your API key or try again later.";
  }
};

export const generateContentIdeas = async (niche: string): Promise<string[]> => {
    try {
        const prompt = `Give me 5 creative content ideas for a brand in the "${niche}" niche. Return ONLY a JSON array of strings.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });
        
        const text = response.text || "[]";
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini Idea Gen Error", error);
        return ["Behind the scenes look", "Customer testimonial", "Product tutorial", "Industry news reaction", "Team spotlight"];
    }
}
