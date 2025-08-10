// ACAI
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