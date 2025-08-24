document.addEventListener('DOMContentLoaded', () => {
  const produtoDiv = document.getElementById('produto');
  const botaoVendedora = document.getElementById('botao-vendedora');
  const pagamentoSelect = document.getElementById('pagamento');
  const qrcodeDiv = document.getElementById('qrcode');

  // Função para adicionar produto ao carrinho (padronizando nome e preco)
  window.adicionarAoCarrinho = function (produto) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    // Normaliza o produto antes de salvar
    carrinho.push({
      nome: produto.nome || produto.titulo || produto.descricao || "Produto sem nome",
      preco: produto.preco || produto.valor || 0
    });

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    mostrarCarrinho();
  }

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

  // Finalizar pedido e enviar para WhatsApp
  window.finalizarPedido = function() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (carrinho.length === 0) {
      alert('Seu pedido está vazio!');
      return;
    }

    // Dados do cliente
    const nomeCliente = document.getElementById('nome').value.trim();
    const enderecoCliente = document.getElementById('endereco').value.trim();
    const observacoes = document.getElementById('observacoes').value.trim();
    const formaPagamento = document.getElementById('pagamento').value;

    if (!nomeCliente || !enderecoCliente || !formaPagamento) {
      alert("Preencha nome, endereço e forma de pagamento!");
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
    mensagem += `👤 *Cliente:* ${nomeCliente}\n`;
    mensagem += `🏠 *Endereço:* ${enderecoCliente}\n`;
    if (observacoes) {
      mensagem += `📝 *Observações:* ${observacoes}\n`;
    }
    mensagem += `💳 *Pagamento:* ${formaPagamento.toUpperCase()}\n`;
    mensagem += `🕒 Data: ${new Date().toLocaleString()}\n`;
    mensagem += `\nPor favor, confirme meu pedido. ✅`;

    // Salva no histórico
    const novoPedido = {
      itens: carrinho,
      cliente: nomeCliente,
      endereco: enderecoCliente,
      observacoes: observacoes,
      pagamento: formaPagamento,
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

  mostrarCarrinho();
});