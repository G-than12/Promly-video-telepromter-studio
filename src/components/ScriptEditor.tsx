import React, { useState, useMemo, useRef } from "react";
import {
  FileText,
  Upload,
  Search,
  Replace,
  Clock,
  Type,
  Sparkles,
  PauseCircle,
  RotateCcw,
  Copy,
  Check,
  Zap,
} from "lucide-react";

interface ScriptEditorProps {
  script: string;
  onScriptChange: (newScript: string) => void;
  onOpenAI: () => void;
  speakingWpm: number;
  setSpeakingWpm: (wpm: number) => void;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  script,
  onScriptChange,
  onOpenAI,
  speakingWpm,
  setSpeakingWpm,
}) => {
  const [showSearchReplace, setShowSearchReplace] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Calculate script metrics
  const stats = useMemo(() => {
    const trimmed = script.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const chars = script.length;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).length : 0;
    const totalSeconds = words > 0 ? Math.round((words / speakingWpm) * 60) : 0;

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedDuration = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    return { words, chars, paragraphs, formattedDuration, totalSeconds };
  }, [script, speakingWpm]);

  // Insert text at cursor position (e.g. [pause])
  const insertTextAtCursor = (textToInsert: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const currentVal = textareaRef.current.value;

    const updated = currentVal.substring(0, start) + "\n\n" + textToInsert + "\n\n" + currentVal.substring(end);
    onScriptChange(updated);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = start + textToInsert.length + 4;
        textareaRef.current.selectionEnd = start + textToInsert.length + 4;
        textareaRef.current.focus();
      }
    }, 10);
  };

  // Search & Replace logic
  const handleReplace = (all = false) => {
    if (!searchQuery) return;
    if (all) {
      const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      const updated = script.replace(regex, replaceQuery);
      onScriptChange(updated);
    } else {
      const index = script.toLowerCase().indexOf(searchQuery.toLowerCase());
      if (index !== -1) {
        const updated = script.substring(0, index) + replaceQuery + script.substring(index + searchQuery.length);
        onScriptChange(updated);
      }
    }
  };

  // File Upload handler (.txt, .md)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onScriptChange(content);
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = "";
  };

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Quick formatting: add clean double spacing between sentences
  const handleBeautifyParagraphs = () => {
    const cleaned = script
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .join("\n\n");
    onScriptChange(cleaned);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-200">
      {/* Script Metrics Bar */}
      <div className="p-3 border-b border-neutral-800 bg-neutral-900/50 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-neutral-800/80 px-2 py-1 rounded-md text-neutral-300">
            <Type className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-semibold text-white">{stats.words}</span> words
          </div>
          <div className="flex items-center gap-1.5 bg-neutral-800/80 px-2 py-1 rounded-md text-neutral-300">
            <span className="font-semibold text-white">{stats.chars}</span> chars
          </div>
          <div className="flex items-center gap-1.5 bg-neutral-800/80 px-2 py-1 rounded-md text-neutral-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-amber-300">{stats.formattedDuration}</span> est. video
          </div>
        </div>

        {/* WPM Speed Control */}
        <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-md text-[11px]">
          <span className="text-neutral-400">Pace:</span>
          {[
            { label: "120 Slow", wpm: 120 },
            { label: "150 Normal", wpm: 150 },
            { label: "180 Fast", wpm: 180 },
          ].map((item) => (
            <button
              key={item.wpm}
              onClick={() => setSpeakingWpm(item.wpm)}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                speakingWpm === item.wpm ? "bg-rose-500 text-white font-medium" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {item.wpm}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Toolset */}
      <div className="px-3 py-2 border-b border-neutral-800/80 bg-neutral-900/30 flex items-center justify-between gap-1.5 flex-wrap">
        <div className="flex items-center gap-1">
          {/* Add Pause Button */}
          <button
            onClick={() => insertTextAtCursor("[pause]")}
            className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-amber-300 hover:text-amber-200 text-xs rounded border border-neutral-700 flex items-center gap-1 transition-colors"
            title="Insert [pause] marker for deliberate speaking cadence"
          >
            <PauseCircle className="w-3.5 h-3.5" />
            <span>+ [pause]</span>
          </button>

          {/* Search & Replace Toggle */}
          <button
            onClick={() => setShowSearchReplace(!showSearchReplace)}
            className={`p-1.5 text-xs rounded border transition-colors ${
              showSearchReplace
                ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                : "bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-300"
            }`}
            title="Search & Replace"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Clean Paragraphs */}
          <button
            onClick={handleBeautifyParagraphs}
            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded border border-neutral-700 transition-colors"
            title="Format with clean breathing spacing between paragraphs"
          >
            <Zap className="w-3.5 h-3.5 text-sky-400" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* File Upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.md"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded border border-neutral-700 transition-colors flex items-center gap-1"
            title="Import .txt or .md script"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import</span>
          </button>

          {/* Copy Script */}
          <button
            onClick={handleCopy}
            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded border border-neutral-700 transition-colors"
            title="Copy entire script"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* AI Assist Shortcut */}
          <button
            onClick={onOpenAI}
            className="px-2 py-1 bg-gradient-to-r from-rose-500/30 to-amber-500/30 hover:from-rose-500/40 hover:to-amber-500/40 text-amber-200 text-xs rounded border border-rose-500/40 flex items-center gap-1 font-medium transition-all"
            title="Generate or polish with AI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Polish</span>
          </button>
        </div>
      </div>

      {/* Search & Replace Panel */}
      {showSearchReplace && (
        <div className="p-2.5 bg-neutral-900 border-b border-neutral-800 flex flex-wrap items-center gap-2 text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-1 flex-1 min-w-[140px] bg-neutral-950 px-2 py-1 rounded border border-neutral-700">
            <Search className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Find..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-white outline-none w-full text-xs"
            />
          </div>

          <div className="flex items-center gap-1 flex-1 min-w-[140px] bg-neutral-950 px-2 py-1 rounded border border-neutral-700">
            <Replace className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Replace with..."
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              className="bg-transparent text-white outline-none w-full text-xs"
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleReplace(false)}
              className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded border border-neutral-700"
            >
              Replace
            </button>
            <button
              onClick={() => handleReplace(true)}
              className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded border border-neutral-700"
            >
              Replace All
            </button>
          </div>
        </div>
      )}

      {/* Main Textarea */}
      <div className="relative flex-1 p-3 min-h-0">
        <textarea
          ref={textareaRef}
          value={script}
          onChange={(e) => onScriptChange(e.target.value)}
          placeholder="Ketik atau tempelkan script video di sini..."
          className="w-full h-full p-3 bg-neutral-900/40 hover:bg-neutral-900/60 focus:bg-neutral-900/80 text-neutral-100 placeholder-neutral-500 rounded-xl border border-neutral-800 focus:border-rose-500/60 outline-none resize-none font-sans text-sm leading-relaxed transition-all selection:bg-rose-500/30 selection:text-white"
        />

        {/* Empty state hint */}
        {script.trim().length === 0 && (
          <div className="absolute inset-0 m-auto flex flex-col items-center justify-center pointer-events-none text-neutral-500 gap-2 p-6 text-center">
            <FileText className="w-8 h-8 text-neutral-600 mb-1" />
            <p className="text-sm font-medium text-neutral-400">Belum ada script video</p>
            <p className="text-xs text-neutral-500 max-w-xs">
              Mulai ketik, upload file .txt, atau klik <span className="text-amber-400 font-semibold">AI Script</span> untuk membuat script otomatis dalam hitungan detik.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
