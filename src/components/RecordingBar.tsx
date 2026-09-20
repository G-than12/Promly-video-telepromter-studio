import React from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Circle,
  Square,
  Volume2,
  Gauge,
  Sparkles,
  Check,
  AlertCircle,
} from "lucide-react";
import { TeleprompterSettings } from "../types";

interface RecordingBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onResetScroll: () => void;
  scrollSpeed: number;
  onSpeedChange: (speed: number) => void;
  isAutoScroll: boolean;
  onToggleAutoScroll: () => void;
  isRecording: boolean;
  isPausedRecording: boolean;
  recordingSeconds: number;
  onStartRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  onStopRecording: () => void;
  cameraActive: boolean;
  micActive: boolean;
  audioLevel: number;
}

export const RecordingBar: React.FC<RecordingBarProps> = ({
  isPlaying,
  onTogglePlay,
  onResetScroll,
  scrollSpeed,
  onSpeedChange,
  isAutoScroll,
  onToggleAutoScroll,
  isRecording,
  isPausedRecording,
  recordingSeconds,
  onStartRecording,
  onPauseRecording,
  onResumeRecording,
  onStopRecording,
  cameraActive,
  micActive,
  audioLevel,
}) => {
  const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-16 border-t border-neutral-800/80 bg-neutral-950/95 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between z-30 select-none">
      {/* Left: Prompter Playback & Speed Controls */}
      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={onTogglePlay}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium text-xs shadow-md transition-all ${
            isPlaying
              ? "bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold shadow-amber-500/20"
              : "bg-neutral-800 hover:bg-neutral-700 text-white"
          }`}
          title="Play/Pause Prompter Auto-Scroll (Space)"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          <span className="hidden sm:inline">{isPlaying ? "Pause Scroll" : "Start Prompter"}</span>
        </button>

        {/* Reset Button */}
        <button
          onClick={onResetScroll}
          className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
          title="Reset script to top (R)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Auto-Scroll Indicator / Toggle */}
        <button
          onClick={onToggleAutoScroll}
          className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
            isAutoScroll
              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
              : "bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300"
          }`}
          title="Nyalakan / Matikan Auto-scroll otomatis"
        >
          <span className={`w-2 h-2 rounded-full ${isAutoScroll ? "bg-emerald-400 animate-pulse" : "bg-neutral-600"}`} />
          <span>Auto-Scroll: {isAutoScroll ? "ON" : "OFF"}</span>
        </button>

        <div className="h-5 w-px bg-neutral-800 mx-1 hidden md:block" />

        {/* Speed Multiplier Quick Buttons */}
        <div className="hidden lg:flex items-center gap-1 bg-neutral-900/80 p-1 rounded-xl border border-neutral-800/80 text-[11px]">
          <Gauge className="w-3.5 h-3.5 text-neutral-500 ml-1.5 mr-0.5" />
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2 py-1 rounded-lg transition-colors font-mono font-medium ${
                Math.abs(scrollSpeed - s) < 0.05
                  ? "bg-rose-500 text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Speed Slider for mobile / fine-tuning */}
        <div className="flex items-center gap-2 text-xs lg:hidden">
          <span className="text-[11px] text-neutral-400 font-mono">{scrollSpeed}x</span>
          <input
            type="range"
            min={0.25}
            max={3.0}
            step={0.1}
            value={scrollSpeed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-20 sm:w-28 accent-rose-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Center: BIG RECORDING CONTROLS */}
      <div className="flex items-center gap-3">
        {!isRecording ? (
          <button
            onClick={onStartRecording}
            className="group relative flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-500/25 transition-all transform active:scale-95"
          >
            <span className="w-3 h-3 rounded-full bg-white group-hover:scale-110 transition-transform" />
            <span>Start Recording</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-neutral-900 border border-rose-500/50 p-1.5 rounded-full shadow-lg">
            {/* Live Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold text-white">
              <span className={`w-2.5 h-2.5 rounded-full bg-rose-500 ${isPausedRecording ? "" : "animate-pulse"}`} />
              <span>{formatTime(recordingSeconds)}</span>
            </div>

            {/* Pause / Resume Recording */}
            <button
              onClick={isPausedRecording ? onResumeRecording : onPauseRecording}
              className="px-3 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
            >
              {isPausedRecording ? "Resume" : "Pause"}
            </button>

            {/* Stop Recording */}
            <button
              onClick={onStopRecording}
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Stop</span>
            </button>
          </div>
        )}
      </div>

      {/* Right: Hardware Readiness & Mic level */}
      <div className="hidden md:flex items-center gap-3 text-xs">
        <div className="flex items-center gap-2 text-neutral-400">
          <div className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${cameraActive ? "bg-emerald-400" : "bg-neutral-600"}`} />
            <span className="text-[11px]">Cam</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${micActive ? "bg-emerald-400" : "bg-neutral-600"}`} />
            <span className="text-[11px]">Mic</span>
          </div>
        </div>

        {/* Audio VU Indicator */}
        <div className="flex items-center gap-1 bg-neutral-900 px-2 py-1 rounded-md border border-neutral-800">
          <Volume2 className="w-3.5 h-3.5 text-neutral-400" />
          <div className="w-12 h-1.5 bg-neutral-800 rounded-full overflow-hidden flex items-center">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 transition-all duration-75"
              style={{ width: `${Math.min(100, Math.round(audioLevel * 100))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
