import React, { useState } from "react";
import {
  Video,
  Sparkles,
  FolderKanban,
  SlidersHorizontal,
  Keyboard,
  Maximize2,
  Minimize2,
  Eye,
  FlipHorizontal,
  Check,
  Edit2,
  Plus,
} from "lucide-react";
import { Project } from "../types";

interface HeaderProps {
  currentProject: Project;
  onUpdateTitle: (newTitle: string) => void;
  saveStatus: "saving" | "saved" | "idle";
  onOpenProjects: () => void;
  onOpenAI: () => void;
  onOpenPresets: () => void;
  onOpenShortcuts: () => void;
  onNewProject: () => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  mirrorText: boolean;
  onToggleMirrorText: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  activeTab: "script" | "teleprompter" | "camera" | "history";
  setActiveTab: (tab: "script" | "teleprompter" | "camera" | "history") => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  onUpdateTitle,
  saveStatus,
  onOpenProjects,
  onOpenAI,
  onOpenPresets,
  onOpenShortcuts,
  onNewProject,
  isFocusMode,
  onToggleFocusMode,
  mirrorText,
  onToggleMirrorText,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(currentProject.title);

  const handleTitleSubmit = () => {
    if (titleInput.trim()) {
      onUpdateTitle(titleInput.trim());
    } else {
      setTitleInput(currentProject.title);
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSubmit();
    } else if (e.key === "Escape") {
      setTitleInput(currentProject.title);
      setIsEditingTitle(false);
    }
  };

  return (
    <header className="h-14 border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md px-4 flex items-center justify-between z-30 select-none">
      {/* Left: Brand & Project Name */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Video className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight text-white hidden sm:inline-block">
            Promptly<span className="text-rose-400 font-mono text-xs ml-1 px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">STUDIO</span>
          </span>
        </div>

        <div className="h-4 w-px bg-neutral-800 mx-1 hidden md:block" />

        {/* Project Title and Auto-save indicator */}
        <div className="flex items-center gap-2 min-w-0">
          {isEditingTitle ? (
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleKeyDown}
              autoFocus
              className="bg-neutral-900 text-white text-sm font-medium px-2 py-1 rounded border border-rose-500/60 outline-none w-48 sm:w-64"
            />
          ) : (
            <button
              onClick={() => {
                setTitleInput(currentProject.title);
                setIsEditingTitle(true);
              }}
              className="group flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-neutral-900 text-neutral-200 hover:text-white transition-colors text-sm font-medium truncate max-w-[140px] sm:max-w-[220px]"
              title="Click to rename project"
            >
              <span className="truncate">{currentProject.title}</span>
              <Edit2 className="w-3 h-3 text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </button>
          )}

          {/* Auto-save Status */}
          <div className="hidden lg:flex items-center gap-1 text-[11px] text-neutral-400 font-mono">
            {saveStatus === "saving" ? (
              <span className="text-amber-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                Auto-saving...
              </span>
            ) : (
              <span className="text-emerald-400/80 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Saved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Center/Right: Action Buttons & Modals */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* New Video Button */}
        <button
          onClick={onNewProject}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white text-xs font-medium border border-neutral-800 transition-colors"
          title="Create New Video Project"
        >
          <Plus className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden md:inline">New Video</span>
        </button>

        {/* Projects Manager Button */}
        <button
          onClick={onOpenProjects}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium border border-neutral-800 transition-colors"
          title="Manage Projects"
        >
          <FolderKanban className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Projects</span>
        </button>

        {/* AI Assistant Button */}
        <button
          onClick={onOpenAI}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-500/20 to-amber-500/20 hover:from-rose-500/30 hover:to-amber-500/30 text-rose-200 border border-rose-500/30 text-xs font-medium transition-all shadow-sm"
          title="AI Script Generator & Pace Analyzer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="font-semibold">AI Script</span>
        </button>

        {/* Presets Button */}
        <button
          onClick={onOpenPresets}
          className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium border border-neutral-800 transition-colors flex items-center gap-1"
          title="Style Presets (Creator, Presentation, High Contrast)"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
          <span className="hidden md:inline">Presets</span>
        </button>

        <div className="h-4 w-px bg-neutral-800 mx-0.5" />

        {/* Quick Utilities */}
        <button
          onClick={onToggleMirrorText}
          className={`p-1.5 rounded-lg text-xs font-medium border transition-colors ${
            mirrorText
              ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
              : "bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-400 hover:text-neutral-200"
          }`}
          title="Hardware Teleprompter Mirror (Flip Horizontally for Beam-Splitter Glass)"
        >
          <FlipHorizontal className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleFocusMode}
          className={`p-1.5 rounded-lg text-xs font-medium border transition-colors ${
            isFocusMode
              ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
              : "bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-400 hover:text-neutral-200"
          }`}
          title={isFocusMode ? "Exit Focus Mode" : "Focus Mode (Hide sidebars)"}
        >
          <Eye className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleFullscreen}
          className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenShortcuts}
          className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 transition-colors hidden sm:block"
          title="Keyboard Shortcuts Guide"
        >
          <Keyboard className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
