/* ═══════════════════════════════════════════════
   BIRTHDAY WEBSITE — script.js
   ═══════════════════════════════════════════════ */

'use strict';

/* ── STATE ── */
let celebrationStarted = false;
let confettiInterval, heartsInterval, charInterval;
let activeScreen = 'screen-hero';

/* ════════════════════════════════════════════════
   STARS CANVAS (shared utility)
   ════════════════════════════════════════════════ */
function createStarField(canvasId, count = 180) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.6 + 0.3,
    a: Math.random() * 0.8 + 0.2,
    speed: Math.random() * 0.0004 + 0.0001,
    phase: Math.random() * Math.PI * 2
  }));

  function draw(t) {
    if (!canvas.isConnected) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      const twinkle = 0.5 + 0.5 * Math.sin(t * s.speed * 1000 + s.phase);
      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,240,${s.a * twinkle})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

/* ════════════════════════════════════════════════
   HERO — PARTICLES CANVAS (glowing dots)
   ════════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['rgba(244,196,48,', 'rgba(0,191,255,', 'rgba(249,168,212,', 'rgba(255,255,255,'];
  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    r: Math.random() * 2 + 0.5,
    color: colors[Math.floor(Math.random() * colors.length)],
    a: Math.random() * 0.5 + 0.1
  }));

  function draw() {
    if (!canvas.isConnected) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.a + ')';
      ctx.fill();
    }
    // Shooting stars
    if (Math.random() < 0.004) drawShootingStar(ctx, canvas);
    requestAnimationFrame(draw);
  }
  draw();
}

function drawShootingStar(ctx, canvas) {
  const x  = Math.random() * canvas.width * 0.7;
  const y  = Math.random() * canvas.height * 0.4;
  const len = 100 + Math.random() * 120;
  const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;

  let progress = 0;
  function step() {
    if (progress > 1) return;
    ctx.save();
    ctx.globalAlpha = Math.sin(progress * Math.PI) * 0.9;
    const grad = ctx.createLinearGradient(
      x + Math.cos(angle) * len * progress,
      y + Math.sin(angle) * len * progress,
      x + Math.cos(angle) * len * (progress + 0.3),
      y + Math.sin(angle) * len * (progress + 0.3)
    );
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(1, 'rgba(255,255,255,1)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * len * progress, y + Math.sin(angle) * len * progress);
    ctx.lineTo(x + Math.cos(angle) * len * Math.min(progress + 0.3, 1), y + Math.sin(angle) * len * Math.min(progress + 0.3, 1));
    ctx.stroke();
    ctx.restore();
    progress += 0.025;
    requestAnimationFrame(step);
  }
  step();
}

/* ════════════════════════════════════════════════
   HERO — TYPING ANIMATION
   ════════════════════════════════════════════════ */
function typeText(el, text, speed = 70) {
  return new Promise(resolve => {
    let i = 0;
    el.textContent = '';
    const t = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) { clearInterval(t); resolve(); }
    }, speed);
  });
}

async function runHeroSequence() {
  // Check background image
  const heroBg = document.getElementById('heroBg');
  const testImg = new Image();
  testImg.onerror = () => heroBg.classList.add('no-image');
  testImg.src = 'papa-main.jpg';

  await delay(800);
  const titleEl = document.getElementById('heroTitle');
  await typeText(titleEl, 'С Днём рождения, папа ❤️', 60);

  await delay(600);
  const sub = document.getElementById('heroSub');
  sub.style.opacity = '1';

  await delay(700);
  const btn = document.getElementById('heroBtn');
  btn.style.opacity = '1';
  btn.style.transition = 'opacity 1s ease, transform 0.3s ease, box-shadow 0.3s ease';

  await delay(500);
  const quote = document.getElementById('forceQuote');
  quote.style.opacity = '1';
}

/* ════════════════════════════════════════════════
   HERO — FLOWERS
   ════════════════════════════════════════════════ */
const FLOWERS = ['🌸', '🌺', '🌹', '🌼', '🌻', '💐', '🌷', '✿'];

