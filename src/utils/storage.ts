import { Project, Preset } from "../types";
import { DEFAULT_TELEPROMPTER_SETTINGS, INITIAL_PROJECTS, BUILT_IN_PRESETS } from "../data/defaultPresets";

const STORAGE_KEY_PROJECTS = "promptly_projects_v1";
const STORAGE_KEY_CURRENT_ID = "promptly_current_project_id_v1";
const STORAGE_KEY_CUSTOM_PRESETS = "promptly_custom_presets_v1";

export function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (!raw) {
      saveProjects(INITIAL_PROJECTS);
      return INITIAL_PROJECTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error("Failed to load projects from storage:", e);
  }
  return INITIAL_PROJECTS;
}

export function saveProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error("Failed to save projects to storage:", e);
  }
}

export function getCurrentProjectId(fallbackId: string): string {
  try {
    const id = localStorage.getItem(STORAGE_KEY_CURRENT_ID);
    if (id) return id;
  } catch (e) {
    // ignore
  }
  return fallbackId;
}

export function setCurrentProjectId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_CURRENT_ID, id);
  } catch (e) {
    // ignore
  }
}

export function createNewProject(title = "Untitled Video"): Project {
  const newProject: Project = {
    id: `project-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title,
    script: `Halo semuanya! Tulis atau tempelkan script video kamu di sini.

[pause]

Teleprompter ini akan menggulir teks secara otomatis saat kamu merekam video. Kamu bisa mengubah posisi kotak ini dengan menggesernya langsung di atas preview kamera!`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: { ...DEFAULT_TELEPROMPTER_SETTINGS },
    takes: [],
  };
  return newProject;
}

export function duplicateProject(source: Project): Project {
  return {
    ...source,
    id: `project-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: `${source.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    takes: [], // Don't copy huge blob takes
  };
}

export function loadCustomPresets(): Preset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_PRESETS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveCustomPresets(presets: Preset[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_PRESETS, JSON.stringify(presets));
  } catch (e) {
    console.error("Failed to save custom presets:", e);
  }
}
