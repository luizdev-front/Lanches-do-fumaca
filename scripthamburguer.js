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
});

// Função para adicionar ao carrinho
function adicionarAoCarrinho(item, preco, event) {
  if (event) event.preventDefault();
  if (!item) item = "Produto sem nome";
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho.push({ item, preco });
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  alert(`${item} foi adicionado ao carrinho!`);
}
document.querySelectorAll('.pedido-button').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const item = btn.dataset.item || "Produto sem nome";
    const preco = parseFloat(btn.dataset.preco) || 0;
    
    // Adiciona ao carrinho
    adicionarAoCarrinho(item, preco);
    
    // Redireciona para a página do carrinho
    window.location.href = "pedido.html"; 
  });
});