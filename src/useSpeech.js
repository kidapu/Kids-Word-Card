import { useCallback, useEffect, useState } from "react";

const supported = typeof window !== "undefined" && "speechSynthesis" in window;

let voices = [];
const loadVoices = () => { voices = window.speechSynthesis.getVoices(); };
if (supported) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

function pickVoice(lang) {
  const head = lang.split("-")[0];
  return voices.find(v => v.lang.replace("_", "-") === lang)
      || voices.find(v => v.lang.startsWith(head));
}

/**
 * 読み上げを1つだけ再生する。talking は喋っている間だけ true。
 * 音声は将来 mp3 に差し替える想定なので、呼び出し側はこのフックだけ見ればいい。
 */
export function useSpeech() {
  const [talking, setTalking] = useState(false);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setTalking(false);
  }, []);

  const speak = useCallback((text, lang) => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    const v = pickVoice(lang);
    if (v) u.voice = v;
    u.rate = lang.startsWith("en") ? 0.85 : 1;
    u.pitch = 1.1;
    u.onstart = () => setTalking(true);
    u.onend = u.onerror = () => setTalking(false);
    window.speechSynthesis.speak(u);
  }, []);

  // 画面から消えるときに喋りかけを止める
  useEffect(() => stop, [stop]);

  return { speak, stop, talking };
}
