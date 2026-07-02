// Wrap DMath.katexLoadedCallback to fix dark mode colors after KaTeX renders.
// Must run before d-front-matter is parsed (which triggers DMath.addKatex),
// so this is placed at the top level, not inside $(document).ready.
if (window.DMath) {
  var _originalKatexCallback = DMath.katexLoadedCallback;
  DMath.katexLoadedCallback = function () {
    _originalKatexCallback.call(DMath);
    _applyKatexDarkMode();
  };
}

function _applyKatexDarkMode() {
  var isDark = document.documentElement.getAttribute("data-theme") === "dark";
  document.querySelectorAll(".katex").forEach(function (el) {
    if (isDark) {
      el.style.setProperty("color", "var(--global-text-color)", "important");
    } else {
      el.style.removeProperty("color");
    }
  });
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
  // Override styles of inline math (d-math shadow DOM hardcodes rgba(0,0,0,0.8)).
  document.querySelectorAll("d-math").forEach(function (math) {
    if (math.shadowRoot) {
      var style = math.shadowRoot.querySelector("style");
      if (style) {
        style.sheet.insertRule(".katex, .katex * { color: inherit !important; }");
      } else {
        var newStyle = document.createElement("style");
        newStyle.textContent = ".katex, .katex * { color: inherit !important; }";
        math.shadowRoot.insertBefore(newStyle, math.shadowRoot.firstChild);
      }
    }
  });
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

  // Re-apply KaTeX dark mode colors when the user toggles the theme.
  new MutationObserver(_applyKatexDarkMode).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
});
