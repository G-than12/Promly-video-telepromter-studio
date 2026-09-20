import React, { useState } from "react";
import {
  SlidersHorizontal,
  Sparkles,
  Check,
  X,
  Plus,
  Trash2,
  Tv,
  Smartphone,
  Eye,
} from "lucide-react";
import { Preset, TeleprompterSettings, AspectRatio } from "../types";
import { BUILT_IN_PRESETS } from "../data/defaultPresets";

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: TeleprompterSettings;
  currentAspectRatio: AspectRatio;
  customPresets: Preset[];
  onApplyPreset: (preset: Preset) => void;
  onSaveCustomPreset: (name: string) => void;
  onDeleteCustomPreset: (id: string) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  currentSettings,
  currentAspectRatio,
  customPresets,
  onApplyPreset,
  onSaveCustomPreset,
  onDeleteCustomPreset,
}) => {
  const [newPresetName, setNewPresetName] = useState("");
  const [showSaveForm, setShowSaveForm] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPresetName.trim()) {
      onSaveCustomPreset(newPresetName.trim());
      setNewPresetName("");
      setShowSaveForm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Teleprompter Presets</h2>
              <p className="text-xs text-neutral-400">Instantly switch between proven camera styles</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4 custom-scrollbar text-xs">
          {/* Built-in Presets */}
          <div>
            <span className="text-neutral-400 font-semibold block mb-2">Built-in Studio Presets</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {BUILT_IN_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => {
                    onApplyPreset(preset);
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-neutral-950/60 hover:bg-neutral-800/60 border border-neutral-800 hover:border-rose-500/50 cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-white group-hover:text-rose-300 transition-colors">
                        {preset.name}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300">
                        {preset.aspectRatio}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-500">
                    <span>{preset.settings?.fontSize}px • {preset.settings?.fontFamily}</span>
                    <span className="text-rose-400 font-medium group-hover:underline">Apply →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom User Presets */}
          <div className="pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 font-semibold">My Custom Presets</span>
              {!showSaveForm && (
                <button
                  onClick={() => setShowSaveForm(true)}
                  className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 font-medium"
                >
                  <Plus className="w-3 h-3" />
                  Save Current As Preset
                </button>
              )}
            </div>

            {showSaveForm && (
              <form onSubmit={handleSave} className="mb-3 p-3 bg-neutral-950 rounded-xl border border-rose-500/40 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Preset name (e.g. My TikTok Fast Setup)..."
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  autoFocus
                  className="flex-1 bg-neutral-900 border border-neutral-700 text-white rounded-lg px-2.5 py-1.5 text-xs outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-semibold"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowSaveForm(false)}
                  className="p-1.5 text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            )}

            {customPresets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {customPresets.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => {
                      onApplyPreset(preset);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-neutral-950/60 hover:bg-neutral-800/60 border border-neutral-800 hover:border-rose-500/50 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-bold text-xs text-white block">{preset.name}</span>
                      <span className="text-[10px] text-neutral-400">{preset.aspectRatio} format</span>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onDeleteCustomPreset(preset.id)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-900"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-neutral-950/40 border border-neutral-800/60 text-center text-neutral-500 text-[11px]">
                Belum ada preset custom. Atur posisi, font, dan kecepatan favorit kamu lalu klik "Save Current As Preset".
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
