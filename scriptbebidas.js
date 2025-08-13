// Atualiza o carrinho
function atualizarCarrinho() {
  const carrinhoContainer = document.getElementById('carrinho');
  if (!carrinhoContainer) {
    console.error('Elemento com id="carrinho" não encontrado.');
    return;
  }

  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
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
  totalDiv.innerHTML = `<strong>Total: R$ ${total.toFixed(2).replace('.', ',')}</strong>`;
  carrinhoContainer.appendChild(totalDiv);
}

// Remove item do carrinho
function removerDoCarrinho(index) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho.splice(index, 1);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarCarrinho();
}

// Menu responsivo
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  navMenu.classList.toggle('active');
  menuToggle.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && e.target !== menuToggle) {
    navMenu.classList.remove('active');
    menuToggle.classList.remove('active');
  }
});

// Atualiza o carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarCarrinho);