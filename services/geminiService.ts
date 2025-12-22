import { GoogleGenAI, Modality } from "@google/genai";
import { GroundingSource } from "../types";

// Standardizing on latest reliable models as per guidelines
const MODEL_PRO = 'gemini-3-pro-preview';
const MODEL_FLASH = 'gemini-3-flash-preview';

// Initialize the Google GenAI client following strict guidelines
export const getAIInstance = () => {
  // Always use the injected process.env.API_KEY directly
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeDrugRequest = async (drugName: string, notes: string): Promise<{ text: string; sources: GroundingSource[] }> => {
  const ai = getAIInstance();
  
  try {
    const response = await ai.models.generateContent({
      model: MODEL_PRO,
      contents: [{
        parts: [{
          text: `
            You are a senior pharmaceutical logistics officer at EasygoPharm. 
            Analyze the following request for a rare/orphan drug:
            
            Drug: ${drugName}
            Context: ${notes}
            
            Provide a detailed report on:
            1. Regulatory status (FDA/EMA orphan drug designation).
            2. Current global manufacturing hotspots and known shortages.
            3. Cold-chain and specialized logistics requirements.
            4. Import/Export complexity for international sourcing.
            
            Use Google Search to find the absolute latest supply chain news. Return a clean, professional report.
          `
        }]
      }],
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 4000 } 
      }
    });

    // Access the .text property directly (not a method)
    const text = response.text || "Analysis could not be generated.";
    const sources: GroundingSource[] = [];
    
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || 'Official Source',
            uri: chunk.web.uri
          });
        }
      });
    }

    // Deduplicate sources found via Google Search grounding
    const uniqueSources = Array.from(new Map(sources.map(s => [s.uri, s])).values());

    return { 
      text, 
      sources: uniqueSources 
    };
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return { 
      text: "System Error: Unable to perform real-time sourcing intelligence. The AI agent is currently unavailable. Please verify API configuration.", 
      sources: [] 
    };
  }
};

export const getPharmaAssistantChat = () => {
  const ai = getAIInstance();
  return ai.chats.create({
    model: MODEL_FLASH,
    config: {
      systemInstruction: `You are EasygoPharm's AI Assistant. You help patients and doctors find the generic names of rare medications, understand their uses (logistically), and guide them through the request process. Always maintain a professional, helpful, and SOC-2 compliant tone. Never provide medical prescriptions or clinical diagnoses.`,
    },
  });
};

// Transcription utility for Live API
// The audio bytes returned by the API is raw PCM data. Implementation follows decoding logic requirements.
export const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

// Encode Function as per Live API examples
export function encodeAudio(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Decode Function as per Live API examples
export function decodeAudio(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}