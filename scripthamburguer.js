
document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("menu");

  // Alterna menu
  menuBtn.addEventListener("click", function () {
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
  });

  // Fecha o menu se clicar fora
  document.addEventListener("click", function (e) {
    if (!menu.contains(e.target) && e.target !== menuBtn) {
      menu.style.display = "none";
    }
  });

  // Função para adicionar ao carrinho (padronizado com "nome" e "preco")
  function adicionarAoCarrinho(item, preco) {
    if (!item) item = "Produto sem nome";
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push({ nome: item, preco }); // <<< aqui corrige o problema
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    alert(`${item} foi adicionado ao carrinho!`);
  }

  // Eventos nos botões de pedido
  document.querySelectorAll('.pedido-button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const button = e.currentTarget; // botão clicado
      const item = button.dataset.item || "Produto sem nome";
      const preco = parseFloat(button.dataset.preco) || 0;

      // Adiciona ao carrinho
      adicionarAoCarrinho(item, preco);

      // Redireciona para a página do carrinho
      window.location.href = "pedido.html"; 
    });
  });
});
