(() => {
  'use strict';

  const TOTAL_SECONDS = 90;
  const segments = [
    { from: 0, to: 15, zone: 'upperOutside', name: 'うえの は', hint: 'そとがわを シャカシャカ' },
    { from: 15, to: 30, zone: 'lowerOutside', name: 'したの は', hint: 'そとがわを シャカシャカ' },
    { from: 30, to: 45, zone: 'front', name: 'まえば', hint: 'にこっと まえばを みがこう' },
    { from: 45, to: 60, zone: 'upperInside', name: 'うえの うら', hint: 'うらがわも わすれずに' },
    { from: 60, to: 75, zone: 'lowerInside', name: 'したの うら', hint: 'やさしく こちょこちょ' },
    { from: 75, to: 90, zone: 'finish', name: 'しあげ', hint: 'さいごは ぴかぴかにしよう' },
  ];

  const song = document.getElementById('song');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const againBtn = document.getElementById('againBtn');
  const timer = document.getElementById('timer');
  const progress = document.getElementById('progress');
  const areaName = document.getElementById('areaName');
  const areaHint = document.getElementById('areaHint');
  const message = document.getElementById('message');
  const brush = document.getElementById('brush');
  const shine = document.getElementById('shine');
  const stage = document.getElementById('stage');
  const done = document.getElementById('done');
  const zones = [...document.querySelectorAll('.zone')];

  let rafId = null;
  let lastSegmentIndex = -1;
  let completed = false;

  function formatTime(sec) {
    const safe = Math.max(0, Math.ceil(sec));
    const m = Math.floor(safe / 60);
    const s = String(safe % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function getCurrentTime() {
    return Math.min(song.currentTime || 0, TOTAL_SECONDS);
  }

  function segmentIndexAt(t) {
    return Math.min(segments.length - 1, Math.floor(t / 15));
  }

  function popShine() {
    shine.classList.remove('pop');
    void shine.offsetWidth;
    shine.classList.add('pop');
  }

  function updateUI() {
    const t = getCurrentTime();
    const remain = TOTAL_SECONDS - t;
    const pct = Math.min(100, (t / TOTAL_SECONDS) * 100);
    const idx = segmentIndexAt(t);
    const seg = segments[idx];

    timer.textContent = formatTime(remain);
    progress.style.width = `${pct}%`;

    stage.classList.toggle('phase-1', t < 22.5);
    stage.classList.toggle('phase-2', t >= 22.5 && t < 45);
    stage.classList.toggle('phase-3', t >= 45 && t < 67.5);
    stage.classList.toggle('phase-4', t >= 67.5);

    if (idx !== lastSegmentIndex) {
      lastSegmentIndex = idx;
      areaName.textContent = seg.name;
      areaHint.textContent = seg.hint;
      message.textContent = idx === 0 ? 'いっしょに みがこう！' : 'つぎの ばしょ！';
      popShine();
      zones.forEach((z) => {
        z.classList.toggle('active', z.dataset.zone === seg.zone);
        const zoneIndex = segments.findIndex((item) => item.zone === z.dataset.zone);
        z.classList.toggle('done-zone', zoneIndex >= 0 && zoneIndex < idx);
      });
      window.setTimeout(() => {
        if (!completed) message.textContent = 'シャカシャカ♪';
      }, 1400);
    }

    if (!song.paused && !completed) {
      rafId = requestAnimationFrame(updateUI);
    }
  }

  async function start() {
    if (completed) reset(false);
    try {
      await song.play();
      startBtn.textContent = 'さいせい中';
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      brush.classList.add('cleaning');
      message.textContent = 'シャカシャカ♪';
      if (rafId) cancelAnimationFrame(rafId);
      updateUI();
    } catch (error) {
      message.textContent = 'もういちど おしてね';
      console.error(error);
    }
  }

  function pause() {
    song.pause();
    startBtn.textContent = 'つづき';
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    brush.classList.remove('cleaning');
    message.textContent = 'ちょっと おやすみ';
    if (rafId) cancelAnimationFrame(rafId);
  }

  function reset(showReady = true) {
    completed = false;
    song.pause();
    song.currentTime = 0;
    startBtn.textContent = 'スタート';
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    brush.classList.remove('cleaning');
    lastSegmentIndex = -1;
    done.hidden = true;
    stage.hidden = false;
    zones.forEach((z) => z.classList.remove('active', 'done-zone'));
    timer.textContent = '1:30';
    progress.style.width = '0%';
    areaName.textContent = 'じゅんび';
    areaHint.textContent = 'よこ向きで使ってね';
    message.textContent = showReady ? 'スタートをおしてね' : 'いっしょに みがこう！';
    if (rafId) cancelAnimationFrame(rafId);
  }

  function finish() {
    completed = true;
    song.pause();
    brush.classList.remove('cleaning');
    progress.style.width = '100%';
    timer.textContent = '0:00';
    zones.forEach((z) => z.classList.add('done-zone'));
    window.setTimeout(() => {
      stage.hidden = true;
      done.hidden = false;
    }, 350);
  }

  song.addEventListener('ended', finish);
  song.addEventListener('timeupdate', () => {
    if (song.currentTime >= TOTAL_SECONDS - 0.15 && !completed) finish();
  });
  startBtn.addEventListener('click', start);
  pauseBtn.addEventListener('click', pause);
  resetBtn.addEventListener('click', () => reset(true));
  againBtn.addEventListener('click', () => reset(true));

  reset(true);
})();
