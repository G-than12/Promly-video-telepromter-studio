import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  GripHorizontal,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CameraOff,
  Video,
  Eye,
  Sliders,
  Maximize2,
  ChevronDown,
  FlipHorizontal,
} from "lucide-react";
import { TeleprompterSettings, AspectRatio } from "../types";

interface CameraViewProps {
  stream: MediaStream | null;
  cameraActive: boolean;
  permissionError: string | null;
  onRequestPermissions: () => void;
  aspectRatio: AspectRatio;
  mirrorCamera: boolean;
  onToggleMirrorCamera?: () => void;
  settings: TeleprompterSettings;
  onSettingsChange: (updated: Partial<TeleprompterSettings>) => void;
  script: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onResetScroll: () => void;
  resetScrollTrigger?: number;
  isRecording: boolean;
  recordingSeconds: number;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const CameraViewComponent: React.FC<CameraViewProps> = ({
  stream,
  cameraActive,
  permissionError,
  onRequestPermissions,
  aspectRatio,
  mirrorCamera,
  onToggleMirrorCamera,
  settings,
  onSettingsChange,
  script,
  isPlaying,
  onTogglePlay,
  onResetScroll,
  resetScrollTrigger = 0,
  isRecording,
  recordingSeconds,
  canvasRef,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef<number>(0);

  // Dragging state for the teleprompter box
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; startPosX: number; startPosY: number }>({
    x: 0,
    y: 0,
    startPosX: 50,
    startPosY: 30,
  });

  // Resizing state
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; startW: number; startH: number }>({
    x: 0,
    y: 0,
    startW: 70,
    startH: 40,
  });

  // Active sentence index for smart highlight
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(0);
  const activeSentenceRef = useRef(0);

