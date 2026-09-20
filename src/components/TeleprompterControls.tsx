import React from "react";
import {
  Type,
  Move,
  Palette,
  Eye,
  Sliders,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  FlipHorizontal,
  Layers,
  Sun,
  Shield,
  Compass,
} from "lucide-react";
import { TeleprompterSettings, FontFamily, FontWeight, TextAlign } from "../types";

interface TeleprompterControlsProps {
  settings: TeleprompterSettings;
  onChange: (updated: Partial<TeleprompterSettings>) => void;
  onResetToDefaults: () => void;
}

export const TeleprompterControls: React.FC<TeleprompterControlsProps> = ({
  settings,
  onChange,
  onResetToDefaults,
}) => {
  const fontFamilies: FontFamily[] = ["Inter", "Poppins", "Roboto", "Montserrat", "Open Sans", "Arial"];
  const fontWeights: { label: string; value: FontWeight }[] = [
    { label: "Regular", value: "400" },
    { label: "Medium", value: "500" },
    { label: "Semibold", value: "600" },
    { label: "Bold", value: "700" },
  ];

  const presetColors = [
    { label: "White", value: "#ffffff" },
    { label: "Electric Yellow", value: "#facc15" },
    { label: "Neon Green", value: "#4ade80" },
    { label: "Cyan", value: "#38bdf8" },
    { label: "Coral", value: "#fb7185" },
  ];

  const presetBackgrounds = [
    { label: "OLED Black", value: "#000000" },
    { label: "Dark Slate", value: "#0f172a" },
    { label: "Charcoal", value: "#18181b" },
    { label: "Clean White", value: "#ffffff" },
  ];

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-200 overflow-y-auto p-4 space-y-6 text-xs select-none custom-scrollbar">
      {/* SECTION 1: Positioning & Size */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-semibold text-neutral-100">
            <Move className="w-3.5 h-3.5 text-rose-400" />
            <span>Position & Size</span>
          </div>
          <span className="text-[11px] text-neutral-500">Drag directly on camera preview</span>
        </div>

        {/* Quick Position Presets */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onChange({ positionX: 50, positionY: 18, widthPercent: 70 })}
            className="p-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-[11px] font-medium"
            title="Position close to camera lens for optimal eye contact"
          >
            Near Lens (Top)
          </button>
          <button
            onClick={() => onChange({ positionX: 50, positionY: 50, widthPercent: 75 })}
            className="p-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-[11px] font-medium"
          >
            Centered
          </button>
          <button
            onClick={() => onChange({ positionX: 50, positionY: 78, widthPercent: 70 })}
            className="p-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-[11px] font-medium"
          >
            Lower Third
          </button>
        </div>

        {/* Sliders for Width & Height */}
        <div className="space-y-2 bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-800/80">
          <div>
            <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
              <span>Width</span>
              <span className="text-white font-mono">{settings.widthPercent}%</span>
            </div>
            <input
              type="range"
              min={25}
              max={98}
              value={settings.widthPercent}
              onChange={(e) => onChange({ widthPercent: Number(e.target.value) })}
              className="w-full accent-rose-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
              <span>Height</span>
              <span className="text-white font-mono">{settings.heightPercent}%</span>
            </div>
            <input
              type="range"
              min={15}
              max={85}
              value={settings.heightPercent}
              onChange={(e) => onChange({ heightPercent: Number(e.target.value) })}
              className="w-full accent-rose-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Typography */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 font-semibold text-neutral-100">
          <Type className="w-3.5 h-3.5 text-amber-400" />
          <span>Typography & Text</span>
        </div>

        {/* Font Family Selector */}
        <div>
          <label className="text-[11px] text-neutral-400 mb-1 block">Font Family</label>
          <div className="grid grid-cols-3 gap-1">
            {fontFamilies.map((font) => (
              <button
                key={font}
                onClick={() => onChange({ fontFamily: font })}
                style={{ fontFamily: font }}
                className={`py-1.5 px-2 rounded text-xs border text-center transition-colors truncate ${
                  settings.fontFamily === font
                    ? "bg-rose-500/20 border-rose-500 text-rose-300 font-medium"
                    : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                }`}
              >
                {font}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size Slider */}
        <div className="bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-800/80 space-y-2">
          <div>
            <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
              <span>Text Size</span>
              <span className="text-white font-mono">{settings.fontSize}px</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-500">A</span>
              <input
                type="range"
                min={16}
                max={72}
                value={settings.fontSize}
                onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
                className="w-full accent-rose-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              />
              <span className="text-sm font-bold text-neutral-400">A</span>
            </div>
          </div>

          {/* Weight & Alignment */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-800">
            <div>
              <label className="text-[10px] text-neutral-400 mb-1 block">Weight</label>
              <select
                value={settings.fontWeight}
                onChange={(e) => onChange({ fontWeight: e.target.value as FontWeight })}
                className="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 rounded px-2 py-1 text-xs outline-none"
              >
                {fontWeights.map((w) => (
                  <option key={w.value} value={w.value}>
                    {w.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 mb-1 block">Alignment</label>
              <div className="flex rounded bg-neutral-800 p-0.5 border border-neutral-700">
                {(["left", "center", "right"] as TextAlign[]).map((align) => (
                  <button
                    key={align}
                    onClick={() => onChange({ textAlign: align })}
                    className={`flex-1 py-0.5 flex items-center justify-center rounded ${
                      settings.textAlign === align ? "bg-rose-500 text-white" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {align === "left" && <AlignLeft className="w-3 h-3" />}
                    {align === "center" && <AlignCenter className="w-3 h-3" />}
                    {align === "right" && <AlignRight className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Line Height & Letter Spacing */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                <span>Line Spacing</span>
                <span className="text-white font-mono">{settings.lineHeight}x</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={2.2}
                step={0.1}
                value={settings.lineHeight}
                onChange={(e) => onChange({ lineHeight: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              />
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                <span>Letter Space</span>
                <span className="text-white font-mono">{settings.letterSpacing}px</span>
              </div>
              <input
                type="range"
                min={-1}
                max={4}
                step={0.5}
                value={settings.letterSpacing}
                onChange={(e) => onChange({ letterSpacing: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Appearance & Colors */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 font-semibold text-neutral-100">
          <Palette className="w-3.5 h-3.5 text-sky-400" />
          <span>Colors & Background</span>
        </div>

        {/* Text Color */}
        <div>
          <label className="text-[11px] text-neutral-400 mb-1.5 block">Text Color</label>
          <div className="flex items-center gap-2 flex-wrap">
            {presetColors.map((color) => (
              <button
                key={color.value}
                onClick={() => onChange({ textColor: color.value })}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${
                  settings.textColor.toLowerCase() === color.value.toLowerCase()
                    ? "border-rose-500 scale-110 shadow"
                    : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.label}
              />
            ))}
            <label className="w-7 h-7 rounded-full border border-neutral-700 bg-gradient-to-tr from-pink-500 via-amber-400 to-sky-400 cursor-pointer flex items-center justify-center relative overflow-hidden" title="Custom color picker">
              <input
                type="color"
                value={settings.textColor}
                onChange={(e) => onChange({ textColor: e.target.value })}
                className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
              />
            </label>
          </div>
        </div>

        {/* Background Color & Opacity */}
        <div className="bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-800/80 space-y-3">
          <div>
            <label className="text-[11px] text-neutral-400 mb-1.5 block">Box Background</label>
            <div className="flex items-center gap-2 flex-wrap">
              {presetBackgrounds.map((bg) => (
                <button
                  key={bg.value}
                  onClick={() => onChange({ backgroundColor: bg.value })}
                  className={`px-2.5 py-1 rounded text-[11px] border transition-colors ${
                    settings.backgroundColor.toLowerCase() === bg.value.toLowerCase()
                      ? "border-rose-500 text-rose-300 font-medium bg-neutral-800"
                      : "border-neutral-700 text-neutral-300 bg-neutral-900 hover:border-neutral-600"
                  }`}
                >
                  {bg.label}
                </button>
              ))}
              <label className="px-2 py-1 rounded text-[11px] border border-neutral-700 bg-neutral-800 text-neutral-300 cursor-pointer relative">
                <span>Custom</span>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => onChange({ backgroundColor: e.target.value })}
                  className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                />
              </label>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
              <span>Background Opacity</span>
              <span className="text-white font-mono">{settings.backgroundOpacity}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={settings.backgroundOpacity}
              onChange={(e) => onChange({ backgroundOpacity: Number(e.target.value) })}
              className="w-full accent-rose-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-800">
            <div>
              <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                <span>Corner Radius</span>
                <span className="text-white font-mono">{settings.borderRadius}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={32}
                value={settings.borderRadius}
                onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
                className="w-full accent-neutral-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              />
            </div>

            <div className="flex flex-col justify-end space-y-1">
              <label className="flex items-center gap-1.5 text-[11px] text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.hasBackdropBlur}
                  onChange={(e) => onChange({ hasBackdropBlur: e.target.checked })}
                  className="rounded accent-rose-500"
                />
                <span>Glassmorphism Blur</span>
              </label>
              <label className="flex items-center gap-1.5 text-[11px] text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.hasShadow}
                  onChange={(e) => onChange({ hasShadow: e.target.checked })}
                  className="rounded accent-rose-500"
                />
                <span>Drop Shadow</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Smart Prompter Features */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 font-semibold text-neutral-100">
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          <span>Smart Prompter & Eye Contact</span>
        </div>

        <div className="space-y-2 bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-800/80">
          {/* Active Sentence Highlight */}
          <label className="flex items-center justify-between text-neutral-300 cursor-pointer">
            <div>
              <span className="font-medium text-white block">Sentence Highlight</span>
              <span className="text-[10px] text-neutral-500">Highlights the active line as you speak</span>
            </div>
            <input
              type="checkbox"
              checked={settings.highlightCurrentSentence}
              onChange={(e) => onChange({ highlightCurrentSentence: e.target.checked })}
              className="rounded accent-rose-500 w-4 h-4"
            />
          </label>

          <div className="border-t border-neutral-800 pt-2" />

          {/* Reading Indicator Line */}
          <label className="flex items-center justify-between text-neutral-300 cursor-pointer">
            <div>
              <span className="font-medium text-white block">Reading Guide Line</span>
              <span className="text-[10px] text-neutral-500">Horizontal indicator marking eye-contact zone</span>
            </div>
            <input
              type="checkbox"
              checked={settings.showReadingIndicator}
              onChange={(e) => onChange({ showReadingIndicator: e.target.checked })}
              className="rounded accent-rose-500 w-4 h-4"
            />
          </label>

          {settings.showReadingIndicator && (
            <div className="pt-2">
              <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                <span>Guide Line Position</span>
                <span className="text-white font-mono">{settings.readingIndicatorPosition}% from top</span>
              </div>
              <input
                type="range"
                min={15}
                max={85}
                value={settings.readingIndicatorPosition}
                onChange={(e) => onChange({ readingIndicatorPosition: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              />
            </div>
          )}

          <div className="border-t border-neutral-800 pt-2" />

          {/* Mirror Text */}
          <label className="flex items-center justify-between text-neutral-300 cursor-pointer">
            <div>
              <span className="font-medium text-white block">Mirror Text (Horizontal)</span>
              <span className="text-[10px] text-neutral-500">Flips text horizontally for glass teleprompter hardware</span>
            </div>
            <input
              type="checkbox"
              checked={settings.mirrorText}
              onChange={(e) => onChange({ mirrorText: e.target.checked })}
              className="rounded accent-rose-500 w-4 h-4"
            />
          </label>
        </div>
      </div>

      {/* Reset to Defaults */}
      <div className="pt-2">
        <button
          onClick={onResetToDefaults}
          className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 rounded-lg text-xs font-medium transition-colors"
        >
          Reset Teleprompter to Defaults
        </button>
      </div>
    </div>
  );
};
