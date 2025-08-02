 document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("menu");

  // Inicializa atributo aria
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", "Abrir menu");

  const closeMenu = () => {
    menu.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    menu.classList.add("open");
    menuBtn.setAttribute("aria-expanded", "true");
  };

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (menu.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Impede o clique dentro do menu de fechá-lo imediatamente
  menu.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Fecha ao clicar fora
  document.addEventListener("click", () => {
    closeMenu();
  });

  // Fecha com Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
    }
  });
});