  // Break script into sentences / readable blocks
  const sentences = useMemo(() => {
    if (!script.trim()) return [];
    // Split by lines or sentence endings
    const rawLines = script.split("\n");
    const blocks: string[] = [];
    rawLines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        blocks.push("");
      } else if (trimmed === "[pause]") {
        blocks.push("[pause]");
      } else {
        // Split by sentences if line is long
        const sents = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
        if (sents) {
          sents.forEach((s) => blocks.push(s.trim()));
        } else {
          blocks.push(trimmed);
        }
      }
    });
    return blocks.filter((b, idx, arr) => b !== "" || (idx > 0 && arr[idx - 1] !== ""));
  }, [script]);

  // Connect video element to media stream
  useEffect(() => {
    if (videoRef.current) {
      if (stream) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((err) => console.warn("Video play error:", err));
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  // Keep scrollPosRef updated when user manually scrolls or touches
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      scrollPosRef.current = scrollContainerRef.current.scrollTop;
    }
  };

  // Auto-scroll engine using requestAnimationFrame with floating-point accumulator and soft-start ramp
  useEffect(() => {
    if (!isPlaying) return;

    // Sync initial scroll position with actual DOM scrollTop
    if (scrollContainerRef.current) {
      scrollPosRef.current = scrollContainerRef.current.scrollTop;
    }

    let animId: number;
    let lastTime: number = performance.now();
    const startTime: number = performance.now();
    let lastSentenceCheckTime: number = 0;

    const scrollLoop = (time: number) => {
      // Cap delta at 50ms to prevent huge skips during garbage collection or background tasks
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      if (scrollContainerRef.current && settings.isAutoScroll !== false) {
        const el = scrollContainerRef.current;

        // Soft acceleration ramp for the first 350ms to guarantee zero initial jerk/freeze
        const elapsed = (time - startTime) / 1000;
        const ramp = Math.min(1, Math.max(0.2, elapsed / 0.35));

        // Base scroll speed: 50 pixels per second * scrollSpeed multiplier * soft start
        const pixelsPerSecond = 50 * (settings.scrollSpeed || 1.0) * ramp;
        const scrollDelta = pixelsPerSecond * delta * (settings.reverseScroll ? -1 : 1);

        scrollPosRef.current += scrollDelta;

        const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
        if (scrollPosRef.current > maxScroll) {
          scrollPosRef.current = maxScroll;
        } else if (scrollPosRef.current < 0) {
          scrollPosRef.current = 0;
        }

        // Apply scroll directly without layout thrashing
        el.scrollTop = scrollPosRef.current;

        // Throttled active sentence check (runs every 150ms instead of 60 times/sec)
        // to completely eliminate layout thrashing from offsetTop and querySelectorAll
        if (settings.highlightCurrentSentence && time - lastSentenceCheckTime > 150) {
          lastSentenceCheckTime = time;
          const indicatorY = (el.clientHeight * (settings.readingIndicatorPosition || 45)) / 100;
          const sentenceEls = el.querySelectorAll<HTMLElement>("[data-sentence-index]");
          for (let i = 0; i < sentenceEls.length; i++) {
            const sentEl = sentenceEls[i];
            const top = sentEl.offsetTop - el.scrollTop;
            const bottom = top + sentEl.offsetHeight;
            if (top <= indicatorY && bottom >= indicatorY) {
              const idx = Number(sentEl.getAttribute("data-sentence-index"));
              if (!isNaN(idx) && activeSentenceRef.current !== idx) {
                activeSentenceRef.current = idx;
                setActiveSentenceIndex(idx);
              }
              break;
            }
          }
        }
      }

      animId = requestAnimationFrame(scrollLoop);
    };

    animId = requestAnimationFrame(scrollLoop);
    return () => cancelAnimationFrame(animId);
  }, [
    isPlaying,
    settings.scrollSpeed,
    settings.reverseScroll,
    settings.isAutoScroll,
    settings.highlightCurrentSentence,
    settings.readingIndicatorPosition,
  ]);

  // Reset scroll when resetScrollTrigger fires - instant reset with zero animation collision
  useEffect(() => {
    if (resetScrollTrigger > 0) {
      scrollPosRef.current = 0;
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      activeSentenceRef.current = 0;
      setActiveSentenceIndex(0);
    }
  }, [resetScrollTrigger]);

  // Listen for reset trigger
  const handleManualReset = () => {
    scrollPosRef.current = 0;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    activeSentenceRef.current = 0;
    setActiveSentenceIndex(0);
    onResetScroll();
  };

  // Dragging handlers
  const handleDragMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      startPosX: settings.positionX,
      startPosY: settings.positionY,
    });
  };

  // Touch drag support
  const handleDragTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX,
        y: touch.clientY,
        startPosX: settings.positionX,
        startPosY: settings.positionY,
      });
    }
  };

  // Resize handler
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      startW: settings.widthPercent,
      startH: settings.heightPercent,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      if (isDragging) {
        const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
        const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

        const newX = Math.max(10, Math.min(90, dragStart.startPosX + deltaX));
        const newY = Math.max(10, Math.min(90, dragStart.startPosY + deltaY));

        onSettingsChange({
          positionX: Math.round(newX),
          positionY: Math.round(newY),
        });
      }

      if (isResizing) {
        const deltaW = ((e.clientX - resizeStart.x) / rect.width) * 100 * 2; // centered
        const deltaH = ((e.clientY - resizeStart.y) / rect.height) * 100 * 2;

        const newW = Math.max(25, Math.min(96, resizeStart.startW + deltaW));
        const newH = Math.max(15, Math.min(85, resizeStart.startH + deltaH));

        onSettingsChange({
          widthPercent: Math.round(newW),
          heightPercent: Math.round(newH),
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length !== 1) return;
      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];

      if (isDragging) {
        const deltaX = ((touch.clientX - dragStart.x) / rect.width) * 100;
        const deltaY = ((touch.clientY - dragStart.y) / rect.height) * 100;

        const newX = Math.max(10, Math.min(90, dragStart.startPosX + deltaX));
        const newY = Math.max(10, Math.min(90, dragStart.startPosY + deltaY));

        onSettingsChange({
          positionX: Math.round(newX),
          positionY: Math.round(newY),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, onSettingsChange]);

  // Aspect ratio styling
  const aspectClass = {
    "9:16": "aspect-[9/16] max-h-[85vh]",
    "16:9": "aspect-[16/9] max-w-full max-h-[80vh]",
    "1:1": "aspect-square max-h-[80vh]",
    "4:5": "aspect-[4/5] max-h-[82vh]",
  }[aspectRatio];

  // Convert hex background color to rgba with opacity
  const backgroundRgba = useMemo(() => {
    let hex = settings.backgroundColor.replace("#", "");
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    const a = (settings.backgroundOpacity / 100).toFixed(2);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }, [settings.backgroundColor, settings.backgroundOpacity]);

  // Format recording timer
  const formattedRecTime = useMemo(() => {
    const mins = Math.floor(recordingSeconds / 60);
    const secs = recordingSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, [recordingSeconds]);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-3 sm:p-6 overflow-hidden bg-neutral-950 select-none">
      {/* Aspect Ratio Bounded Stage */}
      <div
        ref={containerRef}
        className={`relative ${aspectClass} w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-neutral-800/80 bg-neutral-900 flex items-center justify-center transition-all duration-300`}
      >
        {/* Hidden Canvas for Overlay Recording */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Live Camera Video */}
        {cameraActive && stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${mirrorCamera ? "-scale-x-100" : ""}`}
          />
        ) : (
          /* High-aesthetic Studio Test Pattern / Fallback Standby */
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 text-neutral-400 p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="w-16 h-16 rounded-2xl bg-neutral-800/80 border border-neutral-700/80 flex items-center justify-center mb-3 shadow-inner relative z-10">
              <CameraOff className="w-8 h-8 text-neutral-500" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1 z-10">Kamera Belum Aktif</h3>
            <p className="text-xs text-neutral-400 max-w-sm mb-4 z-10">
              {permissionError
                ? permissionError
                : "Klik tombol di bawah untuk mengizinkan akses kamera & microphone di browser kamu."}
            </p>
            <button
              onClick={onRequestPermissions}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-semibold shadow-lg shadow-rose-500/25 transition-all z-10 flex items-center gap-2"
            >
              <Video className="w-4 h-4" />
              Aktifkan Kamera & Mic
            </button>
            <span className="text-[10px] text-neutral-600 mt-4 z-10 font-mono">
              Mode Preview Teleprompter tetap dapat diuji tanpa kamera
            </span>
          </div>
        )}

        {/* Recording Overlay Indicator (When REC is running) */}
        {isRecording && (
          <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-rose-500/50 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 -ml-4.5" />
            <span className="text-xs font-bold font-mono tracking-wide text-white">REC {formattedRecTime}</span>
          </div>
        )}

        {/* Top-Right Quick Status & Camera Mirror Toggle */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          {isPlaying && (
            <div className="flex items-center gap-1.5 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-emerald-500/40 text-emerald-300 text-xs font-mono shadow-lg animate-in fade-in">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Scroll: {settings.scrollSpeed}x</span>
            </div>
          )}

          {cameraActive && onToggleMirrorCamera && (
            <button
              onClick={onToggleMirrorCamera}
              className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border transition-all flex items-center gap-1.5 shadow-lg ${
                mirrorCamera
                  ? "bg-amber-500/25 border-amber-400/50 text-amber-200"
                  : "bg-neutral-950/70 border-white/15 text-neutral-300 hover:text-white"
              }`}
              title={
                mirrorCamera
                  ? "Kamera aktif dalam mode mirror (klik untuk matikan mirror)"
                  : "Kamera normal / tidak di-mirror (hasil video asli)"
              }
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              <span>{mirrorCamera ? "Mirror: ON" : "Mirror: OFF"}</span>
            </button>
          )}
        </div>

        {/* ========================================================== */}
        {/* CUSTOMIZABLE DRAGGABLE TELEPROMPTER OVERLAY BOX            */}
        {/* ========================================================== */}
        <div
          style={{
            position: "absolute",
            left: `${settings.positionX}%`,
            top: `${settings.positionY}%`,
            width: `${settings.widthPercent}%`,
            height: `${settings.heightPercent}%`,
            transform: "translate(-50%, -50%)",
            backgroundColor: backgroundRgba,
            borderRadius: `${settings.borderRadius}px`,
            boxShadow: settings.hasShadow ? "0 20px 40px -10px rgba(0,0,0,0.6)" : "none",
            backdropFilter: settings.hasBackdropBlur ? "blur(12px)" : "none",
            WebkitBackdropFilter: settings.hasBackdropBlur ? "blur(12px)" : "none",
            border: isDragging ? "2px solid #f43f5e" : "1px solid rgba(255,255,255,0.15)",
            zIndex: 20,
          }}
          className="flex flex-col overflow-hidden transition-[border-color] duration-150 group"
        >
          {/* Teleprompter Drag Grip & Quick Bar */}
          <div
            onMouseDown={handleDragMouseDown}
            onTouchStart={handleDragTouchStart}
            className="h-8 px-3 bg-neutral-950/40 hover:bg-neutral-950/70 border-b border-white/10 flex items-center justify-between cursor-grab active:cursor-grabbing text-neutral-300 transition-colors select-none"
            title="Drag to position teleprompter anywhere"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-medium opacity-80 group-hover:opacity-100">
              <GripHorizontal className="w-4 h-4 text-neutral-400" />
              <span className="text-[10px] tracking-wider uppercase font-semibold text-neutral-300">Prompter</span>
              {isPlaying && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" title="Auto-scrolling" />
              )}
            </div>

            {/* In-prompter quick controls */}
            <div className="flex items-center gap-1" onMouseDown={(e) => e.stopPropagation()}>
              <button
                onClick={onTogglePlay}
                className="p-1 rounded hover:bg-white/20 text-white transition-colors"
                title={isPlaying ? "Pause (Space)" : "Play (Space)"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>
              <button
                onClick={handleManualReset}
                className="p-1 rounded hover:bg-white/20 text-white transition-colors"
                title="Reset scroll to top (R)"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Reading Indicator Line ("── READ HERE ──") */}
          {settings.showReadingIndicator && (
            <div
              style={{
                top: `${settings.readingIndicatorPosition}%`,
              }}
              className="absolute left-0 right-0 pointer-events-none z-10 flex items-center justify-center"
            >
              <div className="w-full h-px bg-gradient-to-r from-transparent via-rose-500/80 to-transparent" />
              <span className="absolute bg-neutral-950/80 text-rose-300 px-2 py-0.5 rounded-full text-[9px] font-mono tracking-widest uppercase border border-rose-500/40 backdrop-blur-sm shadow">
                ── EYE LEVEL ──
              </span>
            </div>
          )}

          {/* Scrolling Script Text Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            style={{
              paddingLeft: `${settings.paddingX}px`,
              paddingRight: `${settings.paddingX}px`,
              paddingTop: `${settings.paddingY + 16}px`,
              paddingBottom: `calc(60% + ${settings.paddingY}px)`,
              textAlign: settings.textAlign,
              fontFamily: settings.fontFamily,
              fontWeight: settings.fontWeight,
              lineHeight: settings.lineHeight,
              letterSpacing: `${settings.letterSpacing}px`,
              color: settings.textColor,
              transform: settings.mirrorText ? "scaleX(-1)" : "none",
            }}
            className="flex-1 overflow-y-auto overflow-x-hidden text-base selection:bg-rose-500/40 custom-scrollbar"
          >
            {sentences.length > 0 ? (
              sentences.map((block, idx) => {
                if (!block) return <div key={idx} className="h-4" />;
                if (block === "[pause]") {
                  return (
                    <div
                      key={idx}
                      className="my-3 inline-block px-2.5 py-0.5 rounded-full bg-amber-500/25 border border-amber-400/40 text-amber-300 text-xs font-mono font-medium tracking-wide"
                    >
                      [ ⏱️ PAUSE 1-2 SEC ]
                    </div>
                  );
                }

                const isCurrent = settings.highlightCurrentSentence && activeSentenceIndex === idx;

                return (
                  <p
                    key={idx}
                    data-sentence-index={idx}
                    style={{
                      fontSize: `${settings.fontSize}px`,
                    }}
                    className={`transition-colors duration-150 my-2 rounded-lg px-2 py-0.5 ${
                      isCurrent
                        ? "text-white opacity-100 bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.2)] drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]"
                        : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    {block}
                  </p>
                );
              })
            ) : (
              <div className="py-8 text-center text-neutral-400 text-sm italic">
                Belum ada script video. Ketik script di editor untuk mulai membaca.
              </div>
            )}
          </div>

          {/* Resize Corner Grip (Bottom-Right) */}
          <div
            onMouseDown={handleResizeMouseDown}
            className="absolute bottom-1 right-1 w-4 h-4 cursor-nwse-resize text-white/40 hover:text-white/90 flex items-center justify-center z-20"
            title="Drag to resize teleprompter"
          >
            <svg viewBox="0 0 6 6" className="w-2.5 h-2.5 fill-current">
              <circle cx="5" cy="5" r="0.8" />
              <circle cx="3" cy="5" r="0.8" />
              <circle cx="5" cy="3" r="0.8" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CameraView = React.memo(CameraViewComponent);
