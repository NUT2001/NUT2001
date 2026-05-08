/* ===== Quiz primitives: click-tick sound + countdown timer ===== */

let _audioCtx = null;
function _ctx() {
  if (!_audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) _audioCtx = new Ctx();
  }
  return _audioCtx;
}

function playTick() {
  const ctx = _ctx();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(1200, t);
  osc.frequency.exponentialRampToValueAtTime(600, t + 0.04);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.18, t + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.07);
}

function startCountdown({ seconds, barEl, numEl, onDone }) {
  let remaining = seconds;
  if (numEl) numEl.textContent = String(remaining);
  if (barEl) {
    barEl.style.transition = 'none';
    barEl.style.width = '100%';
    void barEl.offsetWidth;
    barEl.style.transition = `width ${seconds}s linear`;
    barEl.style.width = '0%';
  }
  const handle = { _done: false, cancel() {
    if (!handle._done) { clearInterval(interval); handle._done = true; }
  }};
  const interval = setInterval(() => {
    remaining -= 1;
    if (numEl) numEl.textContent = String(Math.max(0, remaining));
    if (remaining > 0) {
      playTick();
    } else {
      clearInterval(interval);
      handle._done = true;
      if (onDone) onDone();
    }
  }, 1000);
  return handle;
}

window.playTick = playTick;
window.startCountdown = startCountdown;
