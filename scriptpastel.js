document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (!menuToggle || !navMenu) return;

  // Toggle do menu
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation(); // impede que o clique suba para o document
    navMenu.classList.toggle("open");
    menuToggle.classList.toggle("active"); // muda estilo do botão
  });

  // Fecha menu ao clicar fora
  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && e.target !== menuToggle) {
      navMenu.classList.remove("open");
      menuToggle.classList.remove("active");
    }
  });

  // Fecha menu ao clicar em um link
  const links = navMenu.querySelectorAll("a");
  links.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      menuToggle.classList.remove("active");
    });
  });
});