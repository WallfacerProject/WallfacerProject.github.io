function _patchDistillMathColors() {
  document.querySelectorAll(".katex").forEach(function (el) {
    el.style.setProperty("color", "var(--global-text-color)", "important");
  });

  document.querySelectorAll("d-math").forEach(function (math) {
    if (!math.shadowRoot || math.shadowRoot.querySelector("style[data-al-folio-math-color]")) return;

    var style = document.createElement("style");
    style.setAttribute("data-al-folio-math-color", "");
    style.textContent = ".katex, .katex * { color: inherit !important; }";
    math.shadowRoot.appendChild(style);
  });
}

if (window.DMath) {
  var _originalKatexCallback = DMath.katexLoadedCallback;
  DMath.katexLoadedCallback = function () {
    _originalKatexCallback.call(DMath);
    _patchDistillMathColors();
    window.setTimeout(_patchDistillMathColors, 0);
  };
}

$(document).ready(function () {
  // Override styles of the footnotes.
  document.querySelectorAll("d-footnote").forEach(function (footnote) {
    footnote.shadowRoot.querySelector("sup > span").setAttribute("style", "color: var(--global-theme-color);");
    footnote.shadowRoot
      .querySelector("d-hover-box")
      .shadowRoot.querySelector("style")
      .sheet.insertRule(".panel {background-color: var(--global-bg-color) !important;}");
    footnote.shadowRoot
      .querySelector("d-hover-box")
      .shadowRoot.querySelector("style")
      .sheet.insertRule(".panel {border-color: var(--global-divider-color) !important;}");
  });
  _patchDistillMathColors();
  // Override styles of the citations.
  document.querySelectorAll("d-cite").forEach(function (cite) {
    cite.shadowRoot.querySelector("div > span").setAttribute("style", "color: var(--global-theme-color);");
    cite.shadowRoot.querySelector("style").sheet.insertRule("ul li a {color: var(--global-text-color) !important; text-decoration: none;}");
    cite.shadowRoot.querySelector("style").sheet.insertRule("ul li a:hover {color: var(--global-theme-color) !important;}");
    cite.shadowRoot
      .querySelector("d-hover-box")
      .shadowRoot.querySelector("style")
      .sheet.insertRule(".panel {background-color: var(--global-bg-color) !important;}");
    cite.shadowRoot
      .querySelector("d-hover-box")
      .shadowRoot.querySelector("style")
      .sheet.insertRule(".panel {border-color: var(--global-divider-color) !important;}");
  });

  new MutationObserver(_patchDistillMathColors).observe(document.body, {
    childList: true,
    subtree: true,
  });
});
