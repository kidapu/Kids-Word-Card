import { useCallback, useState } from "react";

/**
 * ずかんで「押したものが喋っている間だけ光る」ための入れもの。
 * saying には、いま喋っているものの目印が入る。
 */
export function useSaying(speakAll) {
  const [saying, setSaying] = useState(null);

  const say = useCallback((key, words) => {
    setSaying(key);
    // 途中で別のものを押されたら、そちらの光りを消さないようにする
    speakAll(words, () => setSaying(s => (s === key ? null : s)));
  }, [speakAll]);

  return { saying, say };
}
