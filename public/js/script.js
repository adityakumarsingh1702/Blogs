document.addEventListener("DOMContentLoaded", function () {

  const allButtons = document.querySelectorAll(".searchBtn");
  const searchBar = document.querySelector(".searchBar");
  const searchInput = document.getElementById("searchInput");
  const searchClose = document.getElementById("searchClose");

  // Open search
  allButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      if (!searchBar || !searchInput) return;

      searchBar.style.visibility = "visible";
      searchBar.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      searchInput.focus();
    });
  });

  // Close search
  if (searchClose && searchBar) {
    searchClose.addEventListener("click", function () {
      searchBar.style.visibility = "hidden";
      searchBar.classList.remove("open");
      allButtons.forEach(btn => btn.setAttribute("aria-expanded", "false"));
    });
  }

});
