import { Preset, TeleprompterSettings, Project } from "../types";

export const DEFAULT_TELEPROMPTER_SETTINGS: TeleprompterSettings = {
  positionX: 50,
  positionY: 28,
  widthPercent: 70,
  heightPercent: 40,
  
  fontSize: 32,
  fontFamily: "Inter",
  fontWeight: "600",
  textAlign: "center",
  lineHeight: 1.5,
  letterSpacing: 0,
  
  textColor: "#ffffff",
  backgroundColor: "#000000",
  backgroundOpacity: 65,
  borderRadius: 16,
  hasShadow: true,
  hasBackdropBlur: true,
  
  scrollSpeed: 1.0,
  isAutoScroll: true,
  reverseScroll: false,
  
  highlightCurrentSentence: true,
  showReadingIndicator: true,
  readingIndicatorPosition: 45,
  mirrorText: false,
  
  paddingX: 28,
  paddingY: 24,
};

export const BUILT_IN_PRESETS: Preset[] = [
  {
    id: "creator-vertical",
    name: "Creator (TikTok / Reels)",
    description: "9:16 vertical ratio, large crisp text, semi-transparent backdrop near upper eye-level",
    aspectRatio: "9:16",
    settings: {
      positionX: 50,
      positionY: 24,
      widthPercent: 88,
      heightPercent: 38,
      fontSize: 34,
      fontFamily: "Poppins",
      fontWeight: "700",
      textAlign: "center",
      textColor: "#ffffff",
      backgroundColor: "#09090b",
      backgroundOpacity: 60,
      borderRadius: 20,
      scrollSpeed: 1.25,
      hasBackdropBlur: true,
      highlightCurrentSentence: true,
      showReadingIndicator: true,
    },
  },
  {
    id: "presentation-landscape",
    name: "Executive Presentation",
    description: "16:9 widescreen, dark solid contrast, clean reading line for webinars and pitch decks",
    aspectRatio: "16:9",
    settings: {
      positionX: 50,
      positionY: 22,
      widthPercent: 65,
      heightPercent: 35,
      fontSize: 28,
      fontFamily: "Inter",
      fontWeight: "500",
      textAlign: "center",
      textColor: "#f8fafc",
      backgroundColor: "#020617",
      backgroundOpacity: 85,
      borderRadius: 14,
      scrollSpeed: 0.9,
      hasBackdropBlur: false,
      highlightCurrentSentence: true,
      showReadingIndicator: true,
    },
  },
  {
    id: "high-contrast-reader",
    name: "High-Contrast Neon",
    description: "Vibrant yellow on deep black, optimal for glasses wearers and distant lighting",
    aspectRatio: "16:9",
    settings: {
      positionX: 50,
      positionY: 25,
      widthPercent: 75,
      heightPercent: 42,
      fontSize: 36,
      fontFamily: "Roboto",
      fontWeight: "700",
      textAlign: "center",
      textColor: "#facc15",
      backgroundColor: "#000000",
      backgroundOpacity: 92,
      borderRadius: 12,
      scrollSpeed: 1.0,
      hasBackdropBlur: false,
      highlightCurrentSentence: true,
      showReadingIndicator: true,
    },
  },
  {
    id: "minimalist-glass",
    name: "Subtle Glassmorphism",
    description: "Sleek floating glass layer that lets your background shine through",
    aspectRatio: "16:9",
    settings: {
      positionX: 50,
      positionY: 30,
      widthPercent: 60,
      heightPercent: 36,
      fontSize: 26,
      fontFamily: "Montserrat",
      fontWeight: "600",
      textAlign: "center",
      textColor: "#e0f2fe",
      backgroundColor: "#0f172a",
      backgroundOpacity: 45,
      borderRadius: 24,
      scrollSpeed: 1.0,
      hasBackdropBlur: true,
      highlightCurrentSentence: false,
      showReadingIndicator: true,
    },
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "sample-1",
    title: "Cara Membedakan Kebutuhan & Keinginan",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    settings: { ...DEFAULT_TELEPROMPTER_SETTINGS },
    takes: [],
    script: `Halo semuanya! Pada video kali ini, kita akan membahas cara paling sederhana membedakan kebutuhan dan keinginan.

[pause]

Banyak orang merasa gajinya cepat habis di awal bulan. Padahal, seringkali masalahnya bukan pada jumlah pemasukannya, melainkan pada ketidakmampuan kita memilah mana yang esensial dan mana yang cuma lapar mata.

Aturan praktisnya sangat gampang:
Kebutuhan adalah sesuatu yang jika tidak dipenuhi, kelangsungan hidup atau pekerjaanmu akan terganggu. Contohnya: makanan bergizi, tempat tinggal yang layak, dan biaya transportasi kerja.

Sedangkan keinginan adalah hal yang menyenangkan jika dimiliki, tapi tidak membawa dampak fatal jika ditunda. Misalnya: beli sneakers edisi terbatas atau upgrade smartphone tiap tahun.

[pause]

Tips dari saya: setiap kali mau checkout barang di e-commerce, beri jeda 48 jam. Jika setelah dua hari kamu sudah tidak memikirkannya lagi, berarti itu cuma keinginan sesaat.

Bagikan video ini ke teman kamu yang suka impulsif belanja, dan klik follow untuk tips finansial praktis lainnya!`,
  },
  {
    id: "sample-2",
    title: "Tips Lolos Interview Kerja Pertama",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
    settings: {
      ...DEFAULT_TELEPROMPTER_SETTINGS,
      fontSize: 30,
      scrollSpeed: 1.1,
    },
    takes: [],
    script: `Selamat pagi semuanya! Hari ini saya mau share 3 kunci emas agar kamu percaya diri dan lolos di sesi interview kerja pertamamu.

Pertama: Kuasai teknik STAR ketika menjawab pertanyaan seputar pengalamanmu. STAR adalah singkatan dari Situation, Task, Action, dan Result. Fokuskan ceritamu pada aksi nyata yang kamu ambil dan dampak yang terukur.

[pause]

Kedua: Lakukan riset mendalam tentang masalah yang sedang dihadapi perusahaan tersebut. Jangan cuma menghafalkan visi misi di website, tapi tunjukkan bagaimana skill kamu bisa menjadi solusi konkret bagi tim mereka.

Ketiga: Siapkan 2 pertanyaan cerdas untuk si pewawancara di akhir sesi. Ini membuktikan antusiasme dan kesiapan mentalmu.

Ingat, interview adalah percakapan dua arah, bukan interogasi. Tetap tenang, tersenyum, dan percaya pada kemampuanmu!`,
  },
];
