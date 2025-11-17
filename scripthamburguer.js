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
    
    // Alert mostrando exatamente o que foi adicionado
    alert(`${item} - R$ ${preco.toFixed(2)}\n\nFoi adicionado ao carrinho!`);
  }

  // Eventos nos botões de pedido
  document.querySelectorAll(".pedido-button").forEach((btn) => {
    let processando = false;
    
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (processando) return;
      processando = true;
      
      const nome = btn.dataset.item?.trim();
      const preco = parseFloat(btn.dataset.preco) || 0;
      
      if (!nome) {
        processando = false;
        return;
      }
      
      // Pega a descrição do produto (ingredientes)
      const descricao = btn.closest('.item-card')?.querySelector('p')?.textContent?.trim();
      const nomeCompleto = descricao ? `${nome} - ${descricao}` : nome;
      
      adicionarAoCarrinho(nomeCompleto, preco);
      
      setTimeout(() => {
        processando = false;
      }, 1000);
    });
  });
});
```

Agora o alert vai mostrar exatamente o que foi adicionado ao carrinho:
```
X-salada - 1 hambúrguer, Mussarela, Alface Americana, Tomate e Ketchup - R$ 10.00

Foi adicionado ao carrinho!
