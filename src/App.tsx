import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FileText,
  Sliders,
  Camera,
  History,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
  Video,
  Download,
  Trash2,
  Clock,
  HardDrive,
  Play,
  AlertTriangle,
  X,
} from "lucide-react";
import {
  Project,
  TeleprompterSettings,
  AspectRatio,
  RecordingMode,
  RecordingTake,
  Preset,
} from "./types";
import {
  loadProjects,
  saveProjects,
  getCurrentProjectId,
  setCurrentProjectId,
  createNewProject,
  duplicateProject,
  loadCustomPresets,
  saveCustomPresets,
} from "./utils/storage";
import { setupAudioMeter, AudioMeterInstance } from "./utils/audio";
import { DEFAULT_TELEPROMPTER_SETTINGS } from "./data/defaultPresets";

import { Header } from "./components/Header";
import { ScriptEditor } from "./components/ScriptEditor";
import { TeleprompterControls } from "./components/TeleprompterControls";
import { CameraControls } from "./components/CameraControls";
import { CameraView } from "./components/CameraView";
import { RecordingBar } from "./components/RecordingBar";
import { CountdownOverlay } from "./components/CountdownOverlay";
import { VideoPreviewModal } from "./components/VideoPreviewModal";
import { ProjectManagerModal } from "./components/ProjectManagerModal";
import { AIAssistantModal } from "./components/AIAssistantModal";
import { PresetsModal } from "./components/PresetsModal";
import { ShortcutsModal } from "./components/ShortcutsModal";

