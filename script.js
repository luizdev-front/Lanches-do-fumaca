// Seleciona os elementos
const menuToggle = document.getElementById("menuToggle");
const navbar = document.getElementById("navbar");

// Alterna o menu no clique
menuToggle.addEventListener("click", () => {
  const isOpen = navbar.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
});