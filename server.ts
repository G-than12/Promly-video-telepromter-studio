import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// AI Script Generator Endpoint
app.post("/api/gemini/generate-script", async (req, res) => {
  try {
    const { topic, platform = "TikTok", tone = "Engaging", targetDurationSeconds = 60, language = "Indonesian" } = req.body;
    
    if (!topic || typeof topic !== "string") {
      res.status(400).json({ error: "Topic is required" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return smart fallback script if key is not configured
      const fallbackScript = generateFallbackScript(topic, platform);
      res.json({
        script: fallbackScript,
        isFallback: true,
        message: "Generated using studio template. Connect GEMINI_API_KEY for custom AI script generation.",
      });
      return;
    }

    const prompt = `You are a world-class video scriptwriter for content creators (${platform}, YouTube, TikTok, presentations).
Create a high-retention video script on the topic: "${topic}".
Language requested: ${language} (or matching prompt language).
Format/Platform: ${platform}.
Tone: ${tone}.
Target speaking duration: ~${targetDurationSeconds} seconds (approx ${Math.round((targetDurationSeconds / 60) * 140)} words).

Structure the script clearly with these readable sections:
[HOOK - 0-5s]
(Attention grabber that stops scrolling immediately)

[PROBLEM / CURIOSITY]
(Relatable tension or core question)

[CORE VALUE / SOLUTION]
(2-3 clear, actionable points easy to read on a teleprompter)

[REAL EXAMPLE / STORY]
(Short illustrative moment or quick tip)

[CALL TO ACTION / OUTRO]
(Clear engagement prompt, like save, share, or comment)

Format the output strictly as the natural script text ready to be read aloud on a teleprompter. Use short sentences, natural conversational rhythms, and clean line breaks between ideas so it is effortless to read while maintaining eye contact with the camera.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    const scriptText = response.text || "";
    res.json({
      script: scriptText.trim(),
      isFallback: false,
    });
  } catch (error: any) {
    console.error("Error generating script:", error);
    res.status(500).json({
      error: error?.message || "Failed to generate script",
      fallback: generateFallbackScript(req.body?.topic || "video topic", req.body?.platform || "TikTok"),
    });
  }
});

// AI Script Improvement Endpoint (Pacing, pauses, teleprompter optimization)
app.post("/api/gemini/improve-script", async (req, res) => {
  try {
    const { script, instruction = "teleprompter_polish" } = req.body;
    if (!script) {
      res.status(400).json({ error: "Script content is required" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Local enhancement: break into readable teleprompter rhythm
      const enhanced = localScriptEnhance(script);
      res.json({ script: enhanced, isFallback: true });
      return;
    }

    let instructionPrompt = "Format this script for optimal teleprompter delivery:";
    if (instruction === "teleprompter_polish") {
      instructionPrompt = "Rewrite this script specifically for spoken delivery on a camera teleprompter: use punchy short sentences, insert [pause] indicators for dramatic emphasis, remove clunky words or tongue twisters, and keep natural conversational cadence.";
    } else if (instruction === "shorten") {
      instructionPrompt = "Condense this script by 30% while retaining all critical value and high retention hooks.";
    } else if (instruction === "expand") {
      instructionPrompt = "Flesh out this script with vivid examples and stronger retention triggers without adding fluff.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `${instructionPrompt}\n\nOriginal Script:\n${script}`,
    });

    res.json({
      script: (response.text || "").trim(),
      isFallback: false,
    });
  } catch (error: any) {
    console.error("Error improving script:", error);
    res.status(500).json({ error: error?.message || "Failed to enhance script" });
  }
});

// AI Speech & Pace Analysis
app.post("/api/gemini/analyze-script", async (req, res) => {
  try {
    const { script } = req.body;
    if (!script) {
      res.status(400).json({ error: "Script content is required" });
      return;
    }

    const words = script.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Detect common Indonesian & English filler words locally
    const fillerRegex = /\b(uh|um|umm|like|you know|basically|actually|literally|so yeah|kayak|gitu|nah|anu|apa namanya|terus|ya kan)\b/gi;
    const detectedFillers = (script.match(fillerRegex) || []).map((w: string) => w.toLowerCase());
    const uniqueFillers = Array.from(new Set(detectedFillers));

    const estDurationSlow = Math.round((wordCount / 120) * 60);
    const estDurationNormal = Math.round((wordCount / 150) * 60);
    const estDurationFast = Math.round((wordCount / 180) * 60);

    let aiSuggestions = "";
    const ai = getGeminiClient();
    if (ai && wordCount > 10) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: `Analyze this spoken video script in 3 brief bullet points (Vocal Energy, Recommended Camera Eye-Contact moments, and any tricky pronunciations):\n\n${script.slice(0, 1500)}`,
        });
        aiSuggestions = response.text || "";
      } catch (e) {
        console.warn("AI suggestions skipped:", e);
      }
    }

    res.json({
      wordCount,
      charCount: script.length,
      estimatedSeconds: estDurationNormal,
      speeds: {
        slow: estDurationSlow,
        normal: estDurationNormal,
        fast: estDurationFast,
      },
      fillerWordsCount: detectedFillers.length,
      fillerWordsList: uniqueFillers,
      aiSuggestions,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Failed to analyze script" });
  }
});

// Helper: Smart fallback script generator
function generateFallbackScript(topic: string, platform: string): string {
  const isId = /[a-z]/i.test(topic);
  return `[HOOK - 00:00]
Stop scrolling! Kalau kamu sering kesulitan saat ${topic}, kamu wajib tahu trik 60 detik ini.

[PROBLEM]
Banyak orang menghabiskan waktu berjam-jam mencoba hal ini, tapi hasilnya tetap tidak maksimal dan melelahkan.

[SOLUSI UTAMA]
Pertama, tentukan prioritas terpenting kamu hari ini.
Kedua, singkirkan semua distraksi selama 25 menit penuh.
Ketiga, gunakan alat yang tepat agar prosesnya berjalan otomatis.

[CONTOH NYATA]
Waktu saya mulai menerapkan metode ini minggu lalu, produktivitas harian langsung naik dua kali lipat tanpa stres.

[CALL TO ACTION]
Simpan video ini sekarang supaya kamu bisa tonton lagi nanti saat butuh, dan tulis pertanyaan kamu di kolom komentar!`;
}

function localScriptEnhance(script: string): string {
  return script
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n\n");
}

// Start Server with Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Promptly Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
