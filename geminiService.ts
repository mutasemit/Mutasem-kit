
import { GoogleGenAI } from "@google/genai";

// Guideline: Use environment variable for API key
const getAI = () => new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

export const generateImageContent = async (
  prompt: string,
  images: { data: string; mimeType: string }[] = [],
  config: any = {}
) => {
  const ai = getAI();
  const parts: any[] = [{ text: prompt }];
  
  images.forEach(img => {
    parts.push({
      inlineData: {
        data: img.data.split(',')[1] || img.data,
        mimeType: img.mimeType
      }
    });
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio || "1:1",
        }
      }
    });

    // Guideline: Iterate through all parts to find the image part.
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const suggestPrompt = async (imageData: string, currentContext: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: `Based on this product image and the context of ${currentContext}, suggest a professional, creative photoshoot prompt that describes a stunning scene, lighting, and composition. Return ONLY the suggested prompt text.` },
          { inlineData: { data: imageData.split(',')[1], mimeType: 'image/png' } }
        ]
      }
    });
    // Guideline: The response features a text property (not a method).
    return response.text?.trim() || "A professional product shot with cinematic lighting.";
  } catch (error) {
    return "Error generating suggestion.";
  }
};
