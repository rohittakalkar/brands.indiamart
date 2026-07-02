import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of GoogleGenAI
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      throw new Error('GEMINI_API_KEY environment variable is not configured or holds a placeholder value. Please set your Gemini API key in Settings > Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Gemini AI B2B Assistant Endpoint
app.post('/api/gemini/assistant', async (req, res) => {
  try {
    const { message, previousMessages = [] } = req.body;
    if (!message) {
       res.status(400).json({ error: 'Message is required' });
       return;
    }

    const ai = getAiClient();

    const systemPrompt = `You are the IndiaMART Brands AI Smart Assistant. 
Your goal is to help B2B buyers discover the best verified brands, compare standard products, and draft high-quality BuyLeads (RFQs/inquiries).
Available Top Brands to recommend:
1. Kirloskar Brothers Limited (Specializes in Pumps, Valves, Engines, Compressors)
2. KSB Limited (Specializes in Centrifugal Pumps, Submersible Pumps, Valves, Waste Water Systems)
3. Crompton Greaves (Specializes in Induction Motors, Pumps, Lighting, Switchgear)
4. Bosch Limited (Specializes in Power Tools, Automotive, Industrial Heat)
5. Siemens India (Specializes in Automation Systems, Switchgear, Industrial Motors, PLC)
6. Havells India (Specializes in Cables, Switchgear, Motors, Solar Power)

Help the user by answering their questions about industrial brands, comparing specifications, and recommending products.
You MUST respond with a structured JSON object containing:
- "reply": A professional, helpful response text in markdown format. Explain which brand fits best and why.
- "recommendedBrandId": The ID of the primary recommended brand ('kirloskar', 'ksb', 'crompton', 'bosch', 'siemens', 'havells') or 'all' or null if not applicable.
- "recommendedCategory": Recommended category if any (e.g., 'machinery', 'electrical', 'automation', 'tools').
- "draftedBuyLead": A draft of a B2B inquiry/BuyLead if the buyer is asking for quotes, products, or suppliers. If not asking for quotes, you can still populate it as a suggestion. It must contain:
    - "productName": Name of the product (e.g., "Centrifugal Pump", "Induction Motor", "PLC S7-1200")
    - "brandName": Name of the brand (e.g., "Kirloskar Brothers Limited", "KSB Limited", "Siemens")
    - "quantity": Estimated quantity (default "1 Piece" or based on query)
    - "location": Expected delivery location (e.g., "Pune, Maharashtra" or based on query, fallback to India)
    - "requirement": Detailed specifications, flow rate, power required, or other industrial requirements to get precise quotes.

Ensure your JSON matches the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        ...previousMessages.map((msg: any) => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: 'The main markdown-formatted explanation of the recommendation and answers.'
            },
            recommendedBrandId: {
              type: Type.STRING,
              description: 'The ID of the recommended brand or null/empty if none'
            },
            recommendedCategory: {
              type: Type.STRING,
              description: 'The ID of the recommended category or null/empty if none'
            },
            draftedBuyLead: {
              type: Type.OBJECT,
              properties: {
                productName: { type: Type.STRING },
                brandName: { type: Type.STRING },
                quantity: { type: Type.STRING },
                location: { type: Type.STRING },
                requirement: { type: Type.STRING }
              },
              required: ['productName', 'quantity', 'requirement']
            }
          },
          required: ['reply']
        }
      }
    });

    const resultText = response.text || '{}';
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error('Gemini Assistant Error:', error);
    // If API key is missing or invalid, we return a fallback response with simulated B2B logic so the UI doesn't break.
    // This is part of the "fail gracefully and explain" rule.
    const isApiKeyError = error.message && (error.message.includes('GEMINI_API_KEY') || error.message.includes('API_KEY_INVALID') || error.message.includes('not configured'));
    
    if (isApiKeyError) {
      // Simulate standard search recommendations so the app is 100% interactive even without a personal key
      const queryLower = (req.body.message || '').toLowerCase();
      let reply = "I've drafted standard recommendations based on your query. **Note: For real-time intelligent Gemini suggestions, please set a valid `GEMINI_API_KEY` in the AI Studio Secrets panel.**\n\n";
      let recommendedBrandId = 'kirloskar';
      let productName = 'Centrifugal Pump - Horizontal End Suction';
      let brandName = 'Kirloskar Brothers Limited';
      let requirement = 'Standard high-efficiency centrifugal pump for industrial water supply and HVAC.';

      if (queryLower.includes('ksb') || queryLower.includes('submersible') || queryLower.includes('well')) {
        recommendedBrandId = 'ksb';
        productName = 'KSB Submersible Borehole Pump';
        brandName = 'KSB Limited';
        requirement = 'High-grade stainless steel multi-stage submersible pump for deep well operations.';
        reply += 'We recommend **KSB Limited** for your submersible pump requirements. KSB offers premium German-engineered stainless steel submersible borehole pumps (CORA Series) which deliver high efficiency and sand-resistance up to 50 g/m³.';
      } else if (queryLower.includes('siemens') || queryLower.includes('plc') || queryLower.includes('automation')) {
        recommendedBrandId = 'siemens';
        productName = 'Siemens SIMATIC S7-1200 PLC';
        brandName = 'Siemens India Limited';
        requirement = 'Compact programmable logic controller (PLC) for industrial automation with TIA Portal programming.';
        reply += 'We recommend **Siemens India Limited** for automation. The SIMATIC S7-1200 Micro PLC is compact, secure, and has integrated PROFINET communication ports, perfect for modern B2B industrial line integration.';
      } else if (queryLower.includes('motor') || queryLower.includes('crompton')) {
        recommendedBrandId = 'crompton';
        productName = 'Crompton TEFC Three Phase Induction Motor';
        brandName = 'Crompton Greaves Consumer Electricals';
        requirement = 'IE2/IE3 high-efficiency three-phase squirrel cage induction motor.';
        reply += 'We recommend **Crompton Greaves** for heavy-duty electric motors. Their squirrel cage induction motors are designed for high durability and are fully IE2/IE3 energy compliant.';
      } else {
        reply += 'Based on your query, we recommend **Kirloskar Brothers Limited** (KBL). Founded in 1888, they are India\'s pioneer pump manufacturers, offering a comprehensive selection of end-suction, monoblock, and split-case centrifugal pumps for liquid transport.';
      }

      res.json({
        reply,
        recommendedBrandId,
        recommendedCategory: 'machinery',
        draftedBuyLead: {
          productName,
          brandName,
          quantity: '1 Piece',
          location: 'Pune, Maharashtra',
          requirement
        },
        _isFallback: true,
        _apiKeyMsg: 'GEMINI_API_KEY is not configured or holds a placeholder value. Please configure it in AI Studio Secrets.'
      });
    } else {
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }
});

// Setup Vite or Static assets serving
async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

bootstrap();
