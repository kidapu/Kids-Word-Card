/* 効果音。音声ファイルは持たず Web Audio でその場で合成している。
   （オフラインで完結する・容量が増えない・iOS の読み込み待ちがない） */

let ctx = null;

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  // iOS はユーザー操作の中でしか鳴らせない。タップから呼ばれる前提。
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

const VOLUME = 0.16;   // 寝る前に使うので控えめに

function tone(ac, { freq, to, at = 0, dur, type = "sine", gain = VOLUME, filter }) {
  const t = ac.currentTime + at;
  const osc = ac.createOscillator();
  const amp = ac.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (to) osc.frequency.linearRampToValueAtTime(to, t + dur);

  amp.gain.setValueAtTime(0, t);
  amp.gain.linearRampToValueAtTime(gain, t + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  let node = osc;
  if (filter) {
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = filter;
    node = osc.connect(lp);
  }
  node.connect(amp).connect(ac.destination);

  osc.start(t);
  osc.stop(t + dur + 0.02);
}

/** 正解：ピンポン（高い音 → 低い音） */
export function ding() {
  const ac = audio();
  if (!ac) return;
  tone(ac, { freq: 1318.5, at: 0,    dur: 0.42 });  // ピン（E6）
  tone(ac, { freq: 987.8,  at: 0.16, dur: 0.6  });  // ポン（B5）
}

/** 不正解：ブー（低い音がすこし下がる） */
export function buzz() {
  const ac = audio();
  if (!ac) return;
  tone(ac, {
    freq: 190, to: 130, dur: 0.38,
    type: "square", filter: 900, gain: VOLUME * 0.8,
  });
}
