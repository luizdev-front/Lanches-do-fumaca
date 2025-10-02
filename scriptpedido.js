document.addEventListener('DOMContentLoaded', () => {
  // ================================
  // 1️⃣ Função para buscar bairros e taxas via API
  // ================================
  async function buscarBairros() {
    try {
      const resposta = await fetch('https://suaapi.com/bairros'); // Substitua pela URL da sua API
      if (!resposta.ok) throw new Error('Erro ao buscar dados da API');

      const dados = await resposta.json();
      // Espera-se algo como: [{ bairro: 'MARÉ MANSA', taxa: 4.00 }, ...]
      return dados;
    } catch (erro) {
      console.error('Falha ao buscar bairros:', erro);
      // Retorna array vazio para não quebrar o restante do código
      return [];
    }
  }

  // ================================
  // 2️⃣ Variáveis
  // ================================
  const botaoVendedora = document.getElementById('finalizar-pedido');
  const pagamentoSelect = document.getElementById('pagamento');
  const pixDiv = document.getElementById('pix-div');

  // Função mostrarCarrinho já existente
  function mostrarCarrinho() {
    // Seu código para mostrar itens do carrinho
  }

  // ================================
  // 3️⃣ Inicializa o carrinho e busca bairros
  // ================================
  let bairrosTaxas = [];
  async function init() {
    bairrosTaxas = await buscarBairros();
    mostrarCarrinho();
  }

  init();

  // ================================
  // 4️⃣ Listener do botão
  // ================================
  botaoVendedora.addEventListener('click', finalizarPedido);

  // ================================
  // 5️⃣ Função finalizarPedido
  // ================================
  function finalizarPedido() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (carrinho.length === 0) {
      alert('Seu pedido está vazio!');
      return;
    }

    const nomeCliente = document.getElementById('nome').value.trim();
    const enderecoCliente = document.getElementById('endereco').value.trim().toUpperCase();
    const observacoes = document.getElementById('observacoes').value.trim();
    const formaPagamento = pagamentoSelect.value;

    if (!nomeCliente || !enderecoCliente || !formaPagamento) {
      alert('Preencha nome, endereço e forma de pagamento!');
      return;
    }

    // ================================
    // 6️⃣ Validação do bairro e taxa
    // ================================
    const bairroEncontrado = bairrosTaxas.find(({ bairro }) =>
      enderecoCliente.includes(bairro.toUpperCase())
    );

    if (!bairroEncontrado) {
      const bairrosDisponiveis = bairrosTaxas.map(b => b.bairro).join(', ');
      alert(`Desculpe, não entregamos nesse bairro. Entregamos apenas: ${bairrosDisponiveis}`);
      return;
    }

    const taxaEntrega = bairroEncontrado.taxa;

    // ================================
    // 7️⃣ Monta a mensagem do pedido
    // ================================
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
    if (observacoes) mensagem += `📝 *Observações:* ${observacoes}\n`;
    mensagem += `💳 *Pagamento:* ${formaPagamento.toUpperCase()}\n`;
    mensagem += `🕒 Data: ${new Date().toLocaleString()}\n`;

    // ================================
    // 8️⃣ Informações de Pix
    // ================================
    if (formaPagamento === 'pix') {
      mensagem += `\n📲 *Pagamento via Pix*\nChave Pix: 13988799046\nValor: R$ ${totalComEntrega.toFixed(2)}\nEnvie o comprovante após o pagamento. ✅\n`;
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
    // 9️⃣ Salva pedido, limpa carrinho e formulário
    // ================================
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
    localStorage.removeItem('carrinho');
    mostrarCarrinho();

    if (formaPagamento !== 'pix') {
      document.getElementById('nome').value = '';
      document.getElementById('endereco').value = '';
      document.getElementById('observacoes').value = '';
      pagamentoSelect.value = '';
    }

    // ================================
    // 🔟 Envia para WhatsApp
    // ================================
    const numero = '5513988799046';
    const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(link, '_blank');
  }
});