const produtoDiv = document.getElementById('produto');
const botaoVendedora = document.getElementById('botao-vendedora');
const pagamentoSelect = document.getElementById('pagamento');
const qrcodeDiv = document.getElementById('qrcode');

const menuHamburguer = document.getElementById('menu-hamburguer');
const menu = document.getElementById('menu');

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

// Mostrar QR Code se for PIX
pagamentoSelect.addEventListener('change', () => {
  qrcodeDiv.classList.toggle('hidden', pagamentoSelect.value !== 'pix');
});

// Finalizar pedido e ir para pedidos.html
function finalizarPedido() {
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
  window.location.href = 'pedidos.html';
}

// Menu hambúrguer
menuHamburguer.addEventListener('click', () => {
  menu.classList.toggle('hidden');
  menuHamburguer.classList.toggle('active');
  const spans = menuHamburguer.querySelectorAll('span');
  if (menu.classList.contains('hidden')) {
    spans[0].style.transform = 'rotate(0) translate(0,0)';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'rotate(0) translate(0,0)';
  } else {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
  }
});

// Inicializa
mostrarCarrinho();