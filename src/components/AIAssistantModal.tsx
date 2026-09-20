import React, { useState } from "react";
import {
  Sparkles,
  Wand2,
  X,
  Check,
  Zap,
  Activity,
  AlertCircle,
  Copy,
  ArrowRight,
  Clock,
  Send,
  Loader2,
  Sliders,
} from "lucide-react";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScript: string;
  onApplyScript: (script: string) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  currentScript,
  onApplyScript,
}) => {
  const [activeTab, setActiveTab] = useState<"generate" | "improve" | "analyze">("generate");

  // Generate Tab State
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("TikTok / Reels");
  const [tone, setTone] = useState("Engaging & Punchy");
  const [durationSecs, setDurationSecs] = useState(60);
  const [language, setLanguage] = useState("Indonesian");
  const [generatedScript, setGeneratedScript] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Improve Tab State
  const [improveMode, setImproveMode] = useState<"teleprompter_polish" | "shorten" | "expand">("teleprompter_polish");
  const [improvedScript, setImprovedScript] = useState("");
  const [isImproving, setIsImproving] = useState(false);

  // Analyze Tab State
  const [analysisResult, setAnalysisResult] = useState<{
    wordCount: number;
    charCount: number;
    estimatedSeconds: number;
    speeds: { slow: number; normal: number; fast: number };
    fillerWordsCount: number;
    fillerWordsList: string[];
    aiSuggestions: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  // Handle AI Generate Call
  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setGenerateError(null);

    try {
      const res = await fetch("/api/gemini/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          platform,
          tone,
          targetDurationSeconds: durationSecs,
          language,
        }),
      });
      const data = await res.json();
      if (data.script) {
        setGeneratedScript(data.script);
      } else {
        setGenerateError(data.error || "Failed to generate script");
      }
    } catch (err: any) {
      setGenerateError(err.message || "Network error while generating");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle AI Improve Call
  const handleImprove = async () => {
    if (!currentScript.trim()) return;
    setIsImproving(true);

    try {
      const res = await fetch("/api/gemini/improve-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script: currentScript,
          instruction: improveMode,
        }),
      });
      const data = await res.json();
      if (data.script) {
        setImprovedScript(data.script);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsImproving(false);
    }
  };

  // Handle Script Analysis Call
  const handleAnalyze = async () => {
    if (!currentScript.trim()) return;
    setIsAnalyzing(true);

    try {
      const res = await fetch("/api/gemini/analyze-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: currentScript }),
      });
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                AI Creator Studio
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Gemini
                </span>
              </h2>
              <p className="text-xs text-neutral-400">Generate, polish, and analyze spoken scripts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/40 px-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab("generate")}
            className={`py-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "generate"
                ? "border-rose-500 text-white"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Generate Script</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("improve");
              if (!improvedScript) handleImprove();
            }}
            className={`py-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "improve"
                ? "border-rose-500 text-white"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            <span>Teleprompter Polish</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("analyze");
              if (!analysisResult) handleAnalyze();
            }}
            className={`py-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "analyze"
                ? "border-rose-500 text-white"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pace & Fillers</span>
          </button>
        </div>

        {/* TAB 1: GENERATE */}
        {activeTab === "generate" && (
          <div className="p-4 flex-1 overflow-y-auto space-y-4 custom-scrollbar text-xs">
            <div>
              <label className="text-neutral-300 font-medium block mb-1">
                Topik Video / Ide Script
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Cara membedakan kebutuhan dan keinginan untuk mahasiswa..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  className="flex-1 bg-neutral-950 border border-neutral-800 text-white rounded-xl px-3 py-2 outline-none focus:border-rose-500 text-xs"
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !topic.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Generate</span>
                </button>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-neutral-500">Quick ideas:</span>
              {[
                "Financial literacy 60s hook",
                "3 tips lolos interview kerja",
                "Review headphone wireless",
                "30-second elevator pitch",
              ].map((idea) => (
                <button
                  key={idea}
                  onClick={() => setTopic(idea)}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700"
                >
                  {idea}
                </button>
              ))}
            </div>

            {/* Parameters */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">Format</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded p-1.5 text-xs outline-none"
                >
                  <option value="TikTok / Reels">TikTok / Reels (9:16)</option>
                  <option value="YouTube Longform">YouTube Longform (16:9)</option>
                  <option value="Pitch / Presentation">Pitch / Presentation</option>
                  <option value="Course / Tutorial">Course / Tutorial</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded p-1.5 text-xs outline-none"
                >
                  <option value="Engaging & Punchy">Engaging & Punchy</option>
                  <option value="Professional & Calm">Professional & Calm</option>
                  <option value="Casual & Friendly">Casual & Friendly</option>
                  <option value="High Energy">High Energy</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">Target Durasi</label>
                <select
                  value={durationSecs}
                  onChange={(e) => setDurationSecs(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded p-1.5 text-xs outline-none"
                >
                  <option value={30}>30 Detik (~70 kata)</option>
                  <option value={60}>60 Detik (~140 kata)</option>
                  <option value={90}>90 Detik (~210 kata)</option>
                  <option value={120}>2 Menit (~300 kata)</option>
                </select>
              </div>
            </div>

            {/* Generated Script Preview */}
            {generatedScript && (
              <div className="space-y-2 pt-2 border-t border-neutral-800 animate-in fade-in">
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="font-semibold text-xs text-white">Generated Script Ready:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onApplyScript(generatedScript);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-semibold shadow transition-colors"
                    >
                      <Check className="w-3 h-3" />
                      <span>Insert into Prompter</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 max-h-56 overflow-y-auto text-neutral-200 text-xs font-sans leading-relaxed whitespace-pre-wrap select-text">
                  {generatedScript}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: IMPROVE */}
        {activeTab === "improve" && (
          <div className="p-4 flex-1 overflow-y-auto space-y-4 custom-scrollbar text-xs">
            <div className="flex items-center justify-between">
              <span className="text-neutral-300 font-medium">Pilih Mode Optimasi Teleprompter:</span>
              <div className="flex gap-1.5">
                {[
                  { id: "teleprompter_polish", label: "Add Pauses & Punchy" },
                  { id: "shorten", label: "Condense 30%" },
                  { id: "expand", label: "Add Examples" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setImproveMode(mode.id as any);
                    }}
                    className={`px-2.5 py-1 rounded text-xs transition-colors border ${
                      improveMode === mode.id
                        ? "bg-rose-500/20 border-rose-500 text-rose-300 font-medium"
                        : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleImprove}
              disabled={isImproving || !currentScript.trim()}
              className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-xl font-medium border border-neutral-700 transition-colors flex items-center justify-center gap-2"
            >
              {isImproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-400" />}
              <span>Optimize Current Script</span>
            </button>

            {improvedScript && (
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="font-semibold text-white">Polished Teleprompter Output:</span>
                  <button
                    onClick={() => {
                      onApplyScript(improvedScript);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-semibold shadow transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    <span>Apply to Prompter</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 max-h-60 overflow-y-auto text-neutral-200 text-xs font-sans leading-relaxed whitespace-pre-wrap select-text">
                  {improvedScript}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ANALYZE */}
        {activeTab === "analyze" && (
          <div className="p-4 flex-1 overflow-y-auto space-y-4 custom-scrollbar text-xs">
            {isAnalyzing ? (
              <div className="py-12 flex flex-col items-center justify-center text-neutral-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
                <span>Menganalisis tempo bicara dan filler words...</span>
              </div>
            ) : analysisResult ? (
              <div className="space-y-4 animate-in fade-in">
                {/* Metric grid */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-center">
                    <span className="text-[10px] text-neutral-400 block mb-1">Total Words</span>
                    <span className="text-lg font-bold font-mono text-white">
                      {analysisResult.wordCount}
                    </span>
                  </div>

                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-center">
                    <span className="text-[10px] text-neutral-400 block mb-1">Filler Words Detected</span>
                    <span className={`text-lg font-bold font-mono ${
                      analysisResult.fillerWordsCount > 0 ? "text-amber-400" : "text-emerald-400"
                    }`}>
                      {analysisResult.fillerWordsCount}
                    </span>
                  </div>

                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-center">
                    <span className="text-[10px] text-neutral-400 block mb-1">Est. Duration (150 WPM)</span>
                    <span className="text-lg font-bold font-mono text-white">
                      {Math.floor(analysisResult.estimatedSeconds / 60)}m{" "}
                      {analysisResult.estimatedSeconds % 60}s
                    </span>
                  </div>
                </div>

                {/* Fillers Breakdown */}
                {analysisResult.fillerWordsList.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                    <span className="font-semibold block mb-1 text-[11px]">
                      ⚠️ Potential Fillers to watch out for:
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      {analysisResult.fillerWordsList.map((w) => (
                        <span
                          key={w}
                          className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] border border-amber-500/30"
                        >
                          "{w}"
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Delivery Tips */}
                {analysisResult.aiSuggestions && (
                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 leading-relaxed whitespace-pre-wrap">
                    <span className="text-[11px] font-bold text-white block mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                      Vocal Delivery Recommendations:
                    </span>
                    {analysisResult.aiSuggestions}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-neutral-400">
                <button
                  onClick={handleAnalyze}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-semibold shadow"
                >
                  Analyze Current Script
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
