const urlParams = new URLSearchParams(window.location.search);
const item = urlParams.get('item');
const preco = urlParams.get('preco');

document.getElementById('produto').textContent = `Você está pedindo: ${item} - R$ ${preco}`;

const pagamento = document.getElementById('pagamento');
const qrcode = document.getElementById('qrcode');
const botaoVendedora = document.getElementById('botao-vendedora');

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

function enviarParaCliente() {
  const nome = document.getElementById('nome').value;
  const endereco = document.getElementById('endereco').value;

  const mensagem = `✅ Pagamento confirmado!\n\n🧾 Pedido: ${item} - R$ ${preco}\n📦 Endereço: ${endereco}\n👤 Nome: ${nome}`;
  const link = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
  window.open(link, '_blank');
}

function enviarParaVendedora() {
  const nome = document.getElementById('nome').value;
  const endereco = document.getElementById('endereco').value;

  const mensagem = `📥 Novo pedido recebido!\n\n🧾 Pedido: ${item} - R$ ${preco}\n💳 Pagamento: ${pagamento.value.toUpperCase()}\n👤 Nome: ${nome}\n📦 Endereço: ${endereco}`;
  const numeroVendedora = "5599999999999"; // Substitua pelo número real
  const link = `https://wa.me/${numeroVendedora}?text=${encodeURIComponent(mensagem)}`;
  window.open(link, '_blank');
}