export default function App() {
  // Projects State
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [currentProjectId, setCurProjectId] = useState<string>(() =>
    getCurrentProjectId(projects[0]?.id || "default")
  );

  const currentProject = projects.find((p) => p.id === currentProjectId) || projects[0];

  // Auto-save Status
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved" | "idle">("saved");

  // Teleprompter Settings & Script (synced to current project)
  const [settings, setSettings] = useState<TeleprompterSettings>(
    () => currentProject?.settings || DEFAULT_TELEPROMPTER_SETTINGS
  );
  const [script, setScript] = useState<string>(() => currentProject?.script || "");

  // Speaking Pace (WPM)
  const [speakingWpm, setSpeakingWpm] = useState<number>(150);

  // Playback & Scrolling
  const [isPlayingPrompter, setIsPlayingPrompter] = useState<boolean>(false);

  // Active Sidebar Tab
  const [activeTab, setActiveTab] = useState<"script" | "teleprompter" | "camera" | "history">("script");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Camera & Audio State
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [micActive, setMicActive] = useState<boolean>(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [selectedMicId, setSelectedMicId] = useState<string>("");
  const [mirrorCamera, setMirrorCamera] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [resolution, setResolution] = useState<"720p" | "1080p">("1080p");
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const audioMeterRef = useRef<AudioMeterInstance | null>(null);

  // Scroll reset trigger
  const [resetScrollTrigger, setResetScrollTrigger] = useState<number>(0);

  const handleResetPrompter = useCallback(() => {
    setIsPlayingPrompter(false);
    setResetScrollTrigger((prev) => prev + 1);
  }, []);

  // Recording State
  const [recordingMode, setRecordingMode] = useState<RecordingMode>("clean");
  const [countdownSeconds, setCountdownSeconds] = useState<number>(3);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPausedRecording, setIsPausedRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Post-recording Take Preview
  const [activePreviewTake, setActivePreviewTake] = useState<RecordingTake | null>(null);

  // Resilient stream & state refs to avoid closure and re-render issues
  const streamRef = useRef<MediaStream | null>(null);
  const currentProjectIdRef = useRef<string>(currentProjectId);
  const recordingSecondsRef = useRef<number>(0);
  const fallbackCleanupRef = useRef<(() => void) | null>(null);
  const prompterDelayTimerRef = useRef<any>(null);
  const [recordingError, setRecordingError] = useState<string | null>(null);

  useEffect(() => {
    streamRef.current = stream;
  }, [stream]);

  useEffect(() => {
    currentProjectIdRef.current = currentProjectId;
  }, [currentProjectId]);

  // Modals
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState<boolean>(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);
  const [customPresets, setCustomPresets] = useState<Preset[]>(() => loadCustomPresets());

  // Switch project handler
  const handleSelectProject = (id: string) => {
    const proj = projects.find((p) => p.id === id);
    if (proj) {
      setCurProjectId(id);
      setCurrentProjectId(id);
      setScript(proj.script);
      setSettings(proj.settings);
      handleResetPrompter();
    }
  };

  // Sync state when project changes
  useEffect(() => {
    if (currentProject) {
      setScript(currentProject.script);
      setSettings(currentProject.settings);
    }
  }, [currentProjectId]);

  // Debounced auto-save to localStorage
  useEffect(() => {
    setSaveStatus("saving");
    const timeout = setTimeout(() => {
      setProjects((prev) => {
        const updated = prev.map((p) => {
          if (p.id === currentProjectId) {
            return {
              ...p,
              script,
              settings,
              updatedAt: new Date().toISOString(),
            };
          }
          return p;
        });
        saveProjects(updated);
        return updated;
      });
      setSaveStatus("saved");
    }, 600);

    return () => clearTimeout(timeout);
  }, [script, settings, currentProjectId]);

  // Request Camera and Microphone Stream
  const initMediaStream = useCallback(async () => {
    try {
      setPermissionError(null);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (audioMeterRef.current) {
        audioMeterRef.current.cleanup();
      }

      const constraints: MediaStreamConstraints = {
        video: selectedCameraId
          ? { deviceId: { exact: selectedCameraId } }
          : {
              width: resolution === "1080p" ? { ideal: 1920 } : { ideal: 1280 },
              height: resolution === "1080p" ? { ideal: 1080 } : { ideal: 720 },
            },
        audio: selectedMicId ? { deviceId: { exact: selectedMicId } } : true,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      setCameraActive(newStream.getVideoTracks().length > 0);
      setMicActive(newStream.getAudioTracks().length > 0);

      // Setup audio analyzer
      const meter = setupAudioMeter(newStream);
      audioMeterRef.current = meter;
    } catch (err: any) {
      console.warn("Media stream init error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setPermissionError("Camera or Microphone permission was denied. Please allow camera access in browser permissions.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setPermissionError("No camera or microphone hardware found on this device.");
      } else {
        setPermissionError(err.message || "Failed to start camera preview.");
      }
      setCameraActive(false);
      setMicActive(false);
    }
  }, [selectedCameraId, selectedMicId, resolution]);

  // Mount media stream on first load
  useEffect(() => {
    initMediaStream();
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (audioMeterRef.current) {
        audioMeterRef.current.cleanup();
      }
    };
  }, []);

  // Poll audio level for VU meter (throttled to ~8fps to prevent unnecessary App re-renders)
  useEffect(() => {
    let animId: number;
    let lastTime = 0;
    const updateLevel = (time: number) => {
      if (audioMeterRef.current && time - lastTime > 120) {
        lastTime = time;
        const lvl = audioMeterRef.current.getLevel();
        setAudioLevel((prev) => (Math.abs(prev - lvl) > 0.05 || (lvl === 0 && prev !== 0) ? lvl : prev));
      }
      animId = requestAnimationFrame(updateLevel);
    };
    animId = requestAnimationFrame(updateLevel);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Keyboard Shortcuts Listener (Space, R, Up, Down, M, F, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        setIsPlayingPrompter((prev) => !prev);
      } else if (e.code === "ArrowUp") {
        e.preventDefault();
        setSettings((prev) => ({
          ...prev,
          scrollSpeed: Math.min(3.0, parseFloat((prev.scrollSpeed + 0.25).toFixed(2))),
        }));
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        setSettings((prev) => ({
          ...prev,
          scrollSpeed: Math.max(0.25, parseFloat((prev.scrollSpeed - 0.25).toFixed(2))),
        }));
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        handleResetPrompter();
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        setSettings((prev) => ({ ...prev, mirrorText: !prev.mirrorText }));
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        setIsFocusMode((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsCountingDown(false);
        setIsProjectsModalOpen(false);
        setIsAIModalOpen(false);
        setIsPresetsModalOpen(false);
        setIsShortcutsModalOpen(false);
        setActivePreviewTake(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleResetPrompter]);

  // Fallback simulated stream when webcam is not available or blocked
  const createFallbackStream = useCallback((): { stream: MediaStream; cleanup: () => void } => {
    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext("2d");

    let frameCount = 0;
    const draw = () => {
      if (!ctx) return;
      frameCount++;
      const grad = ctx.createLinearGradient(0, 0, 1280, 720);
      grad.addColorStop(0, "#09090b");
      grad.addColorStop(1, "#18181b");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1280, 720);

      ctx.fillStyle = "#f43f5e";
      ctx.font = "bold 40px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("PROMPTLY TELEPROMPTER STUDIO", 640, 320);

      ctx.fillStyle = "#a1a1aa";
      ctx.font = "20px sans-serif";
      ctx.fillText("Recorded in Studio Canvas Mode", 640, 370);

      const pulseAlpha = 0.5 + 0.5 * Math.sin(frameCount * 0.15);
      ctx.fillStyle = `rgba(244, 63, 94, ${pulseAlpha})`;
      ctx.beginPath();
      ctx.arc(580, 420, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#f43f5e";
      ctx.font = "18px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`REC ${new Date().toLocaleTimeString()}`, 600, 426);
    };

    draw();
    const fallbackStream = canvas.captureStream(30);
    const interval = setInterval(draw, 100);

    let audioCleanup = () => {};
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const actx = new AudioContextClass();
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        gain.gain.value = 0.0001;
        osc.connect(gain);
        const dest = actx.createMediaStreamDestination();
        gain.connect(dest);
        osc.start();
        const track = dest.stream.getAudioTracks()[0];
        if (track) {
          fallbackStream.addTrack(track);
        }
        audioCleanup = () => {
          try {
            osc.stop();
            actx.close();
          } catch (e) {}
        };
      }
    } catch (e) {}

    const cleanup = () => {
      clearInterval(interval);
      audioCleanup();
    };

    return { stream: fallbackStream, cleanup };
  }, []);

  // START RECORDING FLOW
  const handleStartRecording = async () => {
    setRecordingError(null);

    // If stream is not active or lacks live video, attempt initialization
    if (!streamRef.current || streamRef.current.getTracks().every((t) => t.readyState !== "live")) {
      try {
        await initMediaStream();
      } catch (e) {
        console.warn("Camera init attempt skipped:", e);
      }
    }

    if (countdownSeconds > 0) {
      setIsCountingDown(true);
    } else {
      beginActualRecording();
    }
  };

  const beginActualRecording = useCallback(() => {
    setIsCountingDown(false);
    setRecordingError(null);
    recordedChunksRef.current = [];
    recordingSecondsRef.current = 0;
    setRecordingSeconds(0);

    // Reset prompter to start position instantaneously
    setResetScrollTrigger((prev) => prev + 1);

    if (prompterDelayTimerRef.current) {
      clearTimeout(prompterDelayTimerRef.current);
      prompterDelayTimerRef.current = null;
    }

    try {
      if (typeof MediaRecorder === "undefined") {
        setRecordingError(
          "Browser ini tidak mendukung MediaRecorder. Silakan gunakan browser Chrome, Firefox, Edge, atau Safari versi terbaru."
        );
        setIsRecording(false);
        return;
      }

      let activeStream: MediaStream;
      if (
        streamRef.current &&
        streamRef.current.getTracks().some((t) => t.readyState === "live")
      ) {
        activeStream = streamRef.current;
      } else {
        const fallback = createFallbackStream();
        activeStream = fallback.stream;
        fallbackCleanupRef.current = fallback.cleanup;
      }

      // Determine best supported MIME type across all browsers (including Safari/iOS)
      const hasAudio = activeStream.getAudioTracks().length > 0;
      const audioCodec = hasAudio ? ",opus" : "";
      const candidateTypes = [
        `video/webm;codecs=vp9${audioCodec}`,
        `video/webm;codecs=vp8${audioCodec}`,
        `video/webm;codecs=h264${audioCodec}`,
        "video/webm",
        "video/mp4;codecs=avc1,mp4a.40.2",
        "video/mp4",
      ];

      let chosenMime: string | undefined;
      for (const t of candidateTypes) {
        if (MediaRecorder.isTypeSupported(t)) {
          chosenMime = t;
          break;
        }
      }

      const recorderOptions: MediaRecorderOptions = chosenMime ? { mimeType: chosenMime } : {};
      const recorder = new MediaRecorder(activeStream, recorderOptions);

      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onerror = (e: any) => {
        console.error("MediaRecorder error event:", e);
        setRecordingError("Perekaman mengalami kendala teknis.");
        handleStopRecording();
      };

      recorder.onstop = () => {
        if (prompterDelayTimerRef.current) {
          clearTimeout(prompterDelayTimerRef.current);
          prompterDelayTimerRef.current = null;
        }

        if (fallbackCleanupRef.current) {
          fallbackCleanupRef.current();
          fallbackCleanupRef.current = null;
        }

        const mime = recorder.mimeType || chosenMime || "video/webm";
        const blob = new Blob(recordedChunksRef.current, { type: mime });
        const blobUrl = URL.createObjectURL(blob);

        const duration = recordingSecondsRef.current;
        const newTake: RecordingTake = {
          id: `take-${Date.now()}`,
          projectId: currentProjectIdRef.current,
          blobUrl,
          durationSeconds: duration,
          recordedAt: new Date().toISOString(),
          sizeBytes: blob.size,
          aspectRatio,
          mode: recordingMode,
          resolution,
        };

        // Save take to current project
        setProjects((prev) =>
          prev.map((p) => {
            if (p.id === currentProjectIdRef.current) {
              return {
                ...p,
                takes: [newTake, ...(p.takes || [])],
              };
            }
            return p;
          })
        );

        setActivePreviewTake(newTake);
        setIsRecording(false);
        setIsPausedRecording(false);
        setIsPlayingPrompter(false);
        setRecordingSeconds(0);
        recordingSecondsRef.current = 0;
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setIsPausedRecording(false);

      // Start duration timer using ref to guarantee accurate seconds
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = setInterval(() => {
        recordingSecondsRef.current += 1;
        setRecordingSeconds(recordingSecondsRef.current);
      }, 1000);

      // Brief 250ms pre-roll: allows the hardware video encoder context to initialize
      // and establish smooth keyframes before prompter auto-scrolling starts.
      // This completely eliminates the initial stutter/freeze ("nyandet")!
      prompterDelayTimerRef.current = setTimeout(() => {
        setIsPlayingPrompter(true);
      }, 250);
    } catch (err: any) {
      console.error("Recording start error:", err);
      setRecordingError(err?.message || "Gagal memulai perekam video. Periksa izin kamera browser.");
      setIsRecording(false);
      setIsPlayingPrompter(false);
      if (prompterDelayTimerRef.current) {
        clearTimeout(prompterDelayTimerRef.current);
        prompterDelayTimerRef.current = null;
      }
      if (fallbackCleanupRef.current) {
        fallbackCleanupRef.current();
        fallbackCleanupRef.current = null;
      }
    }
  }, [aspectRatio, recordingMode, resolution, createFallbackStream]);

  const handlePauseRecording = () => {
    if (prompterDelayTimerRef.current) {
      clearTimeout(prompterDelayTimerRef.current);
      prompterDelayTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPausedRecording(true);
      setIsPlayingPrompter(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  const handleResumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPausedRecording(false);
      setIsPlayingPrompter(true);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = setInterval(() => {
        recordingSecondsRef.current += 1;
        setRecordingSeconds(recordingSecondsRef.current);
      }, 1000);
    }
  };

  const handleStopRecording = () => {
    if (prompterDelayTimerRef.current) {
      clearTimeout(prompterDelayTimerRef.current);
      prompterDelayTimerRef.current = null;
    }
    setIsPlayingPrompter(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn("Stop mediaRecorder error:", e);
      }
    }
  };

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Preset Handlers
  const handleApplyPreset = (preset: Preset) => {
    if (preset.aspectRatio) {
      setAspectRatio(preset.aspectRatio);
    }
    setSettings((prev) => ({
      ...prev,
      ...preset.settings,
    }));
  };

  const handleSaveCustomPreset = (name: string) => {
    const newPreset: Preset = {
      id: `custom-preset-${Date.now()}`,
      name,
      description: `Custom ${aspectRatio} setup with ${settings.fontSize}px text`,
      aspectRatio,
      settings: { ...settings },
    };
    const updated = [...customPresets, newPreset];
    setCustomPresets(updated);
    saveCustomPresets(updated);
  };

  const handleDeleteCustomPreset = (id: string) => {
    const updated = customPresets.filter((p) => p.id !== id);
    setCustomPresets(updated);
    saveCustomPresets(updated);
  };

  // Project Management Handlers
  const handleCreateNewProject = (title = "New Video Project") => {
    const newProj = createNewProject(title);
    const updated = [newProj, ...projects];
    setProjects(updated);
    saveProjects(updated);
    handleSelectProject(newProj.id);
    setIsProjectsModalOpen(false);
  };

  const handleDuplicateProject = (source: Project) => {
    const duplicated = duplicateProject(source);
    const updated = [duplicated, ...projects];
    setProjects(updated);
    saveProjects(updated);
    handleSelectProject(duplicated.id);
  };

  const handleDeleteProject = (id: string) => {
    if (projects.length <= 1) return;
    const remaining = projects.filter((p) => p.id !== id);
    setProjects(remaining);
    saveProjects(remaining);
    if (currentProjectId === id) {
      handleSelectProject(remaining[0].id);
    }
  };

  const handleRenameProject = (id: string, newTitle: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, title: newTitle, updatedAt: new Date().toISOString() } : p))
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100 font-sans">
      {/* 1. STUDIO HEADER */}
      <Header
        currentProject={currentProject}
        onUpdateTitle={(title) => handleRenameProject(currentProjectId, title)}
        saveStatus={saveStatus}
        onOpenProjects={() => setIsProjectsModalOpen(true)}
        onOpenAI={() => setIsAIModalOpen(true)}
        onOpenPresets={() => setIsPresetsModalOpen(true)}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
        onNewProject={() => handleCreateNewProject()}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => setIsFocusMode((prev) => !prev)}
        mirrorText={settings.mirrorText}
        onToggleMirrorText={() => setSettings((prev) => ({ ...prev, mirrorText: !prev.mirrorText }))}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT STUDIO SIDEBAR (Hidden in Focus Mode) */}
        {!isFocusMode && (
          <div
            className={`${
              isSidebarOpen ? "w-80 sm:w-96" : "w-12"
            } border-r border-neutral-800/80 bg-neutral-950 flex flex-col flex-shrink-0 transition-all duration-200 z-20`}
          >
            {/* Sidebar Navigation Tabs */}
            <div className="h-11 border-b border-neutral-800 bg-neutral-900/40 flex items-center justify-between px-1 text-xs">
              {isSidebarOpen ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveTab("script")}
                    className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors ${
                      activeTab === "script"
                        ? "bg-neutral-800 text-white shadow-sm"
                        : "text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-rose-400" />
                    <span>Script</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("teleprompter")}
                    className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors ${
                      activeTab === "teleprompter"
                        ? "bg-neutral-800 text-white shadow-sm"
                        : "text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span>Prompter</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("camera")}
                    className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors ${
                      activeTab === "camera"
                        ? "bg-neutral-800 text-white shadow-sm"
                        : "text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5 text-sky-400" />
                    <span>Camera</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("history")}
                    className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors ${
                      activeTab === "history"
                        ? "bg-neutral-800 text-white shadow-sm"
                        : "text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    <History className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Takes</span>
                  </button>
                </div>
              ) : (
                <div className="w-full flex justify-center">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-1 rounded text-neutral-400 hover:text-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  title="Collapse sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sidebar Tab Content */}
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                {activeTab === "script" && (
                  <ScriptEditor
                    script={script}
                    onScriptChange={setScript}
                    onOpenAI={() => setIsAIModalOpen(true)}
                    speakingWpm={speakingWpm}
                    setSpeakingWpm={setSpeakingWpm}
                  />
                )}

                {activeTab === "teleprompter" && (
                  <TeleprompterControls
                    settings={settings}
                    onChange={(updated) => setSettings((prev) => ({ ...prev, ...updated }))}
                    onResetToDefaults={() => setSettings(DEFAULT_TELEPROMPTER_SETTINGS)}
                  />
                )}

                {activeTab === "camera" && (
                  <CameraControls
                    aspectRatio={aspectRatio}
                    onAspectRatioChange={setAspectRatio}
                    recordingMode={recordingMode}
                    onRecordingModeChange={setRecordingMode}
                    mirrorCamera={mirrorCamera}
                    onMirrorCameraChange={setMirrorCamera}
                    resolution={resolution}
                    onResolutionChange={(res) => {
                      setResolution(res);
                      initMediaStream();
                    }}
                    countdownSeconds={countdownSeconds}
                    onCountdownChange={setCountdownSeconds}
                    selectedCameraId={selectedCameraId}
                    onSelectCamera={(id) => {
                      setSelectedCameraId(id);
                      initMediaStream();
                    }}
                    selectedMicId={selectedMicId}
                    onSelectMic={(id) => {
                      setSelectedMicId(id);
                      initMediaStream();
                    }}
                    audioLevel={audioLevel}
                    cameraActive={cameraActive}
                    micActive={micActive}
                    onRequestPermissions={initMediaStream}
                    permissionError={permissionError}
                  />
                )}

                {activeTab === "history" && (
                  <div className="p-4 flex flex-col h-full overflow-y-auto space-y-3 custom-scrollbar text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">Recorded Takes</span>
                      <span className="text-neutral-400">{currentProject.takes?.length || 0} takes</span>
                    </div>

                    {currentProject.takes && currentProject.takes.length > 0 ? (
                      currentProject.takes.map((take) => (
                        <div
                          key={take.id}
                          className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-white flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-amber-400" />
                              {Math.floor(take.durationSeconds / 60)}:
                              {(take.durationSeconds % 60).toString().padStart(2, "0")}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-mono">
                              {new Date(take.recordedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-neutral-400">
                            <span>{take.aspectRatio} • {take.resolution}</span>
                            <span>{((take.sizeBytes || 0) / (1024 * 1024)).toFixed(1)} MB</span>
                          </div>

                          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                            <button
                              onClick={() => setActivePreviewTake(take)}
                              className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1 text-[11px] font-medium"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Preview</span>
                            </button>

                            <button
                              onClick={() => {
                                const a = document.createElement("a");
                                a.href = take.blobUrl;
                                a.download = `take-${take.id}.webm`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                              }}
                              className="p-1.5 rounded text-neutral-400 hover:text-white"
                              title="Download take"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center text-neutral-500">
                        Belum ada take video yang direkam untuk project ini. Tekan "Start Recording" di bawah.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CENTER STAGE: CAMERA VIEWPORT & INTERACTIVE PROMPTER */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-950 relative">
          {recordingError && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-rose-950/95 border border-rose-500/80 text-rose-200 px-4 py-2.5 rounded-xl text-xs flex items-center gap-3 shadow-2xl backdrop-blur-md max-w-md animate-in fade-in duration-200">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="flex-1 font-medium">{recordingError}</span>
              <button
                onClick={() => setRecordingError(null)}
                className="p-1 rounded-lg hover:bg-rose-900/50 text-rose-300 hover:text-white transition-colors"
                title="Tutup"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <CameraView
            stream={stream}
            cameraActive={cameraActive}
            permissionError={permissionError}
            onRequestPermissions={initMediaStream}
            aspectRatio={aspectRatio}
            mirrorCamera={mirrorCamera}
            onToggleMirrorCamera={() => setMirrorCamera((prev) => !prev)}
            settings={settings}
            onSettingsChange={(updated) => setSettings((prev) => ({ ...prev, ...updated }))}
            script={script}
            isPlaying={isPlayingPrompter}
            onTogglePlay={() => setIsPlayingPrompter((prev) => !prev)}
            onResetScroll={handleResetPrompter}
            resetScrollTrigger={resetScrollTrigger}
            isRecording={isRecording}
            recordingSeconds={recordingSeconds}
            canvasRef={canvasRef}
          />
        </div>
      </div>

      {/* 3. RECORDING & CONTROLS BOTTOM BAR */}
      <RecordingBar
        isPlaying={isPlayingPrompter}
        onTogglePlay={() => setIsPlayingPrompter((prev) => !prev)}
        onResetScroll={handleResetPrompter}
        scrollSpeed={settings.scrollSpeed}
        onSpeedChange={(speed) => setSettings((prev) => ({ ...prev, scrollSpeed: speed }))}
        isAutoScroll={settings.isAutoScroll}
        onToggleAutoScroll={() => setSettings((prev) => ({ ...prev, isAutoScroll: !prev.isAutoScroll }))}
        isRecording={isRecording}
        isPausedRecording={isPausedRecording}
        recordingSeconds={recordingSeconds}
        onStartRecording={handleStartRecording}
        onPauseRecording={handlePauseRecording}
        onResumeRecording={handleResumeRecording}
        onStopRecording={handleStopRecording}
        cameraActive={cameraActive}
        micActive={micActive}
        audioLevel={audioLevel}
      />

      {/* 4. MODALS & OVERLAYS */}
      {/* 3-2-1 Countdown Overlay */}
      {isCountingDown && (
        <CountdownOverlay
          initialCount={countdownSeconds}
          onComplete={beginActualRecording}
          onCancel={() => {
            if (prompterDelayTimerRef.current) {
              clearTimeout(prompterDelayTimerRef.current);
              prompterDelayTimerRef.current = null;
            }
            setIsCountingDown(false);
          }}
        />
      )}

      {/* Post-recording Preview Modal */}
      {activePreviewTake && (
        <VideoPreviewModal
          take={activePreviewTake}
          onClose={() => setActivePreviewTake(null)}
          onRecordAgain={() => {
            setActivePreviewTake(null);
            handleStartRecording();
          }}
          projectTitle={currentProject.title}
        />
      )}

      {/* Project Library Modal */}
      <ProjectManagerModal
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
        projects={projects}
        currentProjectId={currentProjectId}
        onSelectProject={handleSelectProject}
        onCreateProject={handleCreateNewProject}
        onDuplicateProject={handleDuplicateProject}
        onDeleteProject={handleDeleteProject}
        onRenameProject={handleRenameProject}
      />

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        currentScript={script}
        onApplyScript={(newScript) => setScript(newScript)}
      />

      {/* Presets Modal */}
      <PresetsModal
        isOpen={isPresetsModalOpen}
        onClose={() => setIsPresetsModalOpen(false)}
        currentSettings={settings}
        currentAspectRatio={aspectRatio}
        customPresets={customPresets}
        onApplyPreset={handleApplyPreset}
        onSaveCustomPreset={handleSaveCustomPreset}
        onDeleteCustomPreset={handleDeleteCustomPreset}
      />

      {/* Shortcuts Cheat Sheet Modal */}
      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </div>
  );
}
