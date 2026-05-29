// 追加演出だけ。既存 app-v11.js は変更しない。
(() => {
  const song = document.getElementById('song');
  const covers = Array.from(document.querySelectorAll('.germ-cover'));
  if (!song || covers.length === 0) return;

  let timer = null;
  let cleaned = 0;

  const resetGerms = () => {
    cleaned = 0;
    covers.forEach(c => c.classList.remove('is-cleaned'));
  };

  const cleanNext = () => {
    if (cleaned >= covers.length) return;
    covers[cleaned].classList.add('is-cleaned');
    cleaned += 1;
  };

  const startAutoClean = () => {
    clearInterval(timer);
    resetGerms();
    document.body.classList.add('is-brushing');

    // すぐ1匹、その後は音声に合わせて少しずつ消す。
    setTimeout(cleanNext, 1200);
    timer = setInterval(cleanNext, 9000);
  };

  const stopMotionOnly = () => {
    clearInterval(timer);
    timer = null;
    document.body.classList.remove('is-brushing');
  };

  song.addEventListener('play', startAutoClean);
  song.addEventListener('ended', stopMotionOnly);
  song.addEventListener('pause', () => {
    if (!song.ended) stopMotionOnly();
  });

  // 念のため、既存JSが音声を巻き戻して再生するタイプでも毎回リセットされるようにする。
  song.addEventListener('seeking', () => {
    if (song.currentTime < 0.5) resetGerms();
  });
})();
