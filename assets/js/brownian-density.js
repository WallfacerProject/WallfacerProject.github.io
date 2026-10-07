(() => {
  'use strict';
  const root = document.getElementById('brownian-density');
  if (!root) return;

  const svg = root.querySelector('svg');
  const count = root.querySelector('[data-count]');
  const duration = root.querySelector('[data-duration]');
  const start = root.querySelector('[data-start]');
  const pause = root.querySelector('[data-pause]');
  const replay = root.querySelector('[data-replay]');
  const clear = root.querySelector('[data-clear]');
  const status = root.querySelector('[data-status]');
  const clock = root.querySelector('[data-time]');
  const distribution = root.querySelector('[data-distribution]');
  const ns = 'http://www.w3.org/2000/svg';
  const steps = 1200;
  const curvePoints = 96;
  let paths = [], cumulatives = [], totals = [], range = 3.2;
  let project, trails = [], pathDots = [], densityFill, densityLine, pointMass, trailReveal, trailGroup;
  let progress = 0, running = false, frame = 0, last = null;

  function normal() {
    return Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());
  }

  function stop() {
    running = false;
    cancelAnimationFrame(frame);
    last = null;
  }

  function node(tag, attributes, parent = svg, text) {
    const element = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    if (text !== undefined) element.textContent = text;
    parent.appendChild(element);
    return element;
  }

  function density(x, t) {
    return Math.exp(-x * x / (2 * t)) / Math.sqrt(2 * Math.PI * t);
  }

  function build() {
    const w = Math.max(260, svg.clientWidth);
    const h = w < 450 ? 330 : 420;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.replaceChildren();

    // Projection controls: a larger timeAxis y component reveals more of the time-value plane.
    const origin = [w * 0.23, h * 0.44];
    const timeAxis = [w * 0.50, h * 0.45];
    const valueAxis = [w * 0.18, 0];
    const densityScale = h * 0.30;
    project = (t, x, p = 0) => [
      origin[0] + t * timeAxis[0] + (x / range) * valueAxis[0],
      origin[1] + t * timeAxis[1] + (x / range) * valueAxis[1] - densityScale * p,
    ];
    const line = (from, to, attributes) => node('line', {
      x1: from[0], y1: from[1], x2: to[0], y2: to[1], ...attributes,
    });
    const label = (text, point, attributes = {}) => node('text', {
      x: point[0], y: point[1], fill: '#000',
      'font-size': w < 450 ? 13 : 16, ...attributes,
    }, svg, text);
    const defs = node('defs', {});
    const axisArrow = node('marker', {
      id: 'brownian-density-axis-arrow', markerWidth: 8, markerHeight: 8,
      refX: 7, refY: 4, orient: 'auto', markerUnits: 'userSpaceOnUse',
    }, defs);
    node('path', {d: 'M0 0 L8 4 L0 8 Z', fill: '#000'}, axisArrow);

    const floor = [project(0, -range), project(1, -range), project(1, range), project(0, range)];
    node('polygon', {
      points: floor.map(point => point.join(',')).join(' '),
      fill: '#f7f9fb', stroke: '#d4dce5', 'stroke-width': 1,
    });
    for (const t of [0.25, 0.5, 0.75]) {
      line(project(t, -range), project(t, range), {stroke: '#e0e6ec', 'stroke-width': 1});
    }
    line(project(0, -range), project(0, range), {
      stroke: '#000', 'stroke-width': 1.4, 'marker-end': 'url(#brownian-density-axis-arrow)',
    });
    line(project(0, 0), project(1, 0), {
      stroke: '#000', 'stroke-width': 1.4, 'marker-end': 'url(#brownian-density-axis-arrow)',
    });
    line(project(0, 0), project(0, 0, 1.15), {stroke: '#000', 'stroke-width': 1.4});
    label('0', [origin[0] - 12, origin[1] + 17]);
    const timeEnd = project(1, 0);
    label('t', [timeEnd[0] + 8, timeEnd[1] + 20], {'font-style': 'italic'});
    const valueEnd = project(0, range);
    label('x', [valueEnd[0] - 8, valueEnd[1] + 15], {'font-style': 'italic'});
    const densityEnd = project(0, 0, 1.15);
    label('density', [densityEnd[0] - 4, densityEnd[1] - 9], {'text-anchor': 'middle'});

    const clip = node('clipPath', {id: 'brownian-density-clip'}, defs);
    node('rect', {x: 2, y: 2, width: w - 4, height: h - 4}, clip);
    trailReveal = null;
    trailGroup = svg;
    if (w < 450) {
      const trailClip = node('clipPath', {id: 'brownian-density-trail-reveal'}, defs);
      trailReveal = node('polygon', {points: ''}, trailClip);
    }
    const densityGroup = node('g', {'clip-path': 'url(#brownian-density-clip)'});
    densityFill = node('path', {fill: '#8561b5', 'fill-opacity': 0.19, stroke: 'none'}, densityGroup);
    densityLine = node('path', {
      fill: 'none', stroke: '#764eab', 'stroke-width': 2.5, 'stroke-linejoin': 'round',
    }, densityGroup);
    pointMass = node('circle', {
      cx: origin[0], cy: origin[1], r: 6, fill: 'none',
      stroke: '#764eab', 'stroke-width': 2,
    });
    if (trailReveal) trailGroup = node('g', {'clip-path': 'url(#brownian-density-trail-reveal)'});

    trails = [];
    pathDots = [];
    cumulatives = [];
    totals = [];
    const multiple = paths.length > 1;
    paths.forEach(path => {
      const coordinates = new Float32Array((steps + 1) * 2);
      const cumulative = new Float32Array(steps + 1);
      const commands = [];
      for (let i = 0; i <= steps; i++) {
        const [x, y] = project(i / steps, path[i]);
        coordinates[2 * i] = Number(x.toFixed(3));
        coordinates[2 * i + 1] = Number(y.toFixed(3));
        if (i) {
          cumulative[i] = cumulative[i - 1] + Math.hypot(
            coordinates[2 * i] - coordinates[2 * (i - 1)],
            coordinates[2 * i + 1] - coordinates[2 * (i - 1) + 1],
          );
        }
        commands.push(`${i ? 'L' : 'M'}${coordinates[2 * i]},${coordinates[2 * i + 1]}`);
      }
      cumulatives.push(cumulative);
      totals.push(cumulative[steps]);
      trails.push(node('path', {
        d: commands.join(' '), fill: 'none', stroke: '#205c93',
        'stroke-width': multiple ? (paths.length > 10 ? 1.4 : 1.8) : 2.2,
        'stroke-opacity': multiple ? (paths.length > 10 ? 0.52 : 0.72) : 1,
        'stroke-linejoin': 'round',
      }, trailGroup));
      pathDots.push(node('circle', {
        r: multiple ? (paths.length > 10 ? 2.4 : 3) : 4,
        fill: '#205c93', 'fill-opacity': multiple ? 0.8 : 1,
      }));
    });
    draw();
  }

  function draw() {
    const t = progress;
    const timeText = t > 0 && t < 0.01 ? t.toFixed(3) : t.toFixed(2);
    clock.textContent = `t = ${timeText}`;
    if (!paths.length) {
      densityFill.setAttribute('visibility', 'hidden');
      densityLine.setAttribute('visibility', 'hidden');
      pointMass.setAttribute('visibility', 'visible');
      distribution.textContent = 'B(0)=0.';
      return;
    }

    const position = t * steps;
    const index = Math.min(steps, Math.floor(position));
    const next = Math.min(steps, index + 1);
    const fraction = position - index;
    if (trailReveal) {
      const revealBoundary = Math.max(0, t);
      const revealPoints = [
        project(0, -range),
        project(revealBoundary, -range),
        project(revealBoundary, range),
        project(0, range),
      ];
      trailReveal.setAttribute('points', revealPoints.map(point => point.join(',')).join(' '));
      trailGroup.setAttribute('visibility', t === 0 ? 'hidden' : 'visible');
    }
    paths.forEach((path, j) => {
      const value = path[index] + fraction * (path[next] - path[index]);
      const cumulative = cumulatives[j];
      const visible = cumulative[index] + fraction * (cumulative[next] - cumulative[index]);
      if (!trailReveal) {
        trails[j].setAttribute('stroke-dasharray', `${visible + (t === 1 ? 2 : 0)} ${totals[j] + 10}`);
      }
      const sample = project(t, value);
      pathDots[j].setAttribute('cx', sample[0]);
      pathDots[j].setAttribute('cy', sample[1]);
    });

    const atZero = t === 0;
    pointMass.setAttribute('visibility', atZero ? 'visible' : 'hidden');
    for (const element of [densityFill, densityLine]) {
      element.setAttribute('visibility', atZero ? 'hidden' : 'visible');
    }
    if (atZero) {
      distribution.textContent = 'B(0)=0.';
      return;
    }

    const curve = [];
    for (let i = 0; i <= curvePoints; i++) {
      const x = -range + 2 * range * i / curvePoints;
      curve.push(project(t, x, density(x, t)));
    }
    const point = ([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`;
    const curvePath = `M${point(curve[0])} ` + curve.slice(1).map(p => `L${point(p)}`).join(' ');
    densityLine.setAttribute('d', curvePath);
    densityFill.setAttribute('d',
      `M${point(project(t, -range))} ${curvePath.replace(/^M/, 'L')} L${point(project(t, range))} Z`,
    );
    distribution.innerHTML = `B(t) <span class="brownian-sim">∼</span> <span class="brownian-calN">N</span>(0, ${timeText}).`;
  }

  function tick(time) {
    if (!running) return;
    if (last !== null) progress = Math.min(1, progress + (time - last) / (1000 * Number(duration.value)));
    last = time;
    draw();
    if (progress < 1) frame = requestAnimationFrame(tick);
    else {
      stop();
      pause.disabled = true;
      pause.textContent = 'Pause';
      status.textContent = paths.length === 1 ? 'Complete. Replay this path or draw a new one.' : 'Complete. Replay these paths or draw new ones.';
    }
  }

  function play() {
    running = true;
    last = null;
    pause.disabled = false;
    pause.textContent = 'Pause';
    status.textContent = paths.length === 1 ? 'Tracing Brownian path' : `Tracing ${paths.length} Brownian paths`;
    frame = requestAnimationFrame(tick);
  }

  start.addEventListener('click', () => {
    stop();
    const n = Math.max(1, Math.min(20, Math.round(Number(count.value) || 1)));
    count.value = n;
    paths = Array.from({length: n}, () => {
      const path = new Float64Array(steps + 1);
      for (let i = 1; i <= steps; i++) path[i] = path[i - 1] + normal() / Math.sqrt(steps);
      return path;
    });
    let maximum = 0;
    paths.forEach(path => path.forEach(value => { maximum = Math.max(maximum, Math.abs(value)); }));
    range = Math.max(3.2, Math.ceil(maximum * 1.1 * 2) / 2);
    progress = 0;
    replay.disabled = false;
    clear.disabled = false;
    build();
    play();
  });
  pause.addEventListener('click', () => {
    if (running) {
      stop();
      pause.textContent = 'Resume';
      status.textContent = 'Paused.';
    } else play();
  });
  replay.addEventListener('click', () => {
    stop();
    progress = 0;
    draw();
    play();
  });
  clear.addEventListener('click', () => {
    stop();
    paths = [];
    range = 3.2;
    progress = 0;
    pause.disabled = true;
    replay.disabled = true;
    clear.disabled = true;
    pause.textContent = 'Pause';
    status.textContent = 'Cleared. Ready to draw again.';
    build();
  });
  document.addEventListener('visibilitychange', () => { last = null; });
  new ResizeObserver(build).observe(svg);
  build();
})();
