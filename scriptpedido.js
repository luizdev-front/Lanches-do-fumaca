document.addEventListener('DOMContentLoaded', () => {
  const produtoDiv = document.getElementById('produto');
  const botaoVendedora = document.getElementById('enviar-vendedora-btn');
  const pagamentoSelect = document.getElementById('pagamento');
  const pixDiv = document.getElementById('pix-info');
  const enviarClienteBtn = document.getElementById('enviar-cliente-btn');

  // Array estático de bairros e taxas — substitua ou complemente se tiver API
  const bairrosTaxas = [
    { bairro: "centro", taxa: 5.0 },
    { bairro: "jardim américa", taxa: 7.5 },
    { bairro: "vila nova", taxa: 6.0 }
  ];

  function mostrarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    produtoDiv.innerHTML = '';
    let total = 0;

    if (carrinho.length === 0) {
      produtoDiv.textContent = 'Nenhum item no pedido.';
      botaoVendedora.classList.add('hidden');
      return;
    }

    carrinho.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item-carrinho');

      const nome = item.nome || 'Produto sem nome';
      const preco = item.preco || 0;
      const adicionais = item.adicionais?.length
        ? ` + ${item.adicionais.join(', ')}`
        : '';

      const span = document.createElement('span');
      span.textContent = `${nome}${adicionais} - R$ ${preco.toFixed(2)}`;

      const btnRemover = document.createElement('button');
      btnRemover.textContent = 'Remover';
      btnRemover.classList.add('btn-remover');
      btnRemover.addEventListener('click', () => removerItem(index));

      itemDiv.appendChild(span);
      itemDiv.appendChild(btnRemover);
      produtoDiv.appendChild(itemDiv);

      total += preco;
    });

    const pTotal = document.createElement('p');
    pTotal.innerHTML = `<strong>Total: R$ ${total.toFixed(2)}</strong>`;
    produtoDiv.appendChild(pTotal);

    botaoVendedora.classList.remove('hidden');
  }

  function removerItem(index) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    mostrarCarrinho();
  }

  pagamentoSelect.addEventListener('change', () => {
    pixDiv.classList.toggle('hidden', pagamentoSelect.value !== 'pix');
    if (pagamentoSelect.value !== 'pix') {
      pixDiv.innerHTML = '';
    }
  });

  botaoVendedora.addEventListener('click', finalizarPedido);
  enviarClienteBtn.addEventListener('click', () => {
    alert('Pedido enviado para o cliente!');
  });

  function finalizarPedido() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (carrinho.length === 0) {
      alert('Seu pedido está vazio!');
      return;
    }

    const nomeCliente = document.getElementById('nome').value.trim();
    const enderecoCliente = document.getElementById('endereco').value.trim().toLowerCase();
    const observacoes = document.getElementById('observacoes').value.trim();
    const formaPagamento = pagamentoSelect.value;

    if (!nomeCliente || !enderecoCliente || !formaPagamento) {
      alert('Preencha nome, endereço e forma de pagamento!');
      return;
    }

    // Busca o bairro e a taxa correspondente
    const bairroEncontrado = bairrosTaxas.find(({ bairro }) =>
      enderecoCliente.includes(bairro)
    );

    if (!bairroEncontrado) {
      alert('Desculpe, não entregamos nesse bairro.');
      return;
    }

    const taxaEntrega = bairroEncontrado.taxa;

    let mensagem = '📦 *Novo Pedido*\n\n';
    let total = 0;

    carrinho.forEach(({ nome = 'Produto sem nome', preco = 0, adicionais }) => {
      const adicionaisTexto = adicionais?.length ? ` + ${adicionais.join(', ')}` : '';
      mensagem += `• ${nome}${adicionaisTexto} - R$ ${preco.toFixed(2)}\n`;
      total += preco;
    });

    const totalComEntrega = total + taxaEntrega;

    mensagem += `\n🚚 *Taxa de entrega:* R$ ${taxaEntrega.toFixed(2)}\n`;
    mensagem += `💰 *Total com entrega:* R$ ${totalComEntrega.toFixed(2)}\n`;
    mensagem += `👤 *Cliente:* ${nomeCliente}\n`;
    mensagem += `🏠 *Endereço:* ${enderecoCliente}\n`;
    if (observacoes) {
      mensagem += `📝 *Observações:* ${observacoes}\n`;
    }
    mensagem += `💳 *Pagamento:* ${formaPagamento.toUpperCase()}\n`;
    mensagem += `🕒 Data: ${new Date().toLocaleString()}\n`;

    if (formaPagamento === 'pix') {
      mensagem += `\n📲 *Pagamento via Pix*\n`;
      mensagem += `Chave Pix: 13988799046\n`;
      mensagem += `Valor: R$ ${totalComEntrega.toFixed(2)}\n`;
      mensagem += `Envie o comprovante após o pagamento. ✅\n`;

      pixDiv.classList.remove('hidden');
      pixDiv.innerHTML = `
        <p><strong>Chave Pix:</strong> 13988799046</p>
        <p><strong>Valor:</strong> R$ ${totalComEntrega.toFixed(2)}</p>
        <button id="btn-copiar-pix">Copiar chave Pix</button>
        <p>Após o pagamento, envie o comprovante pelo WhatsApp.</p>
      `;

      const btnCopiarPix = document.getElementById('btn-copiar-pix');
      btnCopiarPix.addEventListener('click', () => {
        navigator.clipboard.writeText('13988799046').then(() => {
          alert('Chave Pix copiada!');
        });
      });
    } else {
      pixDiv.classList.add('hidden');
      pixDiv.innerHTML = '';
    }

    // Salva pedido no histórico
    const novoPedido = {
      itens: carrinho,
      cliente: nomeCliente,
      endereco: enderecoCliente,
      observacoes,
      pagamento: formaPagamento,
      data: new Date().toLocaleString(),
      status: 'Aguardando'
    };

    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos.push(novoPedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    // Limpa carrinho e formulário
    localStorage.removeItem('carrinho');
    mostrarCarrinho();

    if (formaPagamento !== 'pix') {
      document.getElementById('nome').value = '';
      document.getElementById('endereco').value = '';
      document.getElementById('observacoes').value = '';
      pagamentoSelect.value = '';
    }

    // Envia mensagem pelo WhatsApp
    const numero = '5513988799046';
    const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(link, '_blank');
  }

  mostrarCarrinho();
});
// Coloque esse JS em scriptpedido.js ou dentro de <script> em pedido.html

function renderizarCarrinho() {
  const lista = document.getElementById("lista-carrinho");
  lista.innerHTML = "";
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho.forEach((item, idx) => {
    const li = document.createElement("li");
    li.className = "item-carrinho";
    li.innerHTML = `
      ${item.nome} - R$${item.preco.toFixed(2)}
      <button class="btn-remover" onclick="removerDoCarrinho(${idx})">Retirar</button>
    `;
    lista.appendChild(li);
  });
}

function removerDoCarrinho(index) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho.splice(index, 1);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  renderizarCarrinho();
}

// Atualiza o carrinho ao abrir página
document.addEventListener("DOMContentLoaded", renderizarCarrinho);
