document.addEventListener('DOMContentLoaded', () => {
  const produtoDiv = document.getElementById('produto');
  const botaoVendedora = document.getElementById('botao-vendedora');
  const pagamentoSelect = document.getElementById('pagamento');
  const qrcodeDiv = document.getElementById('qrcode');

 
  window.adicionarAoCarrinho = function (produto) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push(produto);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    mostrarCarrinho();
  }

  // Mostrar carrinho
  function mostrarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    produtoDiv.innerHTML = '';
    let total = 0;

    if (carrinho.length === 0) {
      produtoDiv.textContent = "Nenhum item no pedido.";
      botaoVendedora.classList.add('hidden');
      return;
    }

    carrinho.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item-carrinho');

      const nome = item.nome || "Produto sem nome";
      const preco = item.preco || 0;

      const p = document.createElement('span');
      p.textContent = `${nome} - R$ ${preco.toFixed(2)}`;

      const btnRemover = document.createElement('button');
      btnRemover.textContent = "Remover";
      btnRemover.classList.add('btn-remover');
      btnRemover.onclick = () => {
        removerItem(index);
      };

      itemDiv.appendChild(p);
      itemDiv.appendChild(btnRemover);
      produtoDiv.appendChild(itemDiv);

      total += preco;
    });

    const pTotal = document.createElement('p');
    pTotal.innerHTML = `<strong>Total: R$ ${total.toFixed(2)}</strong>`;
    produtoDiv.appendChild(pTotal);

    botaoVendedora.classList.remove('hidden');
  }

  // Remover item
  function removerItem(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    mostrarCarrinho();
  }

  // Mostrar QR Code se PIX
  pagamentoSelect.addEventListener('change', () => {
    qrcodeDiv.classList.toggle('hidden', pagamentoSelect.value !== 'pix');
  });

  // Finalizar pedido
  window.finalizarPedido = function() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (carrinho.length === 0) {
      alert('Seu pedido está vazio!');
      return;
    }

    const novoPedido = {
      itens: carrinho,
      data: new Date().toLocaleString(),
      status: "Aguardando"
    };

    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos.push(novoPedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    localStorage.removeItem('carrinho');
    alert("Pedido enviado para a vendedora!");
    location.reload(); // Atualiza para limpar carrinho
  }

  mostrarCarrinho();
});
// Finalizar pedido e enviar para WhatsApp
window.finalizarPedido = function() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  if (carrinho.length === 0) {
    alert('Seu pedido está vazio!');
    return;
  }

  // Monta mensagem do pedido
  let mensagem = "📦 *Novo Pedido*\n\n";
  let total = 0;
  carrinho.forEach(item => {
    const nome = item.nome || "Produto sem nome";
    const preco = item.preco || 0;
    mensagem += `• ${nome} - R$ ${preco.toFixed(2)}\n`;
    total += preco;
  });
  mensagem += `\n💰 *Total:* R$ ${total.toFixed(2)}\n`;
  mensagem += `🕒 Data: ${new Date().toLocaleString()}\n`;
  mensagem += `\nPor favor, confirme meu pedido. ✅`;

  // Salva no histórico (opcional)
  const novoPedido = {
    itens: carrinho,
    data: new Date().toLocaleString(),
    status: "Aguardando"
  };
  const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  pedidos.push(novoPedido);
  localStorage.setItem('pedidos', JSON.stringify(pedidos));

  // Limpa carrinho
  localStorage.removeItem('carrinho');

  // Envia para WhatsApp
  const numero = "5513988799046"; 
  const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  window.open(link, "_blank");

  // Atualiza a página
  location.reload();
}