function spawnFlower() {
  const layer = document.getElementById('flowersLayer');
  if (!layer) return;
  const el = document.createElement('div');
  el.className = 'flower';
  el.textContent = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];
  el.style.left = Math.random() * 100 + 'vw';
  el.style.bottom = '-3rem';
  const duration = 8 + Math.random() * 8;
  el.style.animationDuration = duration + 's';
  el.style.animationDelay = '0s';
  el.style.fontSize = (1.2 + Math.random() * 1.5) + 'rem';
  el.style.opacity = '0';
  layer.appendChild(el);
  setTimeout(() => el.remove(), duration * 1000);
}

function startFlowers() {
  spawnFlower();
  setInterval(spawnFlower, 1200);
}

/* ════════════════════════════════════════════════
   STAR WARS CHARACTERS — random appearances
   ════════════════════════════════════════════════ */
const chars = ['vader', 'chewie', 'yoda', 'storm', 'saber'];
let charQueue = [...chars];

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function animateChar(name) {
  const el = document.getElementById('char-' + name);
  if (!el || el.style.display === 'none') return;

  // Reset position styles per character
  const anims = {
    vader: () => {
      el.style.left = '-200px'; el.style.bottom = '5%'; el.style.right = 'auto';
      el.style.transition = 'left 2s ease, opacity 0.8s';
      el.style.opacity = '1';
      setTimeout(() => { el.style.left = '5%'; }, 50);
      setTimeout(() => {
        el.style.transition = 'left 2s ease, opacity 1.2s';
        el.style.left = '-200px'; el.style.opacity = '0';
      }, 4000);
    },
    chewie: () => {
      el.style.right = '-200px'; el.style.bottom = '5%'; el.style.left = 'auto';
      el.style.transition = 'right 2s ease, opacity 0.8s';
      el.style.opacity = '1';
      setTimeout(() => { el.style.right = '5%'; }, 50);
      setTimeout(() => {
        el.style.transition = 'right 2s ease, opacity 1.2s';
        el.style.right = '-200px'; el.style.opacity = '0';
      }, 4000);
    },
    yoda: () => {
      el.style.opacity = '0'; el.style.transform = 'translateX(-50%) scale(0.3)';
      el.style.transition = 'opacity 1s, transform 1s';
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateX(-50%) scale(1)';
      }, 50);
      setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(-50%) scale(0.3)';
      }, 4000);
    },
    storm: () => {
      el.style.right = '-160px'; el.style.bottom = '0'; el.style.left = 'auto';
      el.style.transition = 'right 1.2s ease, opacity 0.5s';
      el.style.opacity = '1';
      setTimeout(() => { el.style.right = '0'; }, 50);
      setTimeout(() => {
        el.style.right = '-160px'; el.style.opacity = '0';
      }, 3500);
    },
    saber: () => {
      el.style.right = '-120px'; el.style.top = '20%'; el.style.left = 'auto';
      el.style.transition = 'right 1s ease, opacity 0.6s';
      el.style.opacity = '1';
      setTimeout(() => { el.style.right = '3%'; }, 50);
      setTimeout(() => {
        el.style.right = '-120px'; el.style.opacity = '0';
      }, 3000);
    }
  };
  if (anims[name]) anims[name]();
}

function scheduleNextChar() {
  const wait = 20000 + Math.random() * 10000;
  charInterval = setTimeout(() => {
    if (activeScreen === 'screen-hero') {
      if (charQueue.length === 0) charQueue = shuffleArray([...chars]);
      animateChar(charQueue.pop());
    }
    scheduleNextChar();
  }, wait);
}

/* ════════════════════════════════════════════════
   CELEBRATION — START
   ════════════════════════════════════════════════ */
function startCelebration() {
  if (celebrationStarted) return;
  celebrationStarted = true;

  // Music
  const music = document.getElementById('bgMusic');
  if (music) {
    music.volume = 0.6;
    music.play().catch(() => {});
  }

  goToScreen('screen-message');
}

/* ════════════════════════════════════════════════
   SCREEN NAVIGATION
   ════════════════════════════════════════════════ */
function goToScreen(id) {
  const prev = document.getElementById(activeScreen);
  const next = document.getElementById(id);
  if (!next) return;

  if (prev) {
    prev.style.opacity = '0';
    prev.style.pointerEvents = 'none';
    prev.classList.remove('active');
  }

  activeScreen = id;
  next.classList.add('active');
  next.style.opacity = '1';
  next.style.pointerEvents = 'all';

  // Screen-specific init
  setTimeout(() => {
    if (id === 'screen-message')  initMessageScreen();
    if (id === 'screen-gallery')  initGalleryScreen();
    if (id === 'screen-poem')     initPoemScreen();
    if (id === 'screen-final')    initFinalScreen();
  }, 300);
}

