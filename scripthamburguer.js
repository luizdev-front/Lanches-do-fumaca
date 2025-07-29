 document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("menu");

  menuBtn.addEventListener("click", function () {
    if (menu.style.display === "block") {
      menu.style.display = "none";
    } else {
      menu.style.display = "block";
    }
  });

  // Opcional: Esconde o menu se clicar fora dele
  document.addEventListener("click", function (e) {
    if (!menu.contains(e.target) && e.target !== menuBtn) {
      menu.style.display = "none";
    }
  });
});
