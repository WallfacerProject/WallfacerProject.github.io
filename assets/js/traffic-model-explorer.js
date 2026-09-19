(() => {
  "use strict";

  const ROOT_ID = "traffic-model-explorer";
  const SVG_NS = "http://www.w3.org/2000/svg";
  const TAU_MAX = 2;
  const SAMPLE_COUNT = 1001;
  const TRAJECTORY_SAMPLES = 240;
  const COLORS = {
    uncapped: "#0077c8",
    capped: "#b509ac",
    missed: "#d95f02",
  };

  function continuousUncapped(tau, greenTime, acceleration, carLength) {
    const b = (2 * carLength) / acceleration;
    const denominator = Math.sqrt(b + 4 * tau * greenTime) + Math.sqrt(b);
    return Math.pow((2 * greenTime) / denominator, 2);
  }

  function continuousCapped(tau, greenTime, acceleration, carLength, maximumSpeed) {
    const accelerationDistanceInCars = (maximumSpeed * maximumSpeed) / (2 * acceleration * carLength);
    const transitionTime = maximumSpeed / acceleration + accelerationDistanceInCars * tau;

    if (greenTime <= transitionTime) {
      return continuousUncapped(tau, greenTime, acceleration, carLength);
    }

    return (greenTime - maximumSpeed / (2 * acceleration)) / (tau + carLength / maximumSpeed);
  }

  function integerCount(value) {
    return Math.max(0, Math.floor(value + 1e-10));
  }

  function cappedDistance(elapsed, acceleration, maximumSpeed) {
    if (elapsed <= 0) return 0;
    const accelerationTime = maximumSpeed / acceleration;
    if (elapsed <= accelerationTime) return 0.5 * acceleration * elapsed * elapsed;
    return maximumSpeed * elapsed - (maximumSpeed * maximumSpeed) / (2 * acceleration);
  }

  function svgElement(name, attributes = {}, text = "") {
    const element = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    if (text) element.textContent = text;
    return element;
  }

  function niceTickStep(maximum, targetTicks = 5) {
    const roughStep = Math.max(maximum, 1) / targetTicks;
    const power = Math.pow(10, Math.floor(Math.log10(roughStep)));
    const normalized = roughStep / power;
    let multiplier = 1;
    if (normalized > 5) multiplier = 10;
    else if (normalized > 2) multiplier = 5;
    else if (normalized > 1) multiplier = 2;
    return multiplier * power;
  }

  function stepPath(values, xScale, yScale) {
    let path = `M${xScale(values[0].tau)},${yScale(values[0].count)}`;
    for (let index = 1; index < values.length; index += 1) {
      path += `H${xScale(values[index].tau)}V${yScale(values[index].count)}`;
    }
    return path;
  }

  function linePath(points, xScale, yScale) {
    return points.map((point, index) => `${index === 0 ? "M" : "L"}${xScale(point.time)},${yScale(point.position)}`).join("");
  }

  function init() {
    const root = document.getElementById(ROOT_ID);
    if (!root || root.dataset.initialized === "true") return;
    root.dataset.initialized = "true";

    const charts = {
      throughput: root.querySelector("[data-traffic-chart='throughput']"),
      spaceTime: root.querySelector("[data-traffic-chart='space-time']"),
    };
    const readouts = {
      throughput: root.querySelector("[data-traffic-readout='throughput']"),
      spaceTime: root.querySelector("[data-traffic-readout='space-time']"),
    };
    const panels = {
      throughput: root.querySelector("[data-traffic-panel='throughput']"),
      spaceTime: root.querySelector("[data-traffic-panel='space-time']"),
    };
    const viewButtons = Array.from(root.querySelectorAll("[data-traffic-view]"));
    const presetButtons = Array.from(root.querySelectorAll("[data-traffic-preset]"));
    const controls = {
      greenTime: root.querySelector("[data-parameter='green-time']"),
      acceleration: root.querySelector("[data-parameter='acceleration']"),
      carLength: root.querySelector("[data-parameter='car-length']"),
      maximumSpeed: root.querySelector("[data-parameter='maximum-speed']"),
      selectedTau: root.querySelector("[data-parameter='selected-tau']"),
    };
    const outputs = {
      greenTime: root.querySelector("[data-value='green-time']"),
      acceleration: root.querySelector("[data-value='acceleration']"),
      carLength: root.querySelector("[data-value='car-length']"),
      maximumSpeed: root.querySelector("[data-value='maximum-speed']"),
      selectedTau: root.querySelector("[data-value='selected-tau']"),
    };

    let activeView = "throughput";
    let throughputGeometry = null;
    let tauDragPointer = null;

    const presets = {
      "reaction-dominated": {
        greenTime: 40,
        acceleration: 2,
        carLength: 5,
        maximumSpeed: 15,
        selectedTau: 1,
      },
      "speed-cap-dominated": {
        greenTime: 40,
        acceleration: 2,
        carLength: 5,
        maximumSpeed: 15,
        selectedTau: 0.25,
      },
    };

    function parameters() {
      return {
        greenTime: Number(controls.greenTime.value),
        acceleration: Number(controls.acceleration.value),
        carLength: Number(controls.carLength.value),
        maximumSpeed: Number(controls.maximumSpeed.value),
        selectedTau: Number(controls.selectedTau.value),
      };
    }

    function updateControlLabels(values) {
      outputs.greenTime.value = `${values.greenTime.toFixed(0)} s`;
      outputs.greenTime.textContent = outputs.greenTime.value;
      outputs.acceleration.value = `${values.acceleration.toFixed(1)} m/s²`;
      outputs.acceleration.textContent = outputs.acceleration.value;
      outputs.carLength.value = `${values.carLength.toFixed(1)} m`;
      outputs.carLength.textContent = outputs.carLength.value;
      outputs.maximumSpeed.value = `${values.maximumSpeed.toFixed(0)} m/s`;
      outputs.maximumSpeed.textContent = outputs.maximumSpeed.value;
      outputs.selectedTau.value = `${values.selectedTau.toFixed(2)} s`;
      outputs.selectedTau.textContent = outputs.selectedTau.value;
    }

    function updatePresetState(activePreset = null) {
      presetButtons.forEach((button) => {
        const selected = button.dataset.trafficPreset === activePreset;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
    }

    function applyPreset(name) {
      const preset = presets[name];
      if (!preset) return;
      controls.greenTime.value = String(preset.greenTime);
      controls.acceleration.value = String(preset.acceleration);
      controls.carLength.value = String(preset.carLength);
      controls.maximumSpeed.value = String(preset.maximumSpeed);
      controls.selectedTau.value = String(preset.selectedTau);
      updatePresetState(name);
      drawActiveView();
    }

    function chartDimensions(chart, aspectRatio) {
      const width = Math.max(320, Math.round(chart.getBoundingClientRect().width || 520));
      const height = Math.round(Math.max(300, Math.min(420, width * aspectRatio)));
      return { width, height, compact: width < 520 };
    }

    function drawThroughput(values) {
      const chart = charts.throughput;
      const uncapped = [];
      const capped = [];
      let maximumCount = 0;

      for (let index = 0; index < SAMPLE_COUNT; index += 1) {
        const tau = (TAU_MAX * index) / (SAMPLE_COUNT - 1);
        const uncappedCount = integerCount(continuousUncapped(tau, values.greenTime, values.acceleration, values.carLength));
        const cappedCount = integerCount(continuousCapped(tau, values.greenTime, values.acceleration, values.carLength, values.maximumSpeed));
        uncapped.push({ tau, count: uncappedCount });
        capped.push({ tau, count: cappedCount });
        maximumCount = Math.max(maximumCount, uncappedCount, cappedCount);
      }

      const { width, height, compact } = chartDimensions(chart, 0.64);
      const margin = { top: 20, right: compact ? 12 : 18, bottom: 54, left: compact ? 58 : 68 };
      const plotWidth = width - margin.left - margin.right;
      const plotHeight = height - margin.top - margin.bottom;
      const tickStep = niceTickStep(Math.max(1, maximumCount), compact ? 4 : 5);
      const yMaximum = Math.max(tickStep, Math.ceil(maximumCount / tickStep) * tickStep);
      const xScale = (tau) => margin.left + (tau / TAU_MAX) * plotWidth;
      const yScale = (count) => margin.top + plotHeight - (count / yMaximum) * plotHeight;

      throughputGeometry = { width, margin, plotWidth };

      const svg = svgElement("svg", {
        viewBox: `0 0 ${width} ${height}`,
        width,
        height,
        role: "img",
        "aria-label": "Interactive capped and uncapped traffic throughput curves",
      });
      svg.appendChild(
        svgElement(
          "desc",
          {},
          "Two integer-valued step curves show cars through the green light as reaction time varies from zero to two seconds. The dashed reaction-time guide can be dragged."
        )
      );

      const axes = svgElement("g");
      axes.appendChild(
        svgElement("line", {
          x1: margin.left,
          y1: margin.top + plotHeight,
          x2: margin.left + plotWidth,
          y2: margin.top + plotHeight,
          class: "traffic-axis",
        })
      );
      axes.appendChild(
        svgElement("line", {
          x1: margin.left,
          y1: margin.top,
          x2: margin.left,
          y2: margin.top + plotHeight,
          class: "traffic-axis",
        })
      );

      const xTicks = compact ? [0, 0.5, 1, 1.5, 2] : [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
      xTicks.forEach((tick) => {
        const x = xScale(tick);
        axes.appendChild(
          svgElement("line", {
            x1: x,
            y1: margin.top + plotHeight,
            x2: x,
            y2: margin.top + plotHeight + 5,
            class: "traffic-tick",
          })
        );
        axes.appendChild(
          svgElement(
            "text",
            {
              x,
              y: margin.top + plotHeight + 20,
              "text-anchor": "middle",
              "font-size": compact ? 11 : 12,
            },
            tick.toFixed(tick % 1 === 0 ? 1 : 2)
          )
        );
      });

      for (let tick = 0; tick <= yMaximum + tickStep / 2; tick += tickStep) {
        const y = yScale(tick);
        axes.appendChild(
          svgElement("line", {
            x1: margin.left - 5,
            y1: y,
            x2: margin.left,
            y2: y,
            class: "traffic-tick",
          })
        );
        axes.appendChild(
          svgElement(
            "text",
            {
              x: margin.left - 9,
              y: y + 4,
              "text-anchor": "end",
              "font-size": compact ? 11 : 12,
            },
            String(tick)
          )
        );
      }

      axes.appendChild(
        svgElement(
          "text",
          {
            x: margin.left + plotWidth / 2,
            y: height - 10,
            "text-anchor": "middle",
            "font-size": compact ? 12 : 14,
          },
          "Reaction time τ [s]"
        )
      );
      axes.appendChild(
        svgElement(
          "text",
          {
            x: 15,
            y: margin.top + plotHeight / 2,
            transform: `rotate(-90 15 ${margin.top + plotHeight / 2})`,
            "text-anchor": "middle",
            "font-size": compact ? 12 : 14,
          },
          "Cars through the green light"
        )
      );
      svg.appendChild(axes);

      svg.appendChild(
        svgElement("path", {
          d: stepPath(uncapped, xScale, yScale),
          fill: "none",
          stroke: COLORS.uncapped,
          "stroke-width": 2.2,
          "vector-effect": "non-scaling-stroke",
          "stroke-linejoin": "round",
        })
      );
      svg.appendChild(
        svgElement("path", {
          d: stepPath(capped, xScale, yScale),
          fill: "none",
          stroke: COLORS.capped,
          "stroke-width": 2.6,
          "vector-effect": "non-scaling-stroke",
          "stroke-linejoin": "round",
        })
      );

      const selectedUncapped = integerCount(continuousUncapped(values.selectedTau, values.greenTime, values.acceleration, values.carLength));
      const selectedCapped = integerCount(
        continuousCapped(values.selectedTau, values.greenTime, values.acceleration, values.carLength, values.maximumSpeed)
      );
      const selectedX = xScale(values.selectedTau);

      svg.appendChild(
        svgElement("line", {
          x1: selectedX,
          y1: margin.top,
          x2: selectedX,
          y2: margin.top + plotHeight,
          class: "traffic-selected-guide",
        })
      );
      svg.appendChild(
        svgElement("line", {
          x1: selectedX,
          y1: margin.top,
          x2: selectedX,
          y2: margin.top + plotHeight,
          class: "traffic-tau-drag-target",
          "data-tau-drag": "true",
        })
      );

      const labelOnRight = values.selectedTau > TAU_MAX * 0.7;
      svg.appendChild(
        svgElement(
          "text",
          {
            x: selectedX + (labelOnRight ? -7 : 7),
            y: margin.top + 14,
            "text-anchor": labelOnRight ? "end" : "start",
            "font-size": compact ? 11 : 12,
            class: "traffic-selected-label",
          },
          `drag τ = ${values.selectedTau.toFixed(2)} s`
        )
      );
      svg.appendChild(
        svgElement("circle", {
          cx: selectedX,
          cy: yScale(selectedUncapped),
          r: compact ? 4.5 : 5.5,
          fill: COLORS.uncapped,
          stroke: "var(--global-bg-color)",
          "stroke-width": 1.5,
          "vector-effect": "non-scaling-stroke",
          "pointer-events": "none",
        })
      );
      const cappedY = yScale(selectedCapped);
      const diamondRadius = compact ? 5 : 6;
      svg.appendChild(
        svgElement("path", {
          d: `M${selectedX},${cappedY - diamondRadius}L${selectedX + diamondRadius},${cappedY}L${selectedX},${cappedY + diamondRadius}L${
            selectedX - diamondRadius
          },${cappedY}Z`,
          fill: COLORS.capped,
          stroke: "var(--global-bg-color)",
          "stroke-width": 1.5,
          "vector-effect": "non-scaling-stroke",
          "pointer-events": "none",
        })
      );

      chart.replaceChildren(svg);

      const accelerationDistanceInCars = (values.maximumSpeed * values.maximumSpeed) / (2 * values.acceleration * values.carLength);
      const transitionTime = values.maximumSpeed / values.acceleration + accelerationDistanceInCars * values.selectedTau;
      const branch = values.greenTime <= transitionTime ? "accelerating" : "cruising";
      const reduction = Math.max(0, selectedUncapped - selectedCapped);
      let branchText;

      if (branch === "accelerating") {
        branchText =
          "The unrounded throughput threshold is in the <strong>accelerating</strong> branch, so the speed cap does not affect the count.";
      } else if (reduction === 0) {
        branchText =
          "The unrounded throughput threshold is in the <strong>cruising</strong> branch; the speed cap lowers that threshold, but both values still round down to the same car count.";
      } else {
        branchText =
          `The unrounded throughput threshold is in the <strong>cruising</strong> branch; the speed cap reduces the selected throughput by ` +
          `<strong>${reduction}</strong> ${reduction === 1 ? "car" : "cars"} (<strong>${(
            (100 * reduction) /
            selectedUncapped
          ).toFixed(1)}%</strong> relative to the uncapped count).`;
      }

      readouts.throughput.innerHTML =
        `At <strong>τ = ${values.selectedTau.toFixed(2)} s</strong>, ` +
        `<strong>${selectedUncapped}</strong> cars clear without a speed cap and ` +
        `<strong>${selectedCapped}</strong> clear with the cap. ${branchText}`;
    }

    function drawSpaceTime(values) {
      const chart = charts.spaceTime;
      const lastCar = integerCount(
        continuousCapped(values.selectedTau, values.greenTime, values.acceleration, values.carLength, values.maximumSpeed)
      );
      const firstMiss = lastCar + 1;
      const earlierCars = Array.from({ length: Math.max(0, lastCar - 1) }, (_, index) => index + 1);
      const trajectorySamples = Math.max(48, Math.min(TRAJECTORY_SAMPLES, Math.floor(24000 / firstMiss)));
      const { width, height, compact } = chartDimensions(chart, 0.68);
      const margin = { top: 22, right: compact ? 18 : 24, bottom: 56, left: compact ? 68 : 78 };
      const plotWidth = width - margin.left - margin.right;
      const plotHeight = height - margin.top - margin.bottom;
      const yMinimum = -1.03 * firstMiss * values.carLength;
      const yMaximum = Math.max(2, 0.025 * firstMiss * values.carLength);
      const xScale = (time) => margin.left + (time / values.greenTime) * plotWidth;
      const yScale = (position) => margin.top + ((yMaximum - position) / (yMaximum - yMinimum)) * plotHeight;

      function trajectory(carNumber) {
        const points = [];
        let previous = null;
        for (let index = 0; index <= trajectorySamples; index += 1) {
          const time = (values.greenTime * index) / trajectorySamples;
          const elapsed = Math.max(0, time - carNumber * values.selectedTau);
          const position = -carNumber * values.carLength + cappedDistance(elapsed, values.acceleration, values.maximumSpeed);
          const point = { time, position };

          if (position > 0 && previous) {
            const fraction = -previous.position / (position - previous.position);
            points.push({
              time: previous.time + fraction * (time - previous.time),
              position: 0,
            });
            break;
          }

          points.push(point);
          previous = point;
        }
        return points;
      }

      const svg = svgElement("svg", {
        viewBox: `0 0 ${width} ${height}`,
        width,
        height,
        role: "img",
        "aria-label": "Interactive capped-speed space-time diagram",
      });
      svg.appendChild(
        svgElement(
          "desc",
          {},
          `Rear-bumper trajectories for a speed-capped traffic queue. Car ${lastCar} is the last to pass and car ${firstMiss} is the first to miss.`
        )
      );

      const axes = svgElement("g");
      const bottom = margin.top + plotHeight;
      axes.appendChild(
        svgElement("line", {
          x1: margin.left,
          y1: bottom,
          x2: margin.left + plotWidth,
          y2: bottom,
          class: "traffic-axis",
        })
      );
      axes.appendChild(
        svgElement("line", {
          x1: margin.left,
          y1: margin.top,
          x2: margin.left,
          y2: bottom,
          class: "traffic-axis",
        })
      );

      const xTickCount = compact ? 4 : 5;
      for (let index = 0; index <= xTickCount; index += 1) {
        const tick = (values.greenTime * index) / xTickCount;
        const x = xScale(tick);
        axes.appendChild(
          svgElement("line", {
            x1: x,
            y1: bottom,
            x2: x,
            y2: bottom + 5,
            class: "traffic-tick",
          })
        );
        axes.appendChild(
          svgElement(
            "text",
            {
              x,
              y: bottom + 20,
              "text-anchor": "middle",
              "font-size": compact ? 11 : 12,
            },
            Number.isInteger(tick) ? tick.toFixed(0) : tick.toFixed(1)
          )
        );
      }

      const yTickStep = niceTickStep(Math.abs(yMinimum), compact ? 4 : 5);
      for (let tick = 0; tick >= yMinimum; tick -= yTickStep) {
        const y = yScale(tick);
        axes.appendChild(
          svgElement("line", {
            x1: margin.left - 5,
            y1: y,
            x2: margin.left,
            y2: y,
            class: "traffic-tick",
          })
        );
        axes.appendChild(
          svgElement(
            "text",
            {
              x: margin.left - 9,
              y: y + 4,
              "text-anchor": "end",
              "font-size": compact ? 11 : 12,
            },
            String(tick)
          )
        );
      }

      axes.appendChild(
        svgElement(
          "text",
          {
            x: margin.left + plotWidth / 2,
            y: height - 10,
            "text-anchor": "middle",
            "font-size": compact ? 12 : 14,
          },
          "Time since the light turns green, t [s]"
        )
      );
      axes.appendChild(
        svgElement(
          "text",
          {
            x: 15,
            y: margin.top + plotHeight / 2,
            transform: `rotate(-90 15 ${margin.top + plotHeight / 2})`,
            "text-anchor": "middle",
            "font-size": compact ? 11 : 13,
          },
          "Rear-bumper position relative to x₀ [m]"
        )
      );
      svg.appendChild(axes);

      earlierCars.forEach((carNumber) => {
        svg.appendChild(
          svgElement("path", {
            d: linePath(trajectory(carNumber), xScale, yScale),
            fill: "none",
            stroke: COLORS.uncapped,
            "stroke-width": 1.15,
            "stroke-opacity": 0.52,
            "vector-effect": "non-scaling-stroke",
          })
        );
      });
      svg.appendChild(
        svgElement("path", {
          d: linePath(trajectory(lastCar), xScale, yScale),
          fill: "none",
          stroke: COLORS.capped,
          "stroke-width": 2.5,
          "vector-effect": "non-scaling-stroke",
        })
      );
      svg.appendChild(
        svgElement("path", {
          d: linePath(trajectory(firstMiss), xScale, yScale),
          fill: "none",
          stroke: COLORS.missed,
          "stroke-width": 2.4,
          "stroke-dasharray": "7 5",
          "vector-effect": "non-scaling-stroke",
        })
      );

      const crossingY = yScale(0);
      svg.appendChild(
        svgElement("line", {
          x1: margin.left,
          y1: crossingY,
          x2: margin.left + plotWidth,
          y2: crossingY,
          class: "traffic-crossing-line",
        })
      );
      svg.appendChild(
        svgElement(
          "text",
          {
            x: margin.left + 6,
            y: crossingY - 6,
            "font-size": compact ? 11 : 12,
          },
          "crossing line x = x₀"
        )
      );

      const greenX = xScale(values.greenTime);
      svg.appendChild(
        svgElement("line", {
          x1: greenX,
          y1: bottom,
          x2: greenX,
          y2: crossingY,
          class: "traffic-green-end",
        })
      );
      svg.appendChild(
        svgElement(
          "text",
          {
            x: greenX - 6,
            y: bottom - 6,
            transform: `rotate(-90 ${greenX - 6} ${bottom - 6})`,
            "text-anchor": "start",
            "font-size": compact ? 11 : 12,
            class: "traffic-green-label",
          },
          "green ends"
        )
      );

      chart.replaceChildren(svg);

      readouts.spaceTime.innerHTML =
        `At <strong>τ = ${values.selectedTau.toFixed(2)} s</strong>, car ` +
        `<strong>${lastCar}</strong> is the last to pass and car ` +
        `<strong>${firstMiss}</strong> is the first to miss.`;
    }

    function drawActiveView() {
      const values = parameters();
      updateControlLabels(values);
      if (activeView === "throughput") drawThroughput(values);
      else drawSpaceTime(values);
    }

    function selectView(view) {
      activeView = view;
      panels.throughput.hidden = view !== "throughput";
      panels.spaceTime.hidden = view !== "space-time";
      viewButtons.forEach((button) => {
        const selected = button.dataset.trafficView === view;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      drawActiveView();
    }

    function setTauFromPointer(event) {
      if (!throughputGeometry) return;
      const bounds = charts.throughput.getBoundingClientRect();
      const svgX = ((event.clientX - bounds.left) / bounds.width) * throughputGeometry.width;
      const rawTau = ((svgX - throughputGeometry.margin.left) / throughputGeometry.plotWidth) * TAU_MAX;
      const step = Number(controls.selectedTau.step) || 0.05;
      const clamped = Math.max(0, Math.min(TAU_MAX, rawTau));
      const snapped = Math.round(clamped / step) * step;
      controls.selectedTau.value = snapped.toFixed(2);
      updatePresetState();
      drawActiveView();
    }

    charts.throughput.addEventListener("pointerdown", (event) => {
      if (!event.target.closest("[data-tau-drag]")) return;
      event.preventDefault();
      tauDragPointer = event.pointerId;
      charts.throughput.setPointerCapture(event.pointerId);
      setTauFromPointer(event);
    });
    charts.throughput.addEventListener("pointermove", (event) => {
      if (tauDragPointer !== event.pointerId) return;
      event.preventDefault();
      setTauFromPointer(event);
    });
    const finishTauDrag = (event) => {
      if (tauDragPointer !== event.pointerId) return;
      if (charts.throughput.hasPointerCapture(event.pointerId)) {
        charts.throughput.releasePointerCapture(event.pointerId);
      }
      tauDragPointer = null;
    };
    charts.throughput.addEventListener("pointerup", finishTauDrag);
    charts.throughput.addEventListener("pointercancel", finishTauDrag);

    Object.values(controls).forEach((control) =>
      control.addEventListener("input", () => {
        updatePresetState();
        drawActiveView();
      })
    );
    viewButtons.forEach((button) => button.addEventListener("click", () => selectView(button.dataset.trafficView)));
    presetButtons.forEach((button) => button.addEventListener("click", () => applyPreset(button.dataset.trafficPreset)));

    let resizeFrame = null;
    const resizeObserver = new ResizeObserver(() => {
      if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = null;
        drawActiveView();
      });
    });
    resizeObserver.observe(charts.throughput);
    resizeObserver.observe(charts.spaceTime);

    drawActiveView();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
