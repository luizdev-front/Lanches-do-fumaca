// Menu Mobile toggle
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('menu');
  
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
  }

  // Função para adicionar ao carrinho
  function adicionarAoCarrinho(item, preco) {
    if (!item) return;
    
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho.push({ nome: item, preco });
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    
    // Exibe uma notificação temporária
    const notif = document.createElement("div");
    notif.className = "notificacao";
    notif.innerText = `${item} foi adicionado ao carrinho!`;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
  }

  // Eventos nos botões de pedido
  document.querySelectorAll(".pedido-button").forEach((btn) => {
    let processando = false;
    
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (processando) return;
      processando = true;
      
      const button = e.currentTarget;
      const nome = button.dataset.item?.trim();
      const preco = parseFloat(button.dataset.preco) || 0;
      
      if (!nome) {
        processando = false;
        return;
      }
      
      // Pega a descrição do produto
      const descricao = button.closest('.item-card')?.querySelector('p')?.textContent?.trim();
      const nomeCompleto = descricao ? `${nome} - ${descricao}` : nome;
      
      adicionarAoCarrinho(nomeCompleto, preco);
      
      setTimeout(() => {
        processando = false;
      }, 1000);
    });
  });
});
