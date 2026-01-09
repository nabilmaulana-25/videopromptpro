
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const API_KEY = process.env.API_KEY || '';

export const analyzeVideo = async (videoBase64: string, mimeType: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType,
            data: videoBase64,
          },
        },
        {
          text: `Analyze this video and divide it into logical chronological segments (scenes or chapters).
          
          For the overall video, provide a summary.
          
          For EACH segment, provide:
          1. Timestamp (e.g., "00:00 - 00:04")
          2. Detailed Description of the action.
          3. Visual Style (aesthetic, color palette).
          4. Lighting properties.
          5. Camera Work (angle, movement).
          6. High-fidelity prompts for:
             - Midjourney v6
             - Stable Diffusion XL (with weights)
             - Google Veo
          
          Ensure the response is a single valid JSON object following the requested schema.`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallSummary: { type: Type.STRING },
          segments: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timestamp: { type: Type.STRING },
                description: { type: Type.STRING },
                visualStyle: { type: Type.STRING },
                lighting: { type: Type.STRING },
                cameraWork: { type: Type.STRING },
                generatedPrompts: {
                  type: Type.OBJECT,
                  properties: {
                    midjourney: { type: Type.STRING },
                    stableDiffusion: { type: Type.STRING },
                    veo: { type: Type.STRING }
                  },
                  required: ['midjourney', 'stableDiffusion', 'veo']
                }
              },
              required: ['timestamp', 'description', 'visualStyle', 'lighting', 'cameraWork', 'generatedPrompts']
            }
          }
        },
        required: ['overallSummary', 'segments']
      }
    }
  });

  const rawJson = response.text;
  const parsed = JSON.parse(rawJson || '{}');

  return {
    id: Math.random().toString(36).substring(7),
    timestamp: Date.now(),
    videoName: 'Segmented Video Analysis',
    ...parsed
  };
};
