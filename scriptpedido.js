document.addEventListener('DOMContentLoaded', async () => {
  const produtoDiv = document.getElementById('produto');
  const botaoVendedora = document.getElementById('botao-vendedora');
  const pagamentoSelect = document.getElementById('pagamento');
  const pixDiv = document.getElementById('pix-info');

  let bairrosTaxas = [];

  async function carregarTaxasEntrega() {
    try {
      const response = await fetch('https://sua-api.com/bairros-taxas'); // Substitua pela URL real
      const data = await response.json();
      bairrosTaxas = data;
    } catch (error) {
      console.error('Erro ao carregar taxas de entrega:', error);
    }
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
      const adicionais = item.adicionais?.length ? ` + ${item.adicionais.join(", ")}` : "";

      const p = document.createElement('span');
      p.textContent = `${nome}${adicionais} - R$ ${preco.toFixed(2)}`;

      const btnRemover = document.createElement('button');
      btnRemover.textContent = "Remover";
      btnRemover.classList.add('btn-remover');
      btnRemover.onclick = () => removerItem(index);

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

  function removerItem(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    mostrarCarrinho();
  }

  pagamentoSelect.addEventListener('change', () => {
    pixDiv.classList.toggle('hidden', pagamentoSelect.value !== 'pix');
  });

  window.finalizarPedido = function() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (carrinho.length === 0) {
      alert('Seu pedido está vazio!');
      return;
    }

    const nomeCliente = document.getElementById('nome').value.trim();
    const enderecoCliente = document.getElementById('endereco').value.trim().toLowerCase();
    const observacoes = document.getElementById('observacoes').value.trim();
    const formaPagamento = document.getElementById('pagamento').value;

    if (!nomeCliente || !enderecoCliente || !formaPagamento) {
      alert("Preencha nome, endereço e forma de pagamento!");
      return;
    }

    let taxaEntrega = 0;
    for (const item of bairrosTaxas) {
      if (enderecoCliente.includes(item.bairro.toLowerCase())) {
        taxaEntrega = item.taxa;
        break;
      }
    }
const bairroEncontrado = bairrosTaxas.find(item =>
  enderecoCliente.includes(item.bairro.toLowerCase())
);

if (!bairroEncontrado) {
  alert("Desculpe, não entregamos nesse bairro.");
  return;
}

const taxaEntrega = bairroEncontrado.taxa;

    let mensagem = "📦 *Novo Pedido*\n\n";
    let total = 0;
    carrinho.forEach(item => {
      const nome = item.nome || "Produto sem nome";
      const preco = item.preco || 0;
      const adicionais = item.adicionais?.length ? ` + ${item.adicionais.join(", ")}` : "";
      mensagem += `• ${nome}${adicionais} - R$ ${preco.toFixed(2)}\n`;
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
        <button onclick="navigator.clipboard.writeText('13988799046'); alert('Chave Pix copiada!')">Copiar chave Pix</button>
        <p>Após o pagamento, envie o comprovante pelo WhatsApp.</p>
      `;
    }

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

    localStorage.removeItem('carrinho');

    const numero = "5513988799046"; 
    const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(link, "_blank");

    if (formaPagamento !== 'pix') {
      location.reload();
    }

    mostrarCarrinho();
  };

  window.enviarParaCliente = function() {
    alert('Pedido enviado para o cliente!');
  };

  await carregarTaxasEntrega();
  mostrarCarrinho();
});