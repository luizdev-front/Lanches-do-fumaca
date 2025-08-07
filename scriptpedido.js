// Recupera carrinho do localStorage
const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
const listaProdutos = document.getElementById('produto');

// Renderiza o carrinho na tela
function renderCarrinho() {
  if (carrinho.length === 0) {
    listaProdutos.textContent = "Seu carrinho está vazio.";
    return;
  }

  let total = 0;
  listaProdutos.innerHTML = '<ul>';

  carrinho.forEach(({ nome, preco }, index) => {
    listaProdutos.innerHTML += `
      <li>
        ${nome} - R$ ${preco.toFixed(2)}
        <button onclick="removerItem(${index})">❌ Remover</button>
      </li>`;
    total += parseFloat(preco);
  });

  listaProdutos.innerHTML += `</ul>
    <p><strong>Total: R$ ${total.toFixed(2)}</strong></p>
    <button onclick="limparCarrinho()">🗑️ Limpar carrinho</button>
  `;
}

// Remove item individual
function removerItem(index) {
  carrinho.splice(index, 1);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  location.reload();
}

// Limpa todo o carrinho
function limparCarrinho() {
  if (confirm("Deseja limpar todo o carrinho?")) {
    localStorage.removeItem('carrinho');
    location.reload();
  }
}

renderCarrinho(); // Chama a renderização ao abrir a página

// Elementos para pagamento e QR Code
const pagamento = document.getElementById('pagamento');
const qrcode = document.getElementById('qrcode');
const botaoVendedora = document.getElementById('botao-vendedora');

// Exibe/esconde QR Code ou botão conforme a forma de pagamento
pagamento.addEventListener('change', () => {
  if (pagamento.value === 'pix') {
    qrcode.classList.remove('hidden');
    botaoVendedora.classList.add('hidden');
  } else if (pagamento.value === 'debito' || pagamento.value === 'credito') {
    botaoVendedora.classList.remove('hidden');
    qrcode.classList.add('hidden');
  } else {
    qrcode.classList.add('hidden');
    botaoVendedora.classList.add('hidden');
  }
});

// Envia pedido para o cliente (simulação)
function enviarParaCliente() {
  const nomeCliente = document.getElementById('nome').value;
  const endereco = document.getElementById('endereco').value;

  let lista = "";
  let total = 0;

  carrinho.forEach(({ nome, preco }) => {
    lista += `- ${nome} - R$ ${preco.toFixed(2)}\n`;
    total += parseFloat(preco);
  });

  const mensagem = `✅ Pagamento confirmado!\n\n🧾 Pedido:\n${lista}\n💰 Total: R$ ${total.toFixed(2)}\n📦 Endereço: ${endereco}\n👤 Nome: ${nomeCliente}`;
  const link = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
  window.open(link, '_blank');

  localStorage.removeItem('carrinho');
}

// Envia pedido para a vendedora (com número fixo)
function enviarParaVendedora() {
  const nomeCliente = document.getElementById('nome').value;
  const endereco = document.getElementById('endereco').value;

  let lista = "";
  let total = 0;

  carrinho.forEach(({ nome, preco }) => {
    lista += `- ${nome} - R$ ${preco.toFixed(2)}\n`;
    total += parseFloat(preco);
  });

  const mensagem = `📥 Novo pedido recebido!\n\n🧾 Pedido:\n${lista}\n💰 Total: R$ ${total.toFixed(2)}\n💳 Pagamento: ${pagamento.value.toUpperCase()}\n👤 Nome: ${nomeCliente}\n📦 Endereço: ${endereco}`;
  const numeroVendedora = "5599999999999"; // Substitua pelo número real da vendedora
  const link = `https://wa.me/${numeroVendedora}?text=${encodeURIComponent(mensagem)}`;
  window.open(link, '_blank');

  localStorage.removeItem('carrinho');
}