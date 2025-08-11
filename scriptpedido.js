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

// Função para remover um item
function removerItem(index) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho.splice(index, 1); // Remove o item
  localStorage.setItem('carrinho', JSON.stringify(carrinho)); // Atualiza o localStorage
  mostrarCarrinho(); // Recarrega a lista
}
