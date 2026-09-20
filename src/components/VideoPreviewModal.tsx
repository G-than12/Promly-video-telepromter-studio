import React, { useState } from "react";
import {
  Download,
  RotateCcw,
  CheckCircle2,
  X,
  Clock,
  HardDrive,
  Film,
  Sparkles,
  Share2,
  FlipHorizontal,
} from "lucide-react";
import { RecordingTake } from "../types";

interface VideoPreviewModalProps {
  take: RecordingTake | null;
  onClose: () => void;
  onRecordAgain: () => void;
  projectTitle: string;
}

export const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({
  take,
  onClose,
  onRecordAgain,
  projectTitle,
}) => {
  const [flipPreview, setFlipPreview] = useState(false);

  if (!take) return null;

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "12.4 MB";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleDownload = () => {
    if (!take.blobUrl) return;
    const safeTitle = projectTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "take";
    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `promptly-${safeTitle}-${dateStr}.webm`;

    const a = document.createElement("a");
    a.href = take.blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Recording Complete!</h2>
              <p className="text-xs text-neutral-400">Take siap ditinjau dan diunduh</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player */}
        <div className="p-4 flex-1 overflow-y-auto flex flex-col items-center bg-black/40">
          <div className="relative rounded-xl overflow-hidden border border-neutral-800 bg-black max-h-[48vh] w-full flex items-center justify-center group">
            <video
              src={take.blobUrl}
              controls
              autoPlay
              playsInline
              className={`max-h-[46vh] max-w-full rounded-lg object-contain transition-transform ${
                flipPreview ? "-scale-x-100" : ""
              }`}
            />

            {/* Quick status & flip toggle */}
            <div className="absolute top-3 right-3 flex items-center gap-2 pointer-events-auto">
              <span className="px-2.5 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md border border-white/10 text-[10px] font-medium text-neutral-300">
                {flipPreview ? "Preview: Flipped" : "Video Asli: Normal (Tidak Mirror)"}
              </span>
              <button
                onClick={() => setFlipPreview((prev) => !prev)}
                className="p-1.5 rounded-full bg-neutral-900/80 backdrop-blur-md border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                title="Flip player preview horizontally"
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Video Metadata Cards */}
          <div className="grid grid-cols-4 gap-2 w-full mt-4 text-xs">
            <div className="bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800 text-center">
              <div className="flex items-center justify-center text-neutral-400 gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px]">Duration</span>
              </div>
              <span className="font-mono font-bold text-white text-sm">
                {formatDuration(take.durationSeconds)}
              </span>
            </div>

            <div className="bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800 text-center">
              <div className="flex items-center justify-center text-neutral-400 gap-1 mb-1">
                <Film className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-[10px]">Resolution</span>
              </div>
              <span className="font-mono font-bold text-white text-sm">{take.resolution}</span>
            </div>

            <div className="bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800 text-center">
              <div className="flex items-center justify-center text-neutral-400 gap-1 mb-1">
                <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px]">Est. Size</span>
              </div>
              <span className="font-mono font-bold text-white text-sm">
                {formatFileSize(take.sizeBytes)}
              </span>
            </div>

            <div className="bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800 text-center">
              <div className="flex items-center justify-center text-neutral-400 gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-[10px]">Format</span>
              </div>
              <span className="font-mono font-bold text-white text-sm">{take.aspectRatio}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onRecordAgain();
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Record Again</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-bold shadow-lg shadow-rose-500/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Video</span>
          </button>
        </div>
      </div>
    </div>
  );
};
