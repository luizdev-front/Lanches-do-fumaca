 function adicionarAoCarrinho(nome, preco) {
  if (!nome || isNaN(preco)) {
    console.error("Dados inválidos:", nome, preco);
    return;
  }

  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho.push({ nome: nome, preco: preco });
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  alert(`${nome} foi adicionado ao carrinho!`);
  atualizarCarrinho();
}

function removerDoCarrinho(index) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho.splice(index, 1);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarCarrinho();
}

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
  totalDiv.innerHTML = `<strong>Total: R$ ${total.toFixed(2).replace('.', ',')}</strong>`;
  carrinhoContainer.appendChild(totalDiv);
}

// --- Função para envio de mensagem WhatsApp para a vendedora ---
function enviarParaVendedora() {
  const nome = document.getElementById("nome").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const pagamento = document.getElementById("pagamento").value;

  if (!nome || !endereco || !pagamento) {
    alert("Preencha todos os campos.");
    return;
  }

  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  let total = 0;
  let mensagem = `Novo pedido de ${nome}\n\n`;
  carrinho.forEach(p => {
    mensagem += `- ${p.nome} - R$ ${parseFloat(p.preco).toFixed(2)}\n`;
    total += parseFloat(p.preco);
  });
  mensagem += `\nTotal: R$ ${total.toFixed(2)}\nEndereço: ${endereco}\nPagamento: ${pagamento.toUpperCase()}`;

  const numero = "5513988799046"; // Seu número
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
}

// --- Função para envio de mensagem para o cliente (alert) ---
function enviarParaCliente() {
  const nome = document.getElementById("nome").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const pagamento = document.getElementById("pagamento").value;

  if (!nome || !endereco || !pagamento) {
    alert("Preencha todos os campos.");
    return;
  }

  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  let total = 0;
  let mensagem = `Olá, ${nome}!\n\nSeu pedido:\n`;
  carrinho.forEach(p => {
    mensagem += `- ${p.nome} - R$ ${parseFloat(p.preco).toFixed(2)}\n`;
    total += parseFloat(p.preco);
  });
  mensagem += `\nTotal: R$ ${total.toFixed(2)}\nEndereço: ${endereco}\nPagamento: ${pagamento}`;

  alert(mensagem);
}

// --- Controle do menu mobile (não mexi aqui, só copie) ---

const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  navMenu.classList.toggle('open');
});

document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && e.target !== menuToggle) {
    navMenu.classList.remove('open');
  }
});

// --- Controle de exibição QR Code e botão vendedora ---

const selectPagamento = document.getElementById("pagamento");
const qrcode = document.getElementById("qrcode");
const botaoVendedora = document.getElementById("botao-vendedora");

selectPagamento.addEventListener("change", function () {
  qrcode.classList.toggle("hidden", this.value !== "pix");
  botaoVendedora.classList.toggle("hidden", this.value === "");
});

// --- Lógica para carregar item via URL uma vez ---

const params = new URLSearchParams(window.location.search);
const nomeItem = params.get('item');
const precoItem = parseFloat(params.get('preco'));

if (nomeItem && !isNaN(precoItem)) {
  // Verifica se o item já existe para evitar duplicação (opcional)
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const jaTem = carrinho.some(i => i.nome === nomeItem && i.preco === precoItem);

  if (!jaTem) {
    adicionarAoCarrinho(nomeItem, precoItem);
  }
} else if (nomeItem && isNaN(precoItem)) {
  alert("Produto inválido! Retorne à página anterior.");
}

// --- Inicializa carrinho na tela assim que a página carregar ---

window.addEventListener('DOMContentLoaded', atualizarCarrinho);

// --- Expor funções globais para botão onclick no HTML ---

window.adicionarAoCarrinho = adicionarAoCarrinho;
window.removerDoCarrinho = removerDoCarrinho;
window.enviarParaCliente = enviarParaCliente;
window.enviarParaVendedora = enviarParaVendedora;
