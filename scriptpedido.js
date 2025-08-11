 // Referências DOM
const produtoDiv = document.getElementById('produto');
const pagamentoSelect = document.getElementById('pagamento');
const qrcodeDiv = document.getElementById('qrcode');
const botaoVendedora = document.getElementById('botao-vendedora');
const chavePix = "48567777852"; // Coloque sua chave PIX aqui
let qrcode = null;

// Função para mostrar os produtos do carrinho
function mostrarCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  produtoDiv.innerHTML = '';
  let total = 0;

  if (carrinho.length === 0) {
    produtoDiv.textContent = "Nenhum item no pedido.";
    botaoVendedora.classList.add('hidden');
    return;
  }

  carrinho.forEach(item => {
    const p = document.createElement('p');
    p.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
    produtoDiv.appendChild(p);
    total += item.preco;
  });

  // Mostrar total
  const pTotal = document.createElement('p');
  pTotal.innerHTML = `<strong>Total: R$ ${total.toFixed(2)}</strong>`;
  produtoDiv.appendChild(pTotal);

  botaoVendedora.classList.remove('hidden');
}

// Função para gerar QR Code PIX
function gerarQRCode(valor) {
  if (qrcode) {
    qrcode.clear();
  } else {
    qrcode = new QRCode(qrcodeDiv, {
      width: 200,
      height: 200,
      colorDark: "#000",
      colorLight: "#fff",
      correctLevel: QRCode.CorrectLevel.H
    });
  }
  const textoPix = `pix:${chavePix}?amount=${valor}`;
  qrcode.makeCode(textoPix);
}

// Monitorar mudança na forma de pagamento
pagamentoSelect.addEventListener('change', () => {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  let total = 0;
  carrinho.forEach(item => {
    total += item.preco;
  });

  if (pagamentoSelect.value === 'pix' && total > 0) {
    qrcodeDiv.classList.remove('hidden');
    gerarQRCode(total.toFixed(2));
  } else {
    qrcodeDiv.classList.add('hidden');
    if (qrcode) qrcode.clear();
  }
});

// Função para enviar mensagem para o cliente (visualizar)
function enviarParaCliente() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const nome = document.getElementById('nome').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const pagamento = pagamentoSelect.value;
  const observacoes = document.getElementById('observacoes').value.trim();

  if (!nome || !endereco || !pagamento) {
    alert("Preencha todos os dados para entrega e forma de pagamento.");
    return;
  }

  let mensagem = `Olá ${nome}, seu pedido está:\n`;
  carrinho.forEach(item => {
    mensagem += `- ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
  });

  let total = 0;
  carrinho.forEach(item => {
    total += item.preco;
  });

  mensagem += `Total: R$ ${total.toFixed(2)}\n`;
  mensagem += `Endereço: ${endereco}\n`;
  mensagem += `Pagamento: ${pagamento === 'pix' ? 'PIX' : pagamento === 'credito' ? 'Cartão de Crédito' : 'Cartão de Débito'}\n`;
  if (observacoes) mensagem += `Observações: ${observacoes}\n`;
  mensagem += pagamento === 'pix' ? 'Pague utilizando o QR Code PIX acima.' : '';

  alert(mensagem); // só visualiza, não envia
}

// Função para enviar pedido para a vendedora via WhatsApp
function enviarParaVendedora() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const nome = document.getElementById('nome').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const pagamento = pagamentoSelect.value;
  const observacoes = document.getElementById('observacoes').value.trim();

  if (!nome || !endereco || !pagamento) {
    alert("Preencha todos os dados para entrega e forma de pagamento.");
    return;
  }

  let mensagem = `Novo pedido:\nCliente: ${nome}\nEndereço: ${endereco}\nForma de pagamento: ${
    pagamento === 'pix' ? 'PIX' : pagamento === 'credito' ? 'Cartão de Crédito' : 'Cartão de Débito'
  }\nItens:\n`;

  let total = 0;
  carrinho.forEach(item => {
    mensagem += `- ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
    total += item.preco;
  });

  mensagem += `Total: R$ ${total.toFixed(2)}\n`;
  if (observacoes) mensagem += `Observações: ${observacoes}\n`;

  // Número da vendedora (exemplo)
  const telefone = '5513988799046';

  const url = `https://api.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
}

// Inicializa
mostrarCarrinho();

// Botões
window.enviarParaCliente = enviarParaCliente;
window.enviarParaVendedora = enviarParaVendedora;