// 心地よさ重視の自動バイ菌消し。既存 app-v11.js は変更しない。
(() => {
  const song = document.getElementById('song');
  const covers = Array.from(document.querySelectorAll('.germ-cover'));
  if (!song || covers.length === 0) return;

  let timers = [];

  const clearTimers = () => {
    timers.forEach(t => clearTimeout(t));
    timers = [];
  };

  const resetGerms = () => {
    clearTimers();
    covers.forEach(c => c.classList.remove('is-cleaned'));
  };

  const startAutoClean = () => {
    resetGerms();
    document.body.classList.add('is-brushing');

    // 歯みがき音声を見ながら、急がず気持ちよく1匹ずつ減るテンポ。
    // 5匹を約70秒で消して、最後は余韻を残す。
    const schedule = [4500, 18500, 32500, 48500, 66500];
    schedule.forEach((ms, index) => {
      timers.push(setTimeout(() => {
        covers[index]?.classList.add('is-cleaned');
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
