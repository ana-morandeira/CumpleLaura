const STORAGE_KEY_COUNT   = 'laura-count-v1';
const STORAGE_KEY_HISTORY = 'laura-history-v1';

const PALETTE = ['#FF2D9A', '#FFD700', '#9B5DE5', '#00D4FF', '#AAFF00', '#FF6B6B', '#FF9F43'];

const CONFETTI_EMOJIS = ['🎀', '🎉', '🎊', '💖', '🌸', '⭐', '🥳', '💥', '✨', '🌈'];

const REACTIONS = ['😂', '🤣', '😱', '💀', '🔥', '😵', '🫠', '😆', '🤪', '😜'];

const MILESTONES = {
  1:   '¡Primer tirón! 👂',
  5:   '¡5 tirones! 🔥',
  10:  '¡10 tirones! 💀',
  25:  '¡25 tirones! 🤣',
  50:  '¡50 TIRONES! 😱',
  100: '¡100! ¿EN SERIO?! 💥',
};

const ACTIVITY_BUCKETS    = 8;
const ACTIVITY_WINDOW_MS  = 30_000;
const MAX_HISTORY_LENGTH  = 20;
const CONFETTI_PER_BURST  = 24;
const MILESTONE_BURST_COUNT = 6;
const MILESTONE_BURST_DELAY = 120;


let pullCount   = parseInt(localStorage.getItem(STORAGE_KEY_COUNT) || '0');
let pullHistory = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY) || '[]');
let audioCtx    = null;
let particles   = [];
let isAnimating = false;


const counterEl   = document.getElementById('counter');
const photoFrame  = document.getElementById('photo-frame');
const faceWrapper = document.getElementById('face-wrapper');
const earLeft     = document.getElementById('ear-left');
const earRight    = document.getElementById('ear-right');
const rankBars    = document.getElementById('rank-bars');
const canvas      = document.getElementById('confetti-canvas');
const ctx         = canvas.getContext('2d');


function saveState() {
  localStorage.setItem(STORAGE_KEY_COUNT, pullCount);
  localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(pullHistory));
}


function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}


