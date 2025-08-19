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

  document.addEventListener("DOMContentLoaded", function () {
    const menuBtn = document.getElementById("menuBtn");
    const menu = document.getElementById("menu");

    menuBtn.addEventListener("click", function () {
      menu.style.display = (menu.style.display === "block") ? "none" : "block";
    });

    document.addEventListener("click", function (e) {
      if (!menu.contains(e.target) && e.target !== menuBtn) {
        menu.style.display = "none";
      }
    });
  });

  function adicionarAoCarrinho(item, preco, event) {
    if (event) event.preventDefault();
    if (!item) item = "Produto sem nome";
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push({ item, preco });
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    alert(`${item} foi adicionado ao carrinho!`);
  }

