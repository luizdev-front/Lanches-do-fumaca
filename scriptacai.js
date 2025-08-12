MENU HAMBÚRGUER
--------------------------- */
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');

menuBtn.addEventListener('click', () => {
  menu.classList.toggle('open'); // usa .open do seu CSS
});

/* ---------------------------
   AÇAÍ - cálculo já existente
--------------------------- */
const acaiTamanho = document.getElementById("acai-tamanho");
const acaiNutella = document.getElementById("acai-extra-nutella");
const acompanhamentosAcai = document.querySelectorAll(".acompanhamento-acai");
const precoAcaiSpan = document.getElementById("preco-acai");

function calcularPrecoAcai() {
  let preco = parseFloat(acaiTamanho.selectedOptions[0].dataset.preco);
  if (acaiNutella.checked) preco += 7;
  precoAcaiSpan.textContent = preco.toFixed(2);
  return preco;
}

document.getElementById("adicionar-acai").addEventListener("click", () => {
  const tamanho = acaiTamanho.value;
  const preco = calcularPrecoAcai();
  const acompanhamentos = Array.from(acompanhamentosAcai)
    .filter(el => el.checked)
    .map(el => el.value)
    .join(", ");
  const extras = acompanhamentos ? ` com ${acompanhamentos}` : "";
  const nutella = acaiNutella.checked ? " + Nutella" : "";
  const item = `Açaí ${tamanho}${extras}${nutella}`;

  window.location.href = `pedido.html?item=${encodeURIComponent(item)}&preco=${preco.toFixed(2)}`;
});

// Atualiza preço ao alterar seleção
acaiTamanho.addEventListener("change", calcularPrecoAcai);
acaiNutella.addEventListener("change", calcularPrecoAcai);
acompanhamentosAcai.forEach(cb => cb.addEventListener("change", calcularPrecoAcai));

calcularPrecoAcai();

/* ---------------------------
   MILKSHAKE - preço fixo
--------------------------- */
const precoMilkshakeSpan = document.getElementById("preco-milkshake");
const precoMilkshake = 15.00; // fixo

// sempre mostra o preço ao carregar
precoMilkshakeSpan.textContent = precoMilkshake.toFixed(2);

document.getElementById("adicionar-milkshake").addEventListener("click", () => {
  const saborSelecionado = document.querySelector('input[name="sabor"]:checked').value;
  const item = `Milkshake ${saborSelecionado} 400 ml`;
  window.location.href = `pedido.html?item=${encodeURIComponent(item)}&preco=${precoMilkshake.toFixed(2)}`;
});
</script>