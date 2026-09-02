const { GoogleGenAI, Type } = require('@google/genai');
const fs = require('fs');

function getGeminiClient() {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

async function fileToGenerativePart(filePath) {
  const mimeType = 'image/jpeg';
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType
    }
  };
}

const damageSchema = {
  type: Type.OBJECT,
  properties: {
    totalBuildings: { type: Type.INTEGER },
    damagedBuildings: { type: Type.INTEGER },
    damageDistribution: {
      type: Type.OBJECT,
      properties: {
        noDamage: { type: Type.INTEGER },
        low: { type: Type.INTEGER },
        medium: { type: Type.INTEGER },
        high: { type: Type.INTEGER },
        uncertain: { type: Type.INTEGER }
      },
      required: ['noDamage', 'low', 'medium', 'high', 'uncertain']
    },
    overallDamageRate: { type: Type.NUMBER },
    buildings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          buildingId: { type: Type.INTEGER },
          damageLevel: { type: Type.STRING, enum: ['NO DAMAGE', 'LOW', 'MEDIUM', 'HIGH', 'UNCERTAIN'] },
          damageRate: { type: Type.NUMBER },
          confidence: { type: Type.NUMBER },
          reason: { type: Type.STRING },
          boundingBox: {
            type: Type.OBJECT,
            properties: {
              ymin: { type: Type.NUMBER },
              xmin: { type: Type.NUMBER },
              ymax: { type: Type.NUMBER },
              xmax: { type: Type.NUMBER }
            }
          }
        },
        required: ['buildingId', 'damageLevel', 'damageRate', 'confidence', 'reason']
      }
    }
  },
  required: ['totalBuildings', 'damagedBuildings', 'damageDistribution', 'overallDamageRate', 'buildings']
};

exports.analyzeDamage = async (beforeImagePath, afterImagePath) => {
  const ai = getGeminiClient();
  const beforePart = await fileToGenerativePart(beforeImagePath);
  const afterPart = await fileToGenerativePart(afterImagePath);

  const prompt = `Analyze these BEFORE and AFTER disaster images for building damage assessment.
Your task:
1. Match buildings between the BEFORE and AFTER images.
2. Count the total buildings and damaged buildings.
3. Classify each building into NO DAMAGE (0-10%), LOW (11-30%), MEDIUM (31-60%), HIGH (61-100%), or UNCERTAIN.
4. Calculate an estimated visual damage rate for each building.
5. Provide a confidence score (0 to 1).
6. Give a reason for your classification based on visual evidence (e.g. roof damage, structural collapse).
7. If possible, provide normalized bounding box coordinates (ymin, xmin, ymax, xmax between 0 and 1) for each building in the AFTER image.

Remember: these are estimated visual damage rates, not certified structural-engineering assessments.`;

  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: [prompt, 'BEFORE IMAGE:', beforePart, 'AFTER IMAGE:', afterPart],
      config: {
        responseMimeType: 'application/json',
        responseSchema: damageSchema,
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};