function createBackgroundDots() {
  const container = document.getElementById('bg-dots');

  for (let i = 0; i < 20; i++) {
    const dot      = document.createElement('div');
    const size     = 6 + (i % 4) * 6;
    const isCircle = i % 2 === 0;

    dot.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      background: ${PALETTE[i % PALETTE.length]};
      top: ${(i * 37) % 100}%;
      left: ${(i * 53) % 100}%;
      border-radius: ${isCircle ? '50%' : '3px'};
      opacity: 0.12;
      pointer-events: none;
      animation: dotFloat ${3 + (i % 4)}s ease-in-out ${(i * 0.3) % 3}s infinite;
    `;

    container.appendChild(dot);
  }
}


function getAudioContext() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function createOscillator(ac, type, gain) {
  const osc  = ac.createOscillator();
  const gainNode = ac.createGain();
  osc.type = type;
  osc.connect(gainNode);
  gainNode.connect(ac.destination);
  gainNode.gain.setValueAtTime(gain, ac.currentTime);
  return { osc, gainNode };
}

function playSqueek() {
  try {
    const ac = getAudioContext();
    const { osc, gainNode } = createOscillator(ac, 'sine', 0.3);
    osc.frequency.setValueAtTime(600, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, ac.currentTime + 0.07);
    osc.frequency.exponentialRampToValueAtTime(500,  ac.currentTime + 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.25);
    osc.start();
    osc.stop(ac.currentTime + 0.3);
  } catch (e) {}
}

function playBoing() {
  try {
    const ac = getAudioContext();
    const { osc, gainNode } = createOscillator(ac, 'sine', 0.35);
    osc.frequency.setValueAtTime(300, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ac.currentTime + 0.4);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.45);
    osc.start();
    osc.stop(ac.currentTime + 0.5);
  } catch (e) {}
}

function playWobble() {
  try {
    const ac = getAudioContext();
    const { osc, gainNode } = createOscillator(ac, 'sawtooth', 0.25);
    const freqs = [400, 180, 350, 140, 300];
    freqs.forEach((freq, i) => {
      osc.frequency.setValueAtTime(freq, ac.currentTime + i * 0.06);
    });
    gainNode.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.35);
    osc.start();
    osc.stop(ac.currentTime + 0.4);
  } catch (e) {}
}

function playFart() {
  try {
    const ac           = getAudioContext();
    const bufferLength = ac.sampleRate * 0.3;
    const buffer       = ac.createBuffer(1, bufferLength, ac.sampleRate);
    const data         = buffer.getChannelData(0);

    for (let i = 0; i < bufferLength; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferLength, 1.5);
    }

    const source = ac.createBufferSource();
    const filter = ac.createBiquadFilter();
    const gain   = ac.createGain();

    source.buffer        = buffer;
    filter.type          = 'lowpass';
    filter.frequency.value = 280;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);

    gain.gain.setValueAtTime(0.7, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.3);
    source.start();
  } catch (e) {}
}

function playPop() {
  try {
    const ac = getAudioContext();
    const { osc, gainNode } = createOscillator(ac, 'sine', 0.4);
    osc.frequency.setValueAtTime(1000, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ac.currentTime + 0.08);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.1);
    osc.start();
    osc.stop(ac.currentTime + 0.12);
  } catch (e) {}
}

const SOUNDS = [playSqueek, playBoing, playWobble, playFart, playPop];

function playRandomSound() {
  const index = Math.floor(Math.random() * SOUNDS.length);
  SOUNDS[index]();
}


function forceReflow(element) {
  void element.offsetWidth;
}

function animateCounter() {
  counterEl.classList.remove('bumping');
  forceReflow(counterEl);
  counterEl.classList.add('bumping');
  counterEl.addEventListener('animationend', () => {
    counterEl.classList.remove('bumping');
  }, { once: true });
}

function flashPhotoFrame() {
  photoFrame.classList.add('flash');
  setTimeout(() => photoFrame.classList.remove('flash'), 200);
}

function shakeFace() {
  faceWrapper.classList.remove('shaking');
  forceReflow(faceWrapper);
  faceWrapper.classList.add('shaking');
  faceWrapper.addEventListener('animationend', () => {
    faceWrapper.classList.remove('shaking');
  }, { once: true });
}

function animateEar(ear) {
  ear.classList.add('pulled');
  setTimeout(() => ear.classList.remove('pulled'), 400);
}

function showPullLabel(side) {
  const label = document.createElement('div');
  label.className = 'pull-label';
  label.style[side === 'left' ? 'left' : 'right'] = '-5px';
  label.textContent = '+1 👂';
  faceWrapper.appendChild(label);
  setTimeout(() => label.remove(), 1000);
}

function showReactionEmoji() {
  const emoji = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
  const el    = document.createElement('div');
  el.className   = 'reaction-popup';
  el.textContent = emoji;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

function showMilestoneBanner(text) {
  const el = document.createElement('div');
  el.className   = 'milestone-popup';
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1900);

  for (let i = 0; i < MILESTONE_BURST_COUNT; i++) {
    setTimeout(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight * 0.5;
      spawnConfetti(x, y);
    }, i * MILESTONE_BURST_DELAY);
  }
}


function updateActivityBars() {
  const now      = Date.now();
  const bucketMs = ACTIVITY_WINDOW_MS / ACTIVITY_BUCKETS;
  const counts   = new Array(ACTIVITY_BUCKETS).fill(0);

  pullHistory.forEach(timestamp => {
    const age = now - timestamp;
    if (age < ACTIVITY_WINDOW_MS) {
      const bucketIndex = Math.floor(age / bucketMs);
      if (bucketIndex < ACTIVITY_BUCKETS) {
        counts[ACTIVITY_BUCKETS - 1 - bucketIndex]++;
      }
    }
  });

  const maxCount = Math.max(...counts, 1);
  rankBars.innerHTML = '';

  counts.forEach((count, i) => {
    const wrapper     = document.createElement('div');
    wrapper.className = 'bar-wrapper';

    const bar         = document.createElement('div');
    const heightPx    = Math.max(4, (count / maxCount) * 56);
    bar.className     = 'bar-column';
    bar.style.height     = `${heightPx}px`;
    bar.style.background = PALETTE[i % PALETTE.length];
    bar.style.opacity    = `${0.4 + (count / maxCount) * 0.6}`;

    wrapper.appendChild(bar);
    rankBars.appendChild(wrapper);
  });
}


function createParticle(x, y, index) {
  const angle   = (index / CONFETTI_PER_BURST) * Math.PI * 2;
  const speed   = 4 + Math.random() * 7;
  const isEmoji = Math.random() > 0.6;

  return {
    x, y,
    vx:            Math.cos(angle) * speed,
    vy:            Math.sin(angle) * speed - 5,
    color:         PALETTE[Math.floor(Math.random() * PALETTE.length)],
    emoji:         isEmoji ? CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)] : null,
    size:          8 + Math.random() * 14,
    rotation:      Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 12,
    life:          1,
    decay:         0.016 + Math.random() * 0.01,
  };
}

function updateParticle(particle) {
  particle.x        += particle.vx;
  particle.y        += particle.vy;
  particle.vy       += 0.28;
  particle.vx       *= 0.99;
  particle.rotation += particle.rotationSpeed;
  particle.life     -= particle.decay;
}

function drawParticle(particle) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, particle.life);
  ctx.translate(particle.x, particle.y);
  ctx.rotate((particle.rotation * Math.PI) / 180);

  if (particle.emoji) {
    ctx.font         = `${particle.size * 1.5}px serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(particle.emoji, 0, 0);
  } else {
    ctx.fillStyle = particle.color;
    ctx.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size / 2);
  }

  ctx.restore();
}

function animateConfetti() {
  isAnimating = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    updateParticle(p);
    drawParticle(p);
  });

  if (particles.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    isAnimating = false;
  }
}

function spawnConfetti(x, y) {
  for (let i = 0; i < CONFETTI_PER_BURST; i++) {
    particles.push(createParticle(x, y, i));
  }
  if (!isAnimating) requestAnimationFrame(animateConfetti);
}


function handleEarPull(side, event) {
  // Update state
  pullCount++;
  pullHistory.push(Date.now());
  if (pullHistory.length > MAX_HISTORY_LENGTH) pullHistory.shift();
  saveState();

  counterEl.textContent = pullCount;

  animateCounter();
  flashPhotoFrame();
  shakeFace();
  animateEar(side === 'left' ? earLeft : earRight);
  showPullLabel(side);
  showReactionEmoji();
  playRandomSound();

  if (event) spawnConfetti(event.clientX, event.clientY);
  if (MILESTONES[pullCount]) showMilestoneBanner(MILESTONES[pullCount]);

  updateActivityBars();
}


earLeft.addEventListener('click',  e => handleEarPull('left', e));
earRight.addEventListener('click', e => handleEarPull('right', e));
window.addEventListener('resize', resizeCanvas);


function init() {
  counterEl.textContent = pullCount;
  resizeCanvas();
  createBackgroundDots();
  updateActivityBars();
}

init();