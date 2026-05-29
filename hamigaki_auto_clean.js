// 自動バイ菌消し：見た目はそのまま。タイミングだけ 20/40/60/80 秒に調整。
(() => {
  const song = document.getElementById('song');
  const patches = Array.from(document.querySelectorAll('.clean-patch'));
  if (!song || patches.length === 0) return;

  let timers = [];
  const clearTimers = () => {
    timers.forEach(t => clearTimeout(t));
    timers = [];
  };

  const resetClean = () => {
    clearTimers();
    patches.forEach(p => p.classList.remove('is-cleaned'));
  };

  const cleanPatch = (index) => {
    const patch = patches[index];
    if (!patch) return;
    patch.classList.add('is-cleaned');
  };

  const startAutoClean = () => {
    resetClean();
    document.body.classList.add('is-brushing');

    // 4匹想定：20秒、40秒、60秒、80秒。
    // g5 は左奥の補助パッチなので、1匹目と同時に出して半端残りを防ぐ。
    const schedule = [
      { ms: 20000, indexes: [0, 4] },
      { ms: 40000, indexes: [1] },
      { ms: 60000, indexes: [2] },
      { ms: 80000, indexes: [3] }
    ];

    schedule.forEach(({ ms, indexes }) => {
      timers.push(setTimeout(() => {
        indexes.forEach(cleanPatch);
      }, ms));
    });
  };

  const stopMotionOnly = () => {
    clearTimers();
    document.body.classList.remove('is-brushing');
  };

  song.addEventListener('play', startAutoClean);
  song.addEventListener('ended', stopMotionOnly);
  song.addEventListener('pause', () => {
    if (!song.ended) stopMotionOnly();
  });
})();
