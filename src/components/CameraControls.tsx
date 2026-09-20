import React, { useEffect, useState } from "react";
import {
  Camera,
  Mic,
  Volume2,
  AlertTriangle,
  Layers,
  Smartphone,
  Tv,
  Square,
  Maximize,
  CheckCircle2,
  RefreshCw,
  Video,
} from "lucide-react";
import { AspectRatio, RecordingMode } from "../types";

interface CameraControlsProps {
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  recordingMode: RecordingMode;
  onRecordingModeChange: (mode: RecordingMode) => void;
  mirrorCamera: boolean;
  onMirrorCameraChange: (mirror: boolean) => void;
  resolution: "720p" | "1080p";
  onResolutionChange: (res: "720p" | "1080p") => void;
  countdownSeconds: number;
  onCountdownChange: (sec: number) => void;
  selectedCameraId: string;
  onSelectCamera: (deviceId: string) => void;
  selectedMicId: string;
  onSelectMic: (deviceId: string) => void;
  audioLevel: number; // 0.0 to 1.0
  cameraActive: boolean;
  micActive: boolean;
  onRequestPermissions: () => void;
  permissionError: string | null;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  aspectRatio,
  onAspectRatioChange,
  recordingMode,
  onRecordingModeChange,
  mirrorCamera,
  onMirrorCameraChange,
  resolution,
  onResolutionChange,
  countdownSeconds,
  onCountdownChange,
  selectedCameraId,
  onSelectCamera,
  selectedMicId,
  onSelectMic,
  audioLevel,
  cameraActive,
  micActive,
  onRequestPermissions,
  permissionError,
}) => {
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);

  // Enumerate hardware devices
  const refreshDevices = async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const devices = await navigator.mediaDevices.enumerateDevices();
      const video = devices.filter((d) => d.kind === "videoinput");
      const audio = devices.filter((d) => d.kind === "audioinput");
      setVideoDevices(video);
      setAudioDevices(audio);
    } catch (e) {
      console.warn("Could not enumerate devices:", e);
    }
  };

  useEffect(() => {
    refreshDevices();
    navigator.mediaDevices?.addEventListener?.("devicechange", refreshDevices);
    return () => {
      navigator.mediaDevices?.removeEventListener?.("devicechange", refreshDevices);
    };
  }, []);

  const aspectRatios: { id: AspectRatio; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: "9:16", label: "9:16", desc: "TikTok / Reels / Shorts", icon: <Smartphone className="w-4 h-4" /> },
    { id: "16:9", label: "16:9", desc: "YouTube / Landscape", icon: <Tv className="w-4 h-4" /> },
    { id: "1:1", label: "1:1", desc: "Instagram Square", icon: <Square className="w-4 h-4" /> },
    { id: "4:5", label: "4:5", desc: "Instagram Feed", icon: <Smartphone className="w-4 h-4 rotate-90" /> },
  ];

  // Audio level meter bars
  const totalBars = 16;
  const activeBars = Math.round(audioLevel * totalBars);
  const isClipping = audioLevel > 0.88;
  const isTooLow = audioLevel < 0.05 && micActive;

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-200 overflow-y-auto p-4 space-y-6 text-xs select-none custom-scrollbar">
      {/* SECTION 1: Permissions & Device Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-semibold text-neutral-100">
            <Camera className="w-3.5 h-3.5 text-rose-400" />
            <span>Hardware Devices</span>
          </div>
          <button
            onClick={onRequestPermissions}
            className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium"
          >
            <RefreshCw className="w-3 h-3" />
            Re-check
          </button>
        </div>

        {permissionError && (
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="leading-tight">
              <span className="font-semibold block">Device Permission Required</span>
              <span>{permissionError}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div className={`p-2 rounded-lg border flex items-center gap-2 ${
            cameraActive ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300" : "bg-neutral-900 border-neutral-800 text-neutral-400"
          }`}>
            <Camera className="w-4 h-4" />
            <div>
              <span className="text-[10px] text-neutral-400 block">Camera</span>
              <span className="font-medium text-xs text-white">{cameraActive ? "Active" : "Disabled"}</span>
            </div>
          </div>

          <div className={`p-2 rounded-lg border flex items-center gap-2 ${
            micActive ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300" : "bg-neutral-900 border-neutral-800 text-neutral-400"
          }`}>
            <Mic className="w-4 h-4" />
            <div>
              <span className="text-[10px] text-neutral-400 block">Microphone</span>
              <span className="font-medium text-xs text-white">{micActive ? "Active" : "Disabled"}</span>
            </div>
          </div>
        </div>

        {/* Camera Selector */}
        <div>
          <label className="text-[11px] text-neutral-400 mb-1 block">Selected Camera</label>
          <select
            value={selectedCameraId}
            onChange={(e) => onSelectCamera(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-lg p-2 text-xs outline-none focus:border-rose-500"
          >
            {videoDevices.length > 0 ? (
              videoDevices.map((d, index) => (
                <option key={d.deviceId || index} value={d.deviceId}>
                  {d.label || `Camera ${index + 1}`}
                </option>
              ))
            ) : (
              <option value="">Default Web Camera</option>
            )}
          </select>
        </div>

        {/* Microphone Selector */}
        <div>
          <label className="text-[11px] text-neutral-400 mb-1 block">Selected Microphone</label>
          <select
            value={selectedMicId}
            onChange={(e) => onSelectMic(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-lg p-2 text-xs outline-none focus:border-rose-500"
          >
            {audioDevices.length > 0 ? (
              audioDevices.map((d, index) => (
                <option key={d.deviceId || index} value={d.deviceId}>
                  {d.label || `Microphone ${index + 1}`}
                </option>
              ))
            ) : (
              <option value="">Default Audio Input</option>
            )}
          </select>
        </div>
      </div>

      {/* SECTION 2: Audio VU Meter & Warning System */}
      <div className="space-y-2 bg-neutral-900/50 p-3 rounded-xl border border-neutral-800/80">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-neutral-300 font-medium flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            Mic Audio Monitor
          </span>
          <span className="font-mono text-neutral-400">{Math.round(audioLevel * 100)}%</span>
        </div>

        {/* Animated VU Bars */}
        <div className="flex items-center gap-1 h-5 bg-neutral-950 p-1 rounded-md border border-neutral-800">
          {Array.from({ length: totalBars }).map((_, i) => {
            const isLit = i < activeBars;
            let barColor = "bg-neutral-800";
            if (isLit) {
              if (i >= totalBars - 3) {
                barColor = "bg-rose-500";
              } else if (i >= totalBars - 7) {
                barColor = "bg-amber-400";
              } else {
                barColor = "bg-emerald-400";
              }
            }
            return (
              <div
                key={i}
                className={`flex-1 h-full rounded-xs transition-all duration-75 ${barColor}`}
              />
            );
          })}
        </div>

        {/* Audio Warnings from PRD */}
        {isClipping && (
          <div className="p-1.5 rounded bg-rose-500/20 text-rose-300 text-[10px] flex items-center gap-1.5 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span>⚠️ Audio clipping detected! Please speak slightly further from mic.</span>
          </div>
        )}
        {isTooLow && (
          <div className="p-1.5 rounded bg-amber-500/10 text-amber-300 text-[10px] flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>⚠️ Your microphone volume is very low. Check your input volume.</span>
          </div>
        )}
      </div>

      {/* SECTION 3: Aspect Ratio & Canvas Format */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 font-semibold text-neutral-100">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Aspect Ratio & Format</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {aspectRatios.map((item) => (
            <button
              key={item.id}
              onClick={() => onAspectRatioChange(item.id)}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                aspectRatio === item.id
                  ? "bg-rose-500/15 border-rose-500/60 text-white shadow-sm"
                  : "bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-white">{item.label}</span>
                {item.icon}
              </div>
              <span className="text-[10px] text-neutral-400">{item.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 4: Recording Mode (Clean vs Overlay) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-neutral-100">Recording Mode</span>
          <span className="text-[10px] text-neutral-400 font-mono">Tech Spec 18</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onRecordingModeChange("clean")}
            className={`p-2.5 rounded-xl border text-left transition-colors ${
              recordingMode === "clean"
                ? "bg-rose-500/15 border-rose-500 text-white"
                : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <div className="font-semibold text-xs text-white mb-0.5">Clean Camera</div>
            <div className="text-[10px] text-neutral-400 leading-tight">
              Prompter invisible in final video. Perfect for creators.
            </div>
          </button>

          <button
            onClick={() => onRecordingModeChange("overlay")}
            className={`p-2.5 rounded-xl border text-left transition-colors ${
              recordingMode === "overlay"
                ? "bg-rose-500/15 border-rose-500 text-white"
                : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <div className="font-semibold text-xs text-white mb-0.5">Overlay Prompter</div>
            <div className="text-[10px] text-neutral-400 leading-tight">
              Burns prompter text into video. Ideal for tutorials & MC.
            </div>
          </button>
        </div>
      </div>

      {/* SECTION 5: Recording Settings (Countdown & Mirror) */}
      <div className="space-y-3 bg-neutral-900/40 p-3 rounded-xl border border-neutral-800/80">
        {/* Mirror Camera */}
        <label className="flex items-center justify-between text-neutral-200 cursor-pointer">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-white block">Mirror Kamera</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                  mirrorCamera
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}
              >
                {mirrorCamera ? "Aktif (Mirror)" : "Mati (Normal / Asli)"}
              </span>
            </div>
            <span className="text-[10px] text-neutral-400">
              {mirrorCamera
                ? "Kamera dibalik horizontal seperti cermin"
                : "Video normal (tidak terbalik / tidak di-mirror)"}
            </span>
          </div>
          <input
            type="checkbox"
            checked={mirrorCamera}
            onChange={(e) => onMirrorCameraChange(e.target.checked)}
            className="rounded accent-rose-500 w-4 h-4 cursor-pointer"
          />
        </label>

        <div className="border-t border-neutral-800 pt-2" />

        {/* Countdown duration */}
        <div>
          <div className="flex justify-between text-[11px] text-neutral-300 mb-1.5">
            <span>Pre-roll Countdown</span>
            <span className="text-amber-400 font-semibold">{countdownSeconds === 0 ? "Off" : `${countdownSeconds}s`}</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[0, 3, 5, 10].map((sec) => (
              <button
                key={sec}
                onClick={() => onCountdownChange(sec)}
                className={`py-1 rounded text-center text-xs font-medium border transition-colors ${
                  countdownSeconds === sec
                    ? "bg-amber-500/20 border-amber-500 text-amber-300"
                    : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {sec === 0 ? "None" : `${sec}s`}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-2" />

        {/* Resolution */}
        <div>
          <label className="text-[11px] text-neutral-300 mb-1.5 block">Target Resolution</label>
          <div className="grid grid-cols-2 gap-2">
            {(["720p", "1080p"] as ("720p" | "1080p")[]).map((res) => (
              <button
                key={res}
                onClick={() => onResolutionChange(res)}
                className={`py-1.5 rounded-lg text-center text-xs font-medium border transition-colors ${
                  resolution === res
                    ? "bg-rose-500/20 border-rose-500 text-rose-300"
                    : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {res === "1080p" ? "1080p Full HD" : "720p HD"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
