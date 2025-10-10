document.addEventListener('DOMContentLoaded', () => {

  const produtoDiv = document.getElementById('produto');
  const botaoVendedora = document.getElementById('enviar-vendedora-btn');
  const pagamentoSelect = document.getElementById('pagamento');
  const pixDiv = document.getElementById('pix-info');

  // ================================
  // 1️⃣ Bairros e taxas de entrega
  // ================================
  const bairrosTaxas = [
    { bairro: 'MARÉ MANSA', taxa: 4.00 },
    { bairro: 'VILA RÃ', taxa: 6.00 },
    { bairro: 'AREIÃO', taxa: 6.00 },
    { bairro: 'PENÍNSULA', taxa: 6.00 },
    { bairro: 'PEDREIRA', taxa: 8.00 }
  ];

  // ================================
  // 2️⃣ Mostrar itens do carrinho
  // ================================
  function mostrarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    produtoDiv.innerHTML = '';
    let total = 0;

    if (carrinho.length === 0) {
      produtoDiv.textContent = 'Nenhum item no pedido.';
      return;
    }

    carrinho.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item-carrinho');

      const nome = item.nome || 'Produto sem nome';
      const preco = item.preco || 0;
      const adicionaisTexto = item.adicionais && item.adicionais.length > 0
        ? ` (${item.adicionais.join(', ')})`
        : '';

      const span = document.createElement('span');
      span.textContent = `${nome}${adicionaisTexto} - R$ ${preco.toFixed(2)}`;

      const btnRemover = document.createElement('button');
      btnRemover.textContent = 'Remover';
      btnRemover.addEventListener('click', () => removerItem(index));

      itemDiv.appendChild(span);
      itemDiv.appendChild(btnRemover);
      produtoDiv.appendChild(itemDiv);

      total += preco;
    });

    const pTotal = document.createElement('p');
    pTotal.innerHTML = `<strong>Total: R$ ${total.toFixed(2)}</strong>`;
    produtoDiv.appendChild(pTotal);
  }

  function removerItem(index) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    mostrarCarrinho();
  }

  // ================================
  // 3️⃣ Controle do campo Pix
  // ================================
  pagamentoSelect.addEventListener('change', () => {
    pixDiv.classList.toggle('hidden', pagamentoSelect.value !== 'pix');
    if (pagamentoSelect.value !== 'pix') pixDiv.innerHTML = '';
  });

  // ================================
  // 4️⃣ Finalizar Pedido
  // ================================
  botaoVendedora.addEventListener('click', finalizarPedido);

  function finalizarPedido() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (carrinho.length === 0) {
      alert('Seu pedido está vazio!');
      return;
    }

    const nomeCliente = document.getElementById('nome').value.trim();
    const enderecoClienteOriginal = document.getElementById('endereco').value.trim();
    const enderecoCliente = enderecoClienteOriginal
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const observacoes = document.getElementById('observacoes').value.trim();
    const formaPagamento = pagamentoSelect.value;

    if (!nomeCliente || !enderecoClienteOriginal || !formaPagamento) {
      alert('Preencha nome, endereço e forma de pagamento!');
      return;
    }

    // ================================
    // 5️⃣ Validação do bairro
    // ================================
    const bairroEncontrado = bairrosTaxas.find(({ bairro }) => {
      const bairroFormatado = bairro
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return enderecoCliente.includes(bairroFormatado);
    });

    if (!bairroEncontrado) {
      const bairrosDisponiveis = bairrosTaxas.map(b => b.bairro).join(', ');
      alert(`Desculpe, não entregamos nesse bairro. Entregamos apenas: ${bairrosDisponiveis}`);
      return;
    }

    const taxaEntrega = bairroEncontrado.taxa;

    // ================================
    // 6️⃣ Montar mensagem do pedido
    // ================================
    let mensagem = '📦 *Novo Pedido*\n\n';
    let total = 0;

    carrinho.forEach(({ nome = 'Produto sem nome', preco = 0, adicionais }) => {
      const adicionaisTexto = adicionais && adicionais.length > 0 ? ` (${adicionais.join(', ')})` : '';
      mensagem += `• ${nome}${adicionaisTexto} - R$ ${preco.toFixed(2)}\n`;
      total += preco;
    });

    const totalComEntrega = total + taxaEntrega;
    mensagem += `\n🚚 Taxa de entrega: R$ ${taxaEntrega.toFixed(2)}\n`;
    mensagem += `💰 Total com entrega: R$ ${totalComEntrega.toFixed(2)}\n`;
    mensagem += `👤 Cliente: ${nomeCliente}\n`;
    mensagem += `🏠 Endereço: ${enderecoClienteOriginal}\n`;
    if (observacoes) mensagem += `📝 Observações: ${observacoes}\n`;
    mensagem += `💳 Pagamento: ${formaPagamento.toUpperCase()}\n`;
    mensagem += `🕒 Data: ${new Date().toLocaleString()}\n`;

    // ================================
    // 7️⃣ Pix
    // ================================
    if (formaPagamento === 'pix') {
      mensagem += `\n📲 Pagamento via Pix\nChave Pix: 13988799046\nValor: R$ ${totalComEntrega.toFixed(2)}\nEnvie o comprovante após o pagamento. ✅\n`;
      pixDiv.classList.remove('hidden');
      pixDiv.innerHTML = `
        <p><strong>Chave Pix:</strong> 13988799046</p>
        <p><strong>Valor:</strong> R$ ${totalComEntrega.toFixed(2)}</p>
        <button id="btn-copiar-pix">Copiar chave Pix</button>
        <p>Após o pagamento, envie o comprovante pelo WhatsApp.</p>
      `;
      document.getElementById('btn-copiar-pix').addEventListener('click', () => {
        navigator.clipboard.writeText('13988799046').then(() => alert('Chave Pix copiada!'));
      });
    } else {
      pixDiv.classList.add('hidden');
      pixDiv.innerHTML = '';
    }

    // ================================
    // 8️⃣ Salvar pedido e limpar carrinho
    // ================================
    const novoPedido = {
      itens: carrinho,
      cliente: nomeCliente,
      endereco: enderecoClienteOriginal,
      observacoes,
      pagamento: formaPagamento,
      data: new Date().toLocaleString(),
      status: 'Aguardando'
    };

    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos.push(novoPedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    localStorage.removeItem('carrinho');
    mostrarCarrinho();

    if (formaPagamento !== 'pix') {
      document.getElementById('nome').value = '';
      document.getElementById('endereco').value = '';
      document.getElementById('observacoes').value = '';
      pagamentoSelect.value = '';
    }

    // ================================
    // 9️⃣ Envio para o WhatsApp
    // ================================
    const numero = '5513988799046'; // seu número aqui
    const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(link, '_blank');
  }

  // Inicializa carrinho ao carregar
  mostrarCarrinho();
});