/* ════════════════════════════════════════════════
   SCREEN 2 — MESSAGE
   ════════════════════════════════════════════════ */
function initMessageScreen() {
  createStarField('msgStarsCanvas', 200);
  startConfetti();
  startHeartsBackground('floatingHeartsMsg');
  startFireworks('fireworksContainer');

  const lines = document.querySelectorAll('.msg-line');
  lines.forEach(line => {
    const d = parseInt(line.dataset.delay) || 0;
    setTimeout(() => line.classList.add('visible'), 500 + d);
  });
}

/* ════════════════════════════════════════════════
   SCREEN 3 — GALLERY
   ════════════════════════════════════════════════ */
function initGalleryScreen() {
  createStarField('galleryStarsCanvas', 150);
  stopConfetti();
}

/* ════════════════════════════════════════════════
   SCREEN 4 — POEM
   ════════════════════════════════════════════════ */
function initPoemScreen() {
  createStarField('poemStarsCanvas', 160);
  startPoemParticles();

  const lines = document.querySelectorAll('.poem-line');
  lines.forEach(line => {
    const d = parseInt(line.dataset.delay) || 0;
    setTimeout(() => line.classList.add('visible'), 500 + d);
  });
}

function startPoemParticles() {
  const container = document.getElementById('poemParticles');
  if (!container) return;
  const emojis = ['✦', '✧', '⋆', '✨', '◦', '·', '•'];
  setInterval(() => {
    if (activeScreen !== 'screen-poem') return;
    const el = document.createElement('div');
    el.style.cssText = `
      position:absolute;
      left:${Math.random()*100}%;
      bottom:-1rem;
      font-size:${0.6+Math.random()*0.8}rem;
      color:rgba(244,196,48,${0.2+Math.random()*0.5});
      animation:heartRise ${6+Math.random()*6}s linear forwards;
      pointer-events:none;
    `;
    el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    container.appendChild(el);
    setTimeout(() => el.remove(), 12000);
  }, 400);
}

/* ════════════════════════════════════════════════
   SCREEN 5 — FINAL
   ════════════════════════════════════════════════ */
function initFinalScreen() {
  createStarField('finalStarsCanvas', 300);
  startFinalFireworks();
  startHeartsRain();

  const lines = document.querySelectorAll('.final-line');
  lines.forEach(line => {
    const d = parseInt(line.dataset.delay) || 0;
    setTimeout(() => line.classList.add('visible'), 800 + d);
  });
}

/* ════════════════════════════════════════════════
   CONFETTI
   ════════════════════════════════════════════════ */
const CONFETTI_COLORS = [
  '#f4c430','#dc143c','#22d3ee','#f9a8d4',
  '#4ade80','#ffd700','#a78bfa','#fb923c','#fff'
];

function spawnConfetti() {
  const container = document.getElementById('confettiContainer');
  if (!container || activeScreen !== 'screen-message') return;

  for (let i = 0; i < 6; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const size = 5 + Math.random() * 9;
    const isCircle = Math.random() > 0.5;
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      top: -10px;
      width: ${size}px;
      height: ${isCircle ? size : size * 0.4}px;
      background: ${color};
      border-radius: ${isCircle ? '50%' : '1px'};
      animation-duration: ${2 + Math.random() * 3}s;
      animation-delay: ${Math.random() * 0.5}s;
      opacity: 0;
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), 5500);
  }
}

function startConfetti() {
  spawnConfetti();
  confettiInterval = setInterval(spawnConfetti, 250);
}
function stopConfetti() {
  clearInterval(confettiInterval);
}

/* ════════════════════════════════════════════════
   FLOATING HEARTS
   ════════════════════════════════════════════════ */
const HEARTS = ['❤️', '🧡', '💛', '💙', '💜', '🤍', '💖', '💗', '💝'];

