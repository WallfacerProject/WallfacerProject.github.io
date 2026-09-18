(() => {
  "use strict";

  const ROOT_ID = "traffic-model-explorer";
  const SVG_NS = "http://www.w3.org/2000/svg";
  const TAU_MAX = 2;
  const SAMPLE_COUNT = 1001;
  const COLORS = {
    uncapped: "#0077c8",
    capped: "#b509ac",
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

  function uncappedTrainCount(greenTime, acceleration, carLength) {
    return integerCount((acceleration * greenTime * greenTime) / (2 * carLength));
  }

  function cappedTrainCount(greenTime, acceleration, carLength, maximumSpeed) {
    const accelerationTime = maximumSpeed / acceleration;
    const distance =
      greenTime <= accelerationTime
        ? 0.5 * acceleration * greenTime * greenTime
        : maximumSpeed * greenTime - (maximumSpeed * maximumSpeed) / (2 * acceleration);
    return integerCount(distance / carLength);
  }

  function svgElement(name, attributes = {}, text = "") {
    const element = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    if (text) element.textContent = text;
    return element;
  }

  function niceTickStep(maximum, targetTicks = 5) {
    const roughStep = maximum / targetTicks;
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

  function init() {
    const root = document.getElementById(ROOT_ID);
    if (!root || root.dataset.initialized === "true") return;
    root.dataset.initialized = "true";

    const chart = root.querySelector("[data-traffic-chart]");
    const readout = root.querySelector("[data-traffic-readout]");
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

    function draw() {
      const values = parameters();
      updateControlLabels(values);

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

      const width = Math.max(320, Math.round(chart.getBoundingClientRect().width || 760));
      const height = Math.round(Math.max(320, Math.min(500, width * 0.62)));
      const compact = width < 520;
      const margin = {
        top: 20,
        right: compact ? 14 : 24,
        bottom: 58,
        left: compact ? 58 : 72,
      };
      const plotWidth = width - margin.left - margin.right;
      const plotHeight = height - margin.top - margin.bottom;

      const tickStep = niceTickStep(Math.max(1, maximumCount), compact ? 4 : 5);
      const yMaximum = Math.max(tickStep, Math.ceil(maximumCount / tickStep) * tickStep);
      const xScale = (tau) => margin.left + (tau / TAU_MAX) * plotWidth;
      const yScale = (count) => margin.top + plotHeight - (count / yMaximum) * plotHeight;

      const svg = svgElement("svg", {
        viewBox: `0 0 ${width} ${height}`,
        width,
        height,
        role: "img",
        "aria-label": "Interactive capped and uncapped traffic throughput curves",
      });
      svg.appendChild(
        svgElement("desc", {}, "Two integer-valued step curves show cars through the green light as reaction time varies from zero to two seconds.")
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
              y: margin.top + plotHeight + 22,
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
            y: height - 12,
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
            x: 16,
            y: margin.top + plotHeight / 2,
            transform: `rotate(-90 16 ${margin.top + plotHeight / 2})`,
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
      const labelOnRight = values.selectedTau > TAU_MAX * 0.78;
      svg.appendChild(
        svgElement(
          "text",
          {
            x: selectedX + (labelOnRight ? -6 : 6),
            y: margin.top + 14,
            "text-anchor": labelOnRight ? "end" : "start",
            "font-size": compact ? 11 : 12,
            class: "traffic-selected-label",
          },
          `τ = ${values.selectedTau.toFixed(2)} s`
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
        })
      );

      chart.replaceChildren(svg);

      const uncappedTrain = uncappedTrainCount(values.greenTime, values.acceleration, values.carLength);
      const cappedTrain = cappedTrainCount(values.greenTime, values.acceleration, values.carLength, values.maximumSpeed);
      const efficiency = cappedTrain > 0 ? (100 * selectedCapped) / cappedTrain : 0;
      const accelerationDistanceInCars = (values.maximumSpeed * values.maximumSpeed) / (2 * values.acceleration * values.carLength);
      const transitionTime = values.maximumSpeed / values.acceleration + accelerationDistanceInCars * values.selectedTau;
      const branch = values.greenTime <= transitionTime ? "accelerating" : "cruising";

      readout.innerHTML =
        `At <strong>τ = ${values.selectedTau.toFixed(2)} s</strong>, ` +
        `<strong>${selectedUncapped}</strong> cars clear without a speed cap and ` +
        `<strong>${selectedCapped}</strong> clear with the cap. ` +
        `The corresponding train throughputs are <strong>${uncappedTrain}</strong> and ` +
        `<strong>${cappedTrain}</strong>, and the capped relative efficiency is ` +
        `<strong>${efficiency.toFixed(1)}%</strong>. The capped count is in the ${branch} branch.`;
    }

    Object.values(controls).forEach((control) => control.addEventListener("input", draw));

    let resizeFrame = null;
    const resizeObserver = new ResizeObserver(() => {
      if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = null;
        draw();
      });
    });
    resizeObserver.observe(chart);

    draw();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
