(function () {
  "use strict";

  const mobileQuery = window.matchMedia("(max-width: 768px)");
  let scheduled = false;

  function fitDisplayEquations() {
    scheduled = false;

    document.querySelectorAll('mjx-container[jax="CHTML"][display="true"]').forEach(function (equation) {
      const originalSize = equation.dataset.mobileOriginalFontSize;

      if (!mobileQuery.matches) {
        if (originalSize) equation.style.fontSize = originalSize;
        return;
      }

      if (!originalSize) {
        equation.dataset.mobileOriginalFontSize = equation.style.fontSize || "100%";
      } else {
        equation.style.fontSize = originalSize;
      }

      const availableWidth = equation.clientWidth;
      const contentWidth = equation.scrollWidth;
      if (availableWidth > 0 && contentWidth > availableWidth) {
        const currentSize = parseFloat(getComputedStyle(equation).fontSize);
        const fittedSize = currentSize * (availableWidth / contentWidth) * 0.98;
        equation.style.fontSize = fittedSize.toFixed(3) + "px";
      }
    });
  }

  function scheduleFit() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(fitDisplayEquations);
  }

  document.addEventListener("DOMContentLoaded", scheduleFit);
  window.addEventListener("load", scheduleFit);
  window.addEventListener("resize", scheduleFit);
  window.addEventListener("orientationchange", scheduleFit);

  new MutationObserver(scheduleFit).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleFit);
  }

  if (window.MathJax && window.MathJax.startup && window.MathJax.startup.promise) {
    window.MathJax.startup.promise.then(scheduleFit);
  }
})();
