(function () {
  let savedTheme = "light";
  try {
    savedTheme = localStorage.getItem("ukTheme") === "dark" ? "dark" : "light";
  } catch (error) {
    savedTheme = "light";
  }
  document.documentElement.setAttribute("data-theme", savedTheme);
})();
