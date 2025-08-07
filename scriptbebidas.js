function atualizarCarrinho() {
  const carrinhoContainer = document.getElementById('carrinho');
  if (!carrinhoContainer) {
    console.error('Elemento com id="carrinho" não encontrado.');
    return;
  }

  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

  carrinhoContainer.innerHTML = '';

  let total = 0;

  carrinho.forEach((item, index) => {
    const precoValido = parseFloat(item.preco);
    if (!isNaN(precoValido)) {
      total += precoValido;
    }

    const itemDiv = document.createElement('div');
    itemDiv.className = 'carrinho-item';
    itemDiv.innerHTML = `
      ${item.nome} - R$ ${precoValido.toFixed(2).replace('.', ',')}
      <button onclick="removerDoCarrinho(${index})">Remover</button>
    `;
    carrinhoContainer.appendChild(itemDiv);
  });

  const totalDiv = document.createElement('div');
  totalDiv.className = 'carrinho-total';

  // Verifica se total é um número antes de exibir
  if (!isNaN(total)) {
    totalDiv.innerHTML = `<strong>Total: R$ ${total.toFixed(2).replace('.', ',')}</strong>`;
  } else {
    totalDiv.innerHTML = `<strong>Total: R$ 0,00</strong>`;
  }

  carrinhoContainer.appendChild(totalDiv);
}