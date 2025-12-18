// theme-init.js
(function () {
  try {
    var saved = localStorage.getItem("theme");
    document.documentElement.dataset.theme =
      saved === "dark" ? "dark" : "light";
  } catch (e) {}
})();
