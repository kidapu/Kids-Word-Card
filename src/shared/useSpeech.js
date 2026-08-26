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

function utter(text, lang) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  const v = pickVoice(lang);
  if (v) u.voice = v;
  u.rate = lang.startsWith("en") ? 0.85 : 1;
  u.pitch = 1.1;
  return u;
}

/**
 * 読み上げ。talking は喋っている間だけ true。
 * 音声は将来 mp3 に差し替える想定なので、呼び出し側はこのフックだけ見ればいい。
 */
export function useSpeech() {
  const [talking, setTalking] = useState(false);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setTalking(false);
  }, []);

  /**
   * [{ text, lang }, ...] を順に読む。積むだけで続けて鳴る。
   * onDone は全部読み終わったときに呼ぶ（止めたときにも呼ばれる）。
   */
  const speakAll = useCallback((items, onDone) => {
    if (!supported || !items.length) return;
    window.speechSynthesis.cancel();
    items.forEach((it, i) => {
      const u = utter(it.text, it.lang);
      if (i === 0) u.onstart = () => setTalking(true);
      if (i === items.length - 1) {
        u.onend = u.onerror = () => { setTalking(false); onDone?.(); };
      }
      window.speechSynthesis.speak(u);
    });
  }, []);

  const speak = useCallback(
    (text, lang) => speakAll([{ text, lang }]),
    [speakAll]
  );

  // 画面から消えるときに喋りかけを止める
  useEffect(() => stop, [stop]);

  return { speak, speakAll, stop, talking };
}
