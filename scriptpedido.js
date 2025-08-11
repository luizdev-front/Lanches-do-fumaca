 const produtoDiv = document.getElementById('produto');
const botaoVendedora = document.getElementById('botao-vendedora');
const pagamentoSelect = document.getElementById('pagamento');
const qrcodeDiv = document.getElementById('qrcode');

const menuHamburguer = document.getElementById('menu-hamburguer');
const menu = document.getElementById('menu');

// Função para mostrar carrinho
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

    const p = document.createElement('span');
    p.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;

    // Botão para remover
    const btnRemover = document.createElement('button');
    btnRemover.textContent = "Remover";
    btnRemover.classList.add('btn-remover');
    btnRemover.onclick = () => {
      removerItem(index);
    };

    itemDiv.appendChild(p);
    itemDiv.appendChild(btnRemover);
    produtoDiv.appendChild(itemDiv);

    total += item.preco;
  });

  // Mostrar total
  const pTotal = document.createElement('p');
  pTotal.innerHTML = `<strong>Total: R$ ${total.toFixed(2)}</strong>`;
  produtoDiv.appendChild(pTotal);

  botaoVendedora.classList.remove('hidden');
}

// Remover item do carrinho
function removerItem(index) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho.splice(index, 1);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  mostrarCarrinho();
}

// Atualizar visualização do QR Code conforme forma de pagamento
pagamentoSelect.addEventListener('change', () => {
  const metodo = pagamentoSelect.value;
  if (metodo === 'pix') {
    qrcodeDiv.classList.remove('hidden');
  } else {
    qrcodeDiv.classList.add('hidden');
  }
});

// Função para "Enviar para Cliente" - mostra um resumo em alert ou modal
function enviarParaCliente() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  if (carrinho.length === 0) {
    alert('Seu pedido está vazio!');
    return;
  }

  const nome = document.getElementById('nome').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const observacoes = document.getElementById('observacoes').value.trim();
  const pagamento = pagamentoSelect.value;

  if (!nome || !endereco || !pagamento) {
    alert('Por favor, preencha nome, endereço e forma de pagamento.');
    return;
  }

  let resumo = `Resumo do Pedido:\n\nCliente: ${nome}\nEndereço: ${endereco}\nPagamento: ${pagamento.toUpperCase()}\n\nItens:\n`;

  let total = 0;
  carrinho.forEach(item => {
    resumo += `- ${item.nome}: R$ ${item.preco.toFixed(2)}\n`;
    total += item.preco;
  });

  resumo += `\nTotal: R$ ${total.toFixed(2)}\n\nObservações:\n${observacoes || 'Nenhuma'}`;

  alert(resumo);
}

// Função para "Enviar para Vendedora" (simulação)
function enviarParaVendedora() {
  alert('Pedido enviado para a vendedora com sucesso!');
  // Aqui você poderia implementar envio real, por exemplo via API ou email
}

// Menu hambúrguer toggle
menuHamburguer.addEventListener('click', () => {
  menu.classList.toggle('hidden');

  // Efeito visual do menu (transformar barras em X)
  menuHamburguer.classList.toggle('active');
});

// Opcional: mudar visual do botão hambúrguer ao ativar
menuHamburguer.addEventListener('click', () => {
  const spans = menuHamburguer.querySelectorAll('span');
  if (menu.classList.contains('hidden')) {
    // reset barras
    spans[0].style.transform = 'rotate(0) translate(0,0)';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'rotate(0) translate(0,0)';
  } else {
    // transformar em X
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
  }
});

// Inicializa a página
mostrarCarrinho();


