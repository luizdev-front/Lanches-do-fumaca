  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("nav-menu");

  toggle.addEventListener("click", () => {
    // Alterna a visibilidade
    if (menu.style.display === "block") {
      menu.style.display = "none";
    } else {
      menu.style.display = "block";
    }
  });