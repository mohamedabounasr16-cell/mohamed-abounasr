import { GoogleGenAI, Type } from "@google/genai";
import { StoryAnalysisResponse } from "../types";

// Initialize Gemini Client
// Note: API Key must be in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes the Arabic story and breaks it down into scenes with visual prompts.
 * Enforces Moroccan style and Character Consistency strategies.
 */
export const analyzeStory = async (storyText: string): Promise<StoryAnalysisResponse> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    You are an expert storyboard artist for Moroccan children's books.
    
    TASK:
    Analyze the following Arabic story and break it down into 3 to 6 distinct key scenes.
    For each scene, provide:
    1. "narrative_segment": The specific Arabic text from the story corresponding to this scene.
    2. "characters": A concise visual description of the characters present (e.g., "Ahmed, 7 years old, curly black hair, wearing a red Djellaba").
    3. "visual_prompt": A highly detailed English image generation prompt.
    
    CRITICAL STYLE GUIDELINES (Must be included in visual_prompt):
    - Art Style: Hand-drawn colored pencil illustration, textured, soft shading, vibrant but natural colors, white paper background, children's book style.
    - Cultural Context: MOROCCO. Use Moroccan architecture (arches, zellige tiles, riads), Moroccan clothing (Djellaba, Kaftan, Gandoura, Fez hat), and Moroccan landscapes (Atlas mountains, medina streets, palm trees).
    - Consistency: Ensure character descriptions are consistent across all prompts.
    
    STORY:
    ${storyText}
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scenes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                narrative_segment: { type: Type.STRING },
                visual_prompt: { type: Type.STRING },
                characters: { type: Type.STRING }
              },
              required: ["narrative_segment", "visual_prompt", "characters"]
            }
          }
        }
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as StoryAnalysisResponse;
  }
  
  throw new Error("Failed to analyze story");
};

/**
 * Generates an image for a specific scene using the prompt created in the analysis phase.
 */
export const generateSceneImage = async (visualPrompt: string): Promise<string> => {
  const model = "gemini-3-pro-image-preview"; // Using the pro image model for better artistic control

  // We append style enforcers to ensure the model adheres to the request even if the prompt is loose
  const finalPrompt = `${visualPrompt}, illustration style, colored pencil drawing, visible pencil strokes, on textured paper, masterpiece, warm lighting, Moroccan atmosphere`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: finalPrompt }]
      },
      config: {
        imageConfig: {
            aspectRatio: "1:1", // Square for storybook feel
            imageSize: "1K"
        }
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data returned");
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};