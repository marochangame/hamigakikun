// 自動バイ菌消し：途中変化なし。指定タイミングでスパッと消す。
(() => {
  const song = document.getElementById('song');
  const germs = Array.from(document.querySelectorAll('.germ-cover'));
  if (!song || germs.length === 0) return;

  let timers = [];
  const clearTimers = () => { timers.forEach(t => clearTimeout(t)); timers = []; };
  const resetGerms = () => {
    clearTimers();
    germs.forEach(g => g.classList.remove('is-cleaned'));
  };

  const startAutoClean = () => {
    resetGerms();
    document.body.classList.add('is-brushing');
    const schedule = [5000, 19000, 33000, 49000, 66000];
    schedule.forEach((ms, index) => {
      timers.push(setTimeout(() => {
        germs[index]?.classList.add('is-cleaned');
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
