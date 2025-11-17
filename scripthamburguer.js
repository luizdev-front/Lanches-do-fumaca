// Menu Mobile toggle
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('menu');
  
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
  }

  // Função para adicionar ao carrinho (APENAS UMA VEZ)
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

  // PROTEÇÃO: Remove listeners antigos antes de adicionar novos
  const botoes = document.querySelectorAll(".pedido-button");
  
  botoes.forEach((btn) => {
    // Clona o botão para remover todos os event listeners antigos
    const novoBotao = btn.cloneNode(true);
    btn.parentNode.replaceChild(novoBotao, btn);
  });

  // Agora adiciona os listeners nos botões limpos
  document.querySelectorAll(".pedido-button").forEach((btn) => {
    let processando = false;
    
    // IMPORTANTE: usar "once: false" mas controlar com a flag
    btn.addEventListener("click", function handler(e) {
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
      
      // Pega a descrição do produto
      const descricao = this.closest('.item-card')?.querySelector('p')?.textContent?.trim();
      const nomeCompleto = descricao ? `${nome} - ${descricao}` : nome;
      
      adicionarAoCarrinho(nomeCompleto, preco);
      
      setTimeout(() => {
        processando = false;
      }, 1000);
    });
  });
});
