// 自動バイ菌消し：20秒後に1匹目。その後は同じ間隔で、半端に残さず全部隠す。
(() => {
  const song = document.getElementById('song');
  const patches = Array.from(document.querySelectorAll('.clean-patch'));
  if (!song || patches.length === 0) return;

  let timers = [];
  const clearTimers = () => { timers.forEach(t => clearTimeout(t)); timers = []; };
  const resetClean = () => {
    clearTimers();
    patches.forEach(p => p.classList.remove('is-cleaned'));
  };

  const startAutoClean = () => {
    resetClean();
    document.body.classList.add('is-brushing');
    const schedule = [20000, 32000, 44000, 56000, 68000];
    schedule.forEach((ms, index) => {
      timers.push(setTimeout(() => {
        patches[index]?.classList.add('is-cleaned');
      }, ms));
    });
  };

  const stopMotionOnly = () => {
    clearTimers();
    document.body.classList.remove('is-brushing');
  };

  song.addEventListener('play', startAutoClean);
  song.addEventListener('ended', stopMotionOnly);
  song.addEventListener('pause', () => { if (!song.ended) stopMotionOnly(); });
})();
