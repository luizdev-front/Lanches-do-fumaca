 // Exemplo de pedido vindo da página anterior (pode vir via localStorage, por exemplo)
const pedido = JSON.parse(localStorage.getItem('pedido')) || {};

// Referências DOM
const produtoDiv = document.getElementById('produto');
const pagamentoSelect = document.getElementById('pagamento');
const qrcodeDiv = document.getElementById('qrcode');
const botaoVendedora = document.getElementById('botao-vendedora');

const chavePix = "48567777852"; // Coloque sua chave PIX aqui
let qrcode = null;

// Dados fixos dos produtos (mesmo do cardápio)
const produtos = [
  { id: 1, nome: "X-Burguer", preco: 15.00 },
  { id: 2, nome: "X-Salada", preco: 18.00 },
  { id: 3, nome: "Pastel de Queijo", preco: 10.00 },
  { id: 4, nome: "Açaí 300ml", preco: 12.00 },
  { id: 5, nome: "Refrigerante 500ml", preco: 7.00 }
];

// Função para mostrar os produtos do pedido
function mostrarPedido() {
  produtoDiv.innerHTML = '';
  let total = 0;

  if (Object.keys(pedido).length === 0) {
    produtoDiv.textContent = "Nenhum item no pedido.";
    botaoVendedora.classList.add('hidden');
    return;
  }

  const ul = document.createElement('ul');

  produtos.forEach(prod => {
    if (pedido[prod.id]) {
      const li = document.createElement('li');
      const qtd = pedido[prod.id];
      li.textContent = `${prod.nome} x ${qtd} = R$ ${(prod.preco * qtd).toFixed(2)}`;
      ul.appendChild(li);
      total += prod.preco * qtd;
    }
  });

  produtoDiv.appendChild(ul);

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
  if (pagamentoSelect.value === 'pix') {
    // Mostrar QR Code PIX
    let total = 0;
    produtos.forEach(prod => {
      if (pedido[prod.id]) {
        total += prod.preco * pedido[prod.id];
      }
    });
    qrcodeDiv.classList.remove('hidden');
    gerarQRCode(total.toFixed(2));
  } else {
    qrcodeDiv.classList.add('hidden');
    if (qrcode) qrcode.clear();
  }
});

// Função para enviar mensagem para o cliente (visualizar)
function enviarParaCliente() {
  const nome = document.getElementById('nome').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const pagamento = pagamentoSelect.value;

  if (!nome || !endereco || !pagamento) {
    alert("Preencha todos os dados para entrega e forma de pagamento.");
    return;
  }

  let mensagem = `Olá ${nome}, seu pedido está: \n`;

  produtos.forEach(prod => {
    if (pedido[prod.id]) {
      mensagem += `- ${prod.nome} x ${pedido[prod.id]}\n`;
    }
  });

  let total = 0;
  produtos.forEach(prod => {
    if (pedido[prod.id]) {
      total += prod.preco * pedido[prod.id];
    }
  });

  mensagem += `Total: R$ ${total.toFixed(2)}\n`;
  mensagem += `Endereço: ${endereco}\n`;
  mensagem += `Pagamento: ${pagamento === 'pix' ? 'PIX' : pagamento === 'credito' ? 'Cartão de Crédito' : 'Cartão de Débito'}\n`;
  mensagem += pagamento === 'pix' ? 'Pague utilizando o QR Code PIX acima.' : '';

  alert(mensagem); // só visualiza, não envia
}

// Função para enviar pedido para a vendedora via WhatsApp
function enviarParaVendedora() {
  const nome = document.getElementById('nome').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const pagamento = pagamentoSelect.value;

  if (!nome || !endereco || !pagamento) {
    alert("Preencha todos os dados para entrega e forma de pagamento.");
    return;
  }

  let mensagem = `Novo pedido:\nCliente: ${nome}\nEndereço: ${endereco}\nForma de pagamento: ${
    pagamento === 'pix' ? 'PIX' : pagamento === 'credito' ? 'Cartão de Crédito' : 'Cartão de Débito'
  }\nItens:\n`;

  let total = 0;

  produtos.forEach(prod => {
    if (pedido[prod.id]) {
      mensagem += `- ${prod.nome} x ${pedido[prod.id]}\n`;
      total += prod.preco * pedido[prod.id];
    }
  });

  mensagem += `Total: R$ ${total.toFixed(2)}`;

  // Número da vendedora (exemplo)
  const telefone = '5513988799046';

  const url = `https://api.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
}

// Inicializa
mostrarPedido();

// Botões
window.enviarParaCliente = enviarParaCliente;
window.enviarParaVendedora = enviarParaVendedora;
;
const pedido = JSON.parse(localStorage.getItem('pedido')) || {};
