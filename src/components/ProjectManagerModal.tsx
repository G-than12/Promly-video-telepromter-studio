import React, { useState } from "react";
import {
  FolderKanban,
  Plus,
  Trash2,
  Copy,
  Edit2,
  Check,
  X,
  FileText,
  Clock,
  ExternalLink,
  Download,
  Upload,
} from "lucide-react";
import { Project } from "../types";

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  currentProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateProject: (title?: string) => void;
  onDuplicateProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onRenameProject: (id: string, newTitle: string) => void;
}

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  isOpen,
  onClose,
  projects,
  currentProjectId,
  onSelectProject,
  onCreateProject,
  onDuplicateProject,
  onDeleteProject,
  onRenameProject,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  if (!isOpen) return null;

  const handleStartRename = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(project.id);
    setEditTitle(project.title);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (editTitle.trim()) {
      onRenameProject(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 2) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "Yesterday";
      return `${diffDays}d ago`;
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Project Studio Library</h2>
              <p className="text-xs text-neutral-400">{projects.length} Saved Video Projects</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onCreateProject()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-semibold shadow transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Video</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Project List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-2.5 custom-scrollbar">
          {projects.map((project) => {
            const isCurrent = project.id === currentProjectId;
            const words = project.script ? project.script.trim().split(/\s+/).filter(Boolean).length : 0;
            const estMinutes = Math.floor((words / 150) * 60 / 60);
            const estSeconds = Math.round((words / 150) * 60 % 60);
            const estTimeStr = `${estMinutes}:${estSeconds.toString().padStart(2, "0")}`;

            return (
              <div
                key={project.id}
                onClick={() => {
                  onSelectProject(project.id);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                  isCurrent
                    ? "bg-rose-500/10 border-rose-500/50 shadow-sm"
                    : "bg-neutral-950/60 border-neutral-800/80 hover:bg-neutral-800/40 hover:border-neutral-700"
                }`}
              >
                {/* Left: Info */}
                <div className="min-w-0 flex-1">
                  {editingId === project.id ? (
                    <form
                      onSubmit={(e) => handleSaveRename(project.id, e)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 mb-1"
                    >
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        autoFocus
                        className="bg-neutral-900 border border-rose-500 text-white text-xs px-2 py-1 rounded outline-none w-full"
                      />
                      <button
                        type="submit"
                        className="p-1 rounded bg-rose-500 text-white hover:bg-rose-600"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm text-white truncate group-hover:text-rose-300 transition-colors">
                        {project.title}
                      </h3>
                      {isCurrent && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Active
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      {formatRelativeTime(project.updatedAt)}
                    </span>
                    <span>•</span>
                    <span>{words} words (~{estTimeStr})</span>
                    {project.takes && project.takes.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-400">{project.takes.length} takes recorded</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div
                  className="flex items-center gap-1 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => handleStartRename(project, e)}
                    className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
                    title="Rename"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDuplicateProject(project)}
                    className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
                    title="Duplicate project"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {projects.length > 1 && (
                    <button
                      onClick={() => onDeleteProject(project.id)}
                      className="p-1.5 rounded-lg bg-neutral-900 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400 border border-neutral-800 hover:border-rose-900/50 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