function spawnHeart(container, isRain = false) {
  const el = document.createElement('div');
  el.className = 'heart-float';
  const h = HEARTS[Math.floor(Math.random() * HEARTS.length)];
  el.textContent = h;
  const size = isRain ? 1 + Math.random() * 2 : 1 + Math.random() * 1.5;
  const dur = 5 + Math.random() * 7;
  el.style.cssText = `
    left: ${Math.random() * 100}%;
    bottom: -2rem;
    font-size: ${size}rem;
    animation-duration: ${dur}s;
    opacity: 0;
  `;
  container.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000 + 500);
}

function startHeartsBackground(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  heartsInterval = setInterval(() => {
    if (document.getElementById('screen-message').classList.contains('active')) {
      spawnHeart(container, false);
    }
  }, 500);
}

function startHeartsRain() {
  const container = document.getElementById('heartsRain');
  if (!container) return;
  let i = 0;
  function burst() {
    for (let j = 0; j < 3; j++) spawnHeart(container, true);
    i++;
    const delay = i < 20 ? 150 : 600;
    if (activeScreen === 'screen-final') setTimeout(burst, delay);
  }
  burst();
}

/* ════════════════════════════════════════════════
   FIREWORKS
   ════════════════════════════════════════════════ */
function launchFirework(container) {
  const cx = 10 + Math.random() * 80;
  const cy = 10 + Math.random() * 60;
  const colors = ['#f4c430','#dc143c','#22d3ee','#f9a8d4','#4ade80','#ffd700','#a78bfa','#fff'];
  const color  = colors[Math.floor(Math.random() * colors.length)];
  const count  = 24 + Math.floor(Math.random() * 16);

  for (let i = 0; i < count; i++) {
    const angle  = (i / count) * Math.PI * 2;
    const speed  = 60 + Math.random() * 100;
    const tx     = Math.cos(angle) * speed;
    const ty     = Math.sin(angle) * speed - (Math.random() * 40);
    const size   = 3 + Math.random() * 3;
    const dur    = 0.8 + Math.random() * 0.6;

    const p = document.createElement('div');
    p.className = 'fw-particle';
    p.style.cssText = `
      left: ${cx}%; top: ${cy}%;
      width: ${size}px; height: ${size}px;
      background: ${color};
      --tx: ${tx}px; --ty: ${ty}px;
      animation-duration: ${dur}s;
      box-shadow: 0 0 6px ${color};
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), dur * 1000 + 100);
  }
}

function startFireworks(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  launchFirework(container);
  setTimeout(() => launchFirework(container), 400);
  setTimeout(() => launchFirework(container), 800);
  setInterval(() => {
    if (activeScreen === 'screen-message') launchFirework(container);
  }, 1200);
}

function startFinalFireworks() {
  const container = document.getElementById('finalFireworks');
  if (!container) return;
  function burst() {
    launchFirework(container);
    if (Math.random() > 0.4) setTimeout(() => launchFirework(container), 200);
    if (activeScreen === 'screen-final') {
      setTimeout(burst, 600 + Math.random() * 600);
    }
  }
  burst();
  setTimeout(burst, 300);
  setTimeout(burst, 700);
}

/* ════════════════════════════════════════════════
   UTILITY
   ════════════════════════════════════════════════ */
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function restart() {
  celebrationStarted = false;
  stopConfetti();
  clearTimeout(charInterval);
  // reset message/poem/final lines
  document.querySelectorAll('.msg-line, .poem-line, .final-line').forEach(el => {
    el.classList.remove('visible');
  });
  goToScreen('screen-hero');
}

/* ════════════════════════════════════════════════
   INIT
   ════════════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  createStarField('starsCanvas', 220);
  initParticles();
  startFlowers();
  runHeroSequence();

  // Schedule SW character appearances (first one sooner)
  setTimeout(() => {
    animateChar('yoda');
    scheduleNextChar();
  }, 6000);

  // Make sure first screen is visible
  const hero = document.getElementById('screen-hero');
  hero.classList.add('active');
  hero.style.opacity = '1';
  hero.style.pointerEvents = 'all';
});
// Birthday music
const birthdayMusic = new Audio('happy.mp3');

window.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('heroBtn');

    if(startBtn){
        startBtn.addEventListener('click', () => {
            birthdayMusic.volume = 0.7;
            birthdayMusic.play();
        });
    }
});