   // Carrega item via URL se houver
const params = new URLSearchParams(window.location.search);
const nomeItem = params.get('item');
const precoItem = parseFloat(params.get('preco'));

if (nomeItem && !isNaN(precoItem)) {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho.push({ nome: nomeItem, preco: precoItem });
  localStorage.setItem('carrinho', JSON.stringify(carrinho));

  // 🔔 Envio automático para vendedora (uma vez por item)
  const nomeCliente = "Cliente";
  const endereco = "Retirada no local";
  const pagamento = "Pix";

  let mensagem = Novo pedido de ${nomeCliente}\n\n;
  carrinho.forEach(p => {
    if (!p || typeof p.preco !== 'number' || !p.nome) return;
    mensagem += - ${p.nome} - R$ ${p.preco.toFixed(2)}\n;
  });

  const totalAuto = carrinho.reduce((soma, p) => soma + (p?.preco || 0), 0);
  mensagem += \nTotal: R$ ${totalAuto.toFixed(2)}\nEndereço: ${endereco}\nPagamento: ${pagamento.toUpperCase()};

  const numero = "5513988799046"; // ✅ Seu número
  const url = https://wa.me/${numero}?text=${encodeURIComponent(mensagem)};
  window.open(url, "_blank");
}

// Exibe o carrinho
const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
const divProduto = document.getElementById('produto');
let total = 0;
let texto = '';

carrinho.forEach((p, i) => {
  if (!p || typeof p.preco !== 'number') return;
  total += p.preco;
  texto += `
    <div>
      <p>${p.nome} - R$ ${p.preco.toFixed(2)}
      <button onclick="removerItem(${i})">Remover</button></p>
    </div>
  `;
});

texto += <strong>Total: R$ ${total.toFixed(2)}</strong>;
divProduto.innerHTML = texto;

// Remover item
function removerItem(index) {
  carrinho.splice(index, 1);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  location.reload();
}

// Mostrar QR Code e botão vendedora
const selectPagamento = document.getElementById("pagamento");
const qrcode = document.getElementById("qrcode");
const botaoVendedora = document.getElementById("botao-vendedora");

selectPagamento.addEventListener("change", function () {
  qrcode.classList.toggle("hidden", this.value !== "pix");
  botaoVendedora.classList.toggle("hidden", this.value === "");
});

// Enviar para cliente (alerta)
function enviarParaCliente() {
  const nome = document.getElementById("nome").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const pagamento = selectPagamento.value;

  if (!nome || !endereco || !pagamento) {
    alert("Preencha todos os campos.");
    return;
  }

  let mensagem = Olá, ${nome}!\n\nSeu pedido:\n;
  carrinho.forEach(p => {
    mensagem += - ${p.nome} - R$ ${p.preco.toFixed(2)}\n;
  });
  mensagem += \nTotal: R$ ${total.toFixed(2)}\nEndereço: ${endereco}\nPagamento: ${pagamento};
  alert(mensagem);
}

// Enviar para vendedora (WhatsApp)
function enviarParaVendedora() {
  const nome = document.getElementById("nome").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const pagamento = selectPagamento.value;

  if (!nome || !endereco || !pagamento) {
    alert("Preencha todos os campos.");
    return;
  }

  let mensagem = Novo pedido de ${nome}\n\n;
  carrinho.forEach(p => {
    mensagem += - ${p.nome} - R$ ${p.preco.toFixed(2)}\n;
  });
  mensagem += \nTotal: R$ ${total.toFixed(2)}\nEndereço: ${endereco}\nPagamento: ${pagamento.toUpperCase()};

  const numero = "5513988799046"; // ✅ Seu número
  const url = https://wa.me/${numero}?text=${encodeURIComponent(mensagem)};
  window.open(url, "_blank");
}

// Torna acessível globalmente
window.enviarParaCliente = enviarParaCliente;
window.enviarParaVendedora = enviarParaVendedora;
window.removerItem = removerItem;

// Alerta se item for inválido
if (nomeItem && isNaN(precoItem)) {
  alert("Produto inválido! Retorne à página anterior.");
}