const { GoogleGenAI, Type, Schema } = require('@google/genai');
const fs = require('fs');

function getGeminiClient() {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

async function fileToGenerativePart(filePath) {
  const mimeType = 'image/jpeg'; // or determine from extension
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType
    }
  };
}

const thermalSchema = {
  type: Type.OBJECT,
  properties: {
    peopleDetected: { type: Type.INTEGER },
    people: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          temperature: { type: Type.NUMBER, nullable: true },
          temperatureAvailable: { type: Type.BOOLEAN },
          status: { type: Type.STRING, enum: ['normal', 'elevated', 'attention', 'unknown'] },
          confidence: { type: Type.NUMBER },
          bodyRegion: { type: Type.STRING },
          explanation: { type: Type.STRING }
        },
        required: ['id', 'temperatureAvailable', 'status', 'confidence', 'bodyRegion', 'explanation']
      }
    },
    overallStatus: { type: Type.STRING },
    aiExplanation: { type: Type.STRING }
  },
  required: ['peopleDetected', 'people', 'overallStatus', 'aiExplanation']
};

exports.analyzeThermal = async (imagePath) => {
  const ai = getGeminiClient();
  const imagePart = await fileToGenerativePart(imagePath);
  
  const prompt = `Analyze this thermal image for disaster intelligence.
Your task:
1. Determine if humans are present.
2. Count the number of humans.
3. Provide approximate body regions visible.
4. ONLY if reliable temperature information is available in the image, provide the temperature value (in Celsius). If unavailable, explicitly set temperatureAvailable to false and temperature to null. Do NOT hallucinate temperature measurements from standard colorized thermal images unless a scale/measurement is provided.
5. Determine status: normal (if normal temp or seems fine), elevated/attention (if high temp or seems in distress), or unknown.
6. Provide a confidence score (0 to 1).
7. Provide an explanation for each person.`;

  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: [prompt, imagePart],
      config: {
        responseMimeType: 'application/json',
        responseSchema: thermalSchema,
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};
