// Menu Mobile toggle
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('menu');

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('open');
    });
  }

  // Fecha o menu ao clicar fora
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== menuBtn) {
      menu.classList.remove('open');
    }
  });

  // Função para adicionar ao carrinho
  function adicionarAoCarrinho(item, preco) {
    if (!item) return;

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho.push({ nome: item, preco });
    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    alert(`${item} - R$ ${preco.toFixed(2)}\n\nFoi adicionado ao carrinho!`);
  }

  // Eventos nos botões de pedido
  document.querySelectorAll(".pedido-button").forEach((btn) => {
    let processando = false;

    btn.addEventListener("click", (e) => {
      e.preventDefault();  // impede navegação, mas NÃO bloqueia propagação

      if (processando) return;
      processando = true;

      const nome = btn.dataset.item?.trim();
      const preco = parseFloat(btn.dataset.preco) || 0;

      if (!nome) {
        processando = false;
        return;
      }

      const descricao = btn.closest('.item-card')?.querySelector('p')?.textContent?.trim();
      const nomeCompleto = descricao ? `${nome} - ${descricao}` : nome;

      adicionarAoCarrinho(nomeCompleto, preco);

      setTimeout(() => {
        processando = false;
      }, 1000);
    });
  });
});