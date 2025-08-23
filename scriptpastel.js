function adicionarAoCarrinho(item, preco) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push({ item, preco });
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    alert(`${item} foi adicionado ao carrinho!`);
  }


  // Controle do menu
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    navMenu.classList.toggle("open");
  });

  // Fecha se clicar fora
  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && e.target !== menuToggle) {
      navMenu.classList.remove("open");
    }
  });

});
  function adicionarAoCarrinho(item, preco) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push({ item, preco });
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    alert(`${item} foi adicionado ao carrinho!`);
  }
 
