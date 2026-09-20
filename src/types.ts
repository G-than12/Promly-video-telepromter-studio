export type AspectRatio = "9:16" | "16:9" | "1:1" | "4:5";

export type RecordingMode = "clean" | "overlay";

export type FontFamily = "Inter" | "Poppins" | "Roboto" | "Montserrat" | "Open Sans" | "Arial";

export type FontWeight = "400" | "500" | "600" | "700";

export type TextAlign = "left" | "center" | "right";

export interface TeleprompterSettings {
  // Positioning & Size
  positionX: number; // percentage 0-100
  positionY: number; // percentage 0-100
  widthPercent: number; // percentage 20-100
  heightPercent: number; // percentage 15-90
  
  // Typography
  fontSize: number; // in px (16 to 72)
  fontFamily: FontFamily;
  fontWeight: FontWeight;
  textAlign: TextAlign;
  lineHeight: number; // 1.0 to 2.2
  letterSpacing: number; // -1 to 4 px
  
  // Appearance
  textColor: string;
  backgroundColor: string;
  backgroundOpacity: number; // 0 to 100
  borderRadius: number; // 0 to 32 px
  hasShadow: boolean;
  hasBackdropBlur: boolean;
  
  // Scrolling
  scrollSpeed: number; // 0.25 to 5.0 speed multiplier
  isAutoScroll: boolean;
  reverseScroll: boolean;
  
  // Smart Features
  highlightCurrentSentence: boolean;
  showReadingIndicator: boolean;
  readingIndicatorPosition: number; // 10% to 90% from top of box
  mirrorText: boolean; // beam-splitter prompter mirror
  
  // Margins
  paddingX: number;
  paddingY: number;
}

export interface RecordingTake {
  id: string;
  projectId: string;
  blobUrl: string;
  durationSeconds: number;
  recordedAt: string;
  sizeBytes: number;
  aspectRatio: AspectRatio;
  mode: RecordingMode;
  resolution: string;
}

export interface Project {
  id: string;
  title: string;
  script: string;
  createdAt: string;
  updatedAt: string;
  settings: TeleprompterSettings;
  takes: RecordingTake[];
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  aspectRatio: AspectRatio;
  settings: Partial<TeleprompterSettings>;
}

export interface ScriptStats {
  wordCount: number;
  charCount: number;
  paragraphCount: number;
  estimatedSeconds: number;
}
