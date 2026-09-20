// Audio meter and sound fx utility

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx || audioCtx.state === "closed") {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playCountdownBeep(isFinal = false): void {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Final beep is higher pitch (880Hz / A5), intermediate is 440Hz / A4
    osc.frequency.setValueAtTime(isFinal ? 880 : 440, ctx.currentTime);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (isFinal ? 0.35 : 0.18));

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + (isFinal ? 0.35 : 0.18));
  } catch (e) {
    // Audio playback may be restricted until user gesture, ignore safely
  }
}

export interface AudioMeterInstance {
  analyser: AnalyserNode;
  cleanup: () => void;
  getLevel: () => number; // 0.0 to 1.0
}

export function setupAudioMeter(stream: MediaStream): AudioMeterInstance | null {
  try {
    const audioTrack = stream.getAudioTracks()[0];
    if (!audioTrack) return null;

    const ctx = getAudioContext();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.5;

    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    return {
      analyser,
      cleanup: () => {
        try {
          source.disconnect();
          analyser.disconnect();
        } catch (e) {
          // ignore
        }
      },
      getLevel: () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        // Normalize 0 to 1
        return Math.min(1, Math.max(0, average / 128));
      },
    };
  } catch (e) {
    console.warn("Failed to setup audio meter:", e);
    return null;
  }
}
