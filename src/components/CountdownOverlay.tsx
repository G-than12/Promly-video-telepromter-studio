import React, { useEffect, useState, useRef } from "react";
import { playCountdownBeep } from "../utils/audio";
import { Play } from "lucide-react";

interface CountdownOverlayProps {
  initialCount: number;
  onComplete: () => void;
  onCancel: () => void;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({
  initialCount,
  onComplete,
  onCancel,
}) => {
  const [current, setCurrent] = useState(initialCount);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Play sound on each countdown tick
    try {
      playCountdownBeep(current === 1);
    } catch (e) {
      // Audio autoplay policy fallback
    }

    if (current <= 1) {
      const timer = setTimeout(() => {
        onCompleteRef.current();
      }, 900);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setCurrent((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [current]);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center select-none animate-in fade-in duration-200">
      <div className="flex flex-col items-center justify-center max-w-sm text-center px-4">
        <div className="text-rose-400 text-xs font-semibold tracking-widest uppercase mb-3 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
          Bersiap Merekam...
        </div>

        {/* Animated Number */}
        <div
          key={current}
          className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-rose-400 via-amber-300 to-rose-600 font-mono scale-animation drop-shadow-[0_0_40px_rgba(244,63,94,0.6)] my-2"
        >
          {current <= 1 ? "1" : current}
        </div>

        <p className="text-xs text-neutral-400 mt-2 mb-6">
          Posisikan pandangan Anda pada garis baca teleprompter
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onCompleteRef.current()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Mulai Sekarang</span>
          </button>

          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-medium border border-neutral-800 transition-colors"
          >
            Batal (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
