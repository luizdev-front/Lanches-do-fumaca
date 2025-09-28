// Menu Mobile toggle
document.addEventListener("DOMContentLoaded", () => {
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
menuBtn.addEventListener('click', () => {
menu.classList.toggle('open');
});

  // Função para adicionar ao carrinho
  function adicionarAoCarrinho(item, preco) {
    if (!item) return; // se não houver nome, não adiciona

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho.push({ nome: item, preco });
    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    // Exibe uma notificação temporária em vez de alert
    const notif = document.createElement("div");
    notif.className = "notificacao";
    notif.innerText = `${item} foi adicionado ao carrinho!`;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
  }

  // Eventos nos botões de pedido
  document.querySelectorAll(".pedido-button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const button = e.currentTarget;
      const item = button.dataset.item?.trim();
      const preco = parseFloat(button.dataset.preco) || 0;

      if (!item) return; // não adiciona produto sem nome

      adicionarAoCarrinho(item, preco);

      // Redireciona após 500ms para ver a notificação
      setTimeout(() => {
        window.location.href = "pedido.html";
      }, 500);
    });
  });
});