import React from "react";
import { Keyboard, X } from "lucide-react";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "Space", desc: "Play / Pause Teleprompter scroll" },
    { key: "↑ Up Arrow", desc: "Increase scroll speed (+0.25x)" },
    { key: "↓ Down Arrow", desc: "Decrease scroll speed (-0.25x)" },
    { key: "R", desc: "Reset script to beginning" },
    { key: "M", desc: "Toggle Mirror Text (hardware beam-splitter flip)" },
    { key: "F", desc: "Toggle Focus Mode (hide panels)" },
    { key: "Esc", desc: "Close dialogs / Cancel recording countdown" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 text-rose-400 flex items-center justify-center border border-neutral-700">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Keyboard Shortcuts</h2>
              <p className="text-xs text-neutral-400">Control teleprompter hands-free</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2 text-xs">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80"
            >
              <span className="text-neutral-300">{s.desc}</span>
              <kbd className="px-2 py-1 rounded bg-neutral-800 text-white font-mono font-semibold text-[11px] border border-neutral-700 shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
