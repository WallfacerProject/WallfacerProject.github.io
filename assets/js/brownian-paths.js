(() => {
  'use strict';
  const root = document.getElementById('brownian-paths');
  if (!root) return;
  const svg = root.querySelector('svg');
  const clear = root.querySelector('[data-clear]');
  const ns = 'http://www.w3.org/2000/svg';
  let reveal, dots = [], coords;
  const count = root.querySelector('[data-count]');
  const duration = root.querySelector('[data-duration]');
  const start = root.querySelector('[data-start]');
  const pause = root.querySelector('[data-pause]');
  const replay = root.querySelector('[data-replay]');
  const status = root.querySelector('[data-status]');
  const clock = root.querySelector('[data-time]');
  const steps = 1200;
  let paths = [], limit = 2, progress = 0, running = false, frame = 0, last = null;
  function normal() {
    return Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());
  }
  function stop() { running = false; cancelAnimationFrame(frame); last = null; }
  function node(tag, attributes, parent = svg, text) {
    const el = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([key, value]) => el.setAttribute(key, value));
    if (text !== undefined) el.textContent = text;
    parent.appendChild(el); return el;
  }
  function build() {
    const w = Math.max(260, svg.clientWidth), h = w < 450 ? 300 : 370;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.replaceChildren();
    const left = 48, top = 20, width = w - 68, height = h - 65;
    const x = t => left + width * t;
    const y = b => top + height * (limit - b) / (2 * limit);
    coords = {x, y, width};
    const defs = node('defs', {});
    const clip = node('clipPath', {id: 'brownian-reveal'}, defs);
    reveal = node('rect', {x: left - 2, y: top - 5, width: 2, height: height + 10}, clip);
    const label = (text, attributes) => node('text', {fill: '#222', 'font-family': 'Kosambi Computer Modern, serif', 'font-size': 14, ...attributes}, svg, text);
    for (let i = -2; i <= 2; i++) {
      const v = i * limit / 2;
      node('line', {x1: left, x2: w - 20, y1: y(v), y2: y(v), stroke: i === 0 ? '#aab1bb' : '#eef0f3'});
      label(Number(v.toFixed(2)).toString(), {x: left - 8, y: y(v) + 5, 'text-anchor': 'end'});
    }
    for (let i = 0; i <= 4; i++) label((i / 4).toFixed(2), {x: x(i / 4), y: h - 27, 'text-anchor': 'middle'});
    label('Time t', {x: x(0.5), y: h - 6, 'text-anchor': 'middle'});
    label('B(t)', {transform: `translate(14 ${top + height / 2}) rotate(-90)`, 'text-anchor': 'middle', 'font-style': 'italic'});
    const group = node('g', {'clip-path': 'url(#brownian-reveal)'});
    dots = paths.map((path, j) => {
      const color = `hsl(${(j * 137.508 + 210) % 360}, 65%, 39%)`;
      const d = Array.from(path, (v, i) => `${i ? 'L' : 'M'}${x(i / steps).toFixed(2)},${y(v).toFixed(2)}`).join(' ');
      node('path', {d, fill: 'none', stroke: color, 'stroke-width': 1.5, 'stroke-linejoin': 'round'}, group);
      return node('circle', {cx: x(0), cy: y(0), r: 3, fill: color});
    });
    draw();
  }
  function draw() {
    if (!coords) return;
    reveal.setAttribute('width', coords.width * progress + 4);
    const end = Math.min(steps, Math.floor(progress * steps));
    dots.forEach((dot, j) => {
      dot.setAttribute('cx', coords.x(end / steps));
      dot.setAttribute('cy', coords.y(paths[j][end]));
    });
    clock.textContent = `t = ${progress.toFixed(2)}`;
  }
  function tick(time) {
    if (!running) return;
    if (last !== null) progress = Math.min(1, progress + (time - last) / (1000 * Number(duration.value)));
    last = time; draw();
    if (progress < 1) frame = requestAnimationFrame(tick);
    else { stop(); pause.disabled = true; pause.textContent = 'Pause'; status.textContent = 'Complete. Replay these paths or draw new ones.'; }
  }
  function play() {
    running = true; last = null; pause.disabled = false; pause.textContent = 'Pause';
    status.textContent = `Tracing ${paths.length} ${paths.length === 1 ? 'path' : 'paths'}…`;
    frame = requestAnimationFrame(tick);
  }
  start.addEventListener('click', () => {
    stop();
    const n = Math.max(1, Math.min(20, Math.round(Number(count.value) || 1)));
    count.value = n;
    paths = Array.from({length: n}, () => {
      const path = new Float64Array(steps + 1);
      for (let i = 1; i <= steps; i++) path[i] = path[i-1] + normal() / Math.sqrt(steps);
      return path;
    });
    let maximum = 0;
    paths.forEach(path => path.forEach(v => { maximum = Math.max(maximum, Math.abs(v)); }));
    limit = Math.max(2, Math.ceil(maximum * 1.1 * 2) / 2);
    progress = 0; replay.disabled = false; clear.disabled = false; build(); play();
  });
  pause.addEventListener('click', () => {
    if (running) { stop(); pause.textContent = 'Resume'; status.textContent = 'Paused.'; }
    else play();
  });
  replay.addEventListener('click', () => { stop(); progress = 0; draw(); play(); });
  clear.addEventListener('click', () => {
    stop(); paths = []; progress = 0; limit = 2;
    pause.disabled = true; replay.disabled = true; clear.disabled = true;
    pause.textContent = 'Pause'; status.textContent = 'Cleared. Ready to draw again.'; build();
  });
  document.addEventListener('visibilitychange', () => { last = null; });
  new ResizeObserver(build).observe(svg);
  build();
})();
