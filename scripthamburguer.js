document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('menu');
  
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
  }

  // Marca que o script já foi executado
  if (window.carrinhoIniciado) {
    console.log("Script já foi carregado, ignorando duplicata");
    return;
  }
  window.carrinhoIniciado = true;

  function adicionarAoCarrinho(item, preco) {
    if (!item) return;
    
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho.push({ nome: item, preco });
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    
    const notif = document.createElement("div");
    notif.className = "notificacao";
    notif.innerText = `${item} foi adicionado ao carrinho!`;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
  }

  document.querySelectorAll(".pedido-button").forEach((btn) => {
    // Marca cada botão como "processado"
    if (btn.dataset.listenerAdded) return;
    btn.dataset.listenerAdded = "true";
    
    let processando = false;
    
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      if (processando) return;
      processando = true;
      
      const nome = this.dataset.item?.trim();
      const preco = parseFloat(this.dataset.preco) || 0;
      
      if (!nome) {
        processando = false;
        return;
      }
      
      const descricao = this.closest('.item-card')?.querySelector('p')?.textContent?.trim();
      const nomeCompleto = descricao ? `${nome} - ${descricao}` : nome;
      
      adicionarAoCarrinho(nomeCompleto, preco);
      
      setTimeout(() => {
        processando = false;
      }, 1500);
    }, { once: false });
  });
});
