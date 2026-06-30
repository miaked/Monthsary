const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');

function resize() {
  const w = window.innerWidth;
  canvas.width = w;
  canvas.height = w;
  canvas.style.height = w + 'px';
}
resize();
window.addEventListener('resize', () => { resize(); });

function heartX(t, scale) {
  return scale * 16 * Math.pow(Math.sin(t), 3);
}
function heartY(t, scale) {
  return -scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
}

const WORDS = 72;
const colors = ['#ff1493', '#ff69b4', '#ffb6d9', '#ff4da6', '#ff85c2', '#ffc0d9'];
let phase = 0;

function drawLily(cx, cy, r, petalColor, glowColor, scale) {
  const petals = 6;
  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * Math.PI * 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.55, r * 0.18, r * 0.52, 0, 0, Math.PI * 2);
    ctx.fillStyle = petalColor;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 18 * scale;
    ctx.fill();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = '#ffe066';
  ctx.shadowColor = '#ffe066';
  ctx.shadowBlur = 22 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
    const sx = cx + Math.cos(a) * r * 0.22;
    const sy = cy + Math.sin(a) * r * 0.22;
    const ex = cx + Math.cos(a) * r * 0.42;
    const ey = cy + Math.sin(a) * r * 0.42;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ex, ey, 3 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#ffcc00';
    ctx.fill();
  }
}

function drawStem(x1, y1, x2, y2, lx, ly, lx2, ly2, scale) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = '#5aff8a';
  ctx.lineWidth = 3 * scale;
  ctx.shadowColor = '#5aff8a';
  ctx.shadowBlur = 8 * scale;
  ctx.stroke();
  ctx.shadowBlur = 0;
  if (lx !== undefined) {
    ctx.beginPath();
    ctx.moveTo(x1, y1 + (y2 - y1) * 0.5);
    ctx.quadraticCurveTo(lx, ly, lx2, ly2);
    ctx.strokeStyle = '#5aff8a';
    ctx.lineWidth = 2 * scale;
    ctx.stroke();
  }
}

function draw() {
  const W = canvas.width;
  const H = canvas.height;
  const sc = W / 680;
  phase += 0.010;

  ctx.clearRect(0, 0, W, H);

  const bg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, H*0.7);
  bg.addColorStop(0, '#1a0020');
  bg.addColorStop(1, '#050008');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const ag = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, H*0.45);
  ag.addColorStop(0, 'rgba(255,200,255,0.07)');
  ag.addColorStop(1, 'rgba(255,200,255,0)');
  ctx.fillStyle = ag;
  ctx.fillRect(0, 0, W, H);

  const cx = W / 2;
  const cy = H * 0.40;
  const heartScale = W * 0.185;

  const fontSize = Math.max(6, Math.round(8 * sc));
  ctx.font = `bold ${fontSize}px Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < WORDS; i++) {
    const t = (i / WORDS) * Math.PI * 2 - Math.PI / 2;
    const hx = cx + heartX(t, heartScale / 16);
    const hy = cy + heartY(t, heartScale / 13);

    const dt = 0.01;
    const tx2 = heartX(t + dt, heartScale / 16) - heartX(t - dt, heartScale / 16);
    const ty2 = heartY(t + dt, heartScale / 13) - heartY(t - dt, heartScale / 13);
    const angle = Math.atan2(ty2, tx2) + Math.PI / 2;

    const colorIdx = (i + Math.floor(phase * 4)) % colors.length;
    const alpha = 0.65 + 0.35 * Math.sin(phase * 2 + i * 0.35);

    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(angle);
    ctx.globalAlpha = alpha;
    ctx.shadowColor = colors[colorIdx];
    ctx.shadowBlur = 8 * sc;
    ctx.fillStyle = colors[colorIdx];
    ctx.fillText('i love you', 0, 0);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  ctx.beginPath();
  for (let i = 0; i <= 200; i++) {
    const t = (i / 200) * Math.PI * 2 - Math.PI / 2;
    const hx = cx + heartX(t, heartScale / 16);
    const hy = cy + heartY(t, heartScale / 13);
    i === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
  }
  ctx.closePath();
  ctx.strokeStyle = 'rgba(255,20,147,0.13)';
  ctx.lineWidth = 2 * sc;
  ctx.shadowColor = '#ff1493';
  ctx.shadowBlur = 18 * sc;
  ctx.stroke();
  ctx.shadowBlur = 0;

  const stemY = H * 0.76;
  drawStem(cx, cy + heartScale*0.85, cx, stemY, cx-40*sc, stemY-60*sc, cx-70*sc, stemY-90*sc, sc);
  drawStem(cx-130*sc, cy+20*sc, cx-110*sc, stemY, cx-150*sc, stemY-50*sc, cx-175*sc, stemY-80*sc, sc);
  drawStem(cx+130*sc, cy+20*sc, cx+110*sc, stemY, cx+150*sc, stemY-50*sc, cx+175*sc, stemY-80*sc, sc);

  const gp = 0.85 + 0.15 * Math.sin(phase * 1.2);
  ctx.globalAlpha = gp;
  drawLily(cx, cy+heartScale*0.62, 52*sc, 'rgba(255,248,255,0.93)', '#e8d0ff', sc);
  drawLily(cx-130*sc, cy+30*sc, 42*sc, 'rgba(253,232,255,0.9)', '#d0a0ff', sc);
  drawLily(cx+130*sc, cy+20*sc, 42*sc, 'rgba(232,244,255,0.9)', '#a0c8ff', sc);
  ctx.globalAlpha = 1;

  const sparkles = [
    [cx-240*sc, cy-120*sc], [cx+240*sc, cy-100*sc],
    [cx-260*sc, cy+60*sc],  [cx+260*sc, cy+80*sc],
    [cx, cy-heartScale*1.05], [cx-100*sc, cy-heartScale*1.0],
    [cx+100*sc, cy-heartScale*1.0], [cx-180*sc, cy-heartScale*0.6],
    [cx+180*sc, cy-heartScale*0.6],
  ];
  sparkles.forEach(([sx, sy], idx) => {
    const sp = 0.4 + 0.6 * Math.abs(Math.sin(phase * 1.8 + idx * 1.1));
    ctx.beginPath();
    ctx.arc(sx, sy, 2.5*sc, 0, Math.PI*2);
    ctx.fillStyle = idx % 2 === 0 ? '#ffb6d9' : '#ff1493';
    ctx.globalAlpha = sp;
    ctx.shadowColor = '#ff69b4';
    ctx.shadowBlur = 8*sc;
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  requestAnimationFrame(draw);
}
draw();
