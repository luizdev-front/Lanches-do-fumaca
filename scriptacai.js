
/* ---------------------------
   MENU MOBILE
--------------------------- */
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');

menuBtn.addEventListener('click', () => {
  menu.classList.toggle('open');
});

/* ---------------------------
   AÇAÍ
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

acaiTamanho.addEventListener("change", calcularPrecoAcai);
acaiNutella.addEventListener("change", calcularPrecoAcai);
acompanhamentosAcai.forEach(cb => cb.addEventListener("change", calcularPrecoAcai));

calcularPrecoAcai();

/* ---------------------------
   MILKSHAKE
--------------------------- */
const precoMilkshakeSpan = document.getElementById("preco-milkshake");

function atualizarPrecoMilkshake() {
  const sabor = document.querySelector('input[name="sabor"]:checked');
  let preco = parseFloat(sabor.dataset.preco);
  precoMilkshakeSpan.textContent = preco.toFixed(2);
}

document.getElementById("adicionar-milkshake").addEventListener("click", () => {
  const saborSelecionado = document.querySelector('input[name="sabor"]:checked').value;
  const preco = parseFloat(document.querySelector('input[name="sabor"]:checked').dataset.preco);
  const item = `Milkshake ${saborSelecionado} 400 ml`;

  window.location.href = `pedido.html?item=${encodeURIComponent(item)}&preco=${preco.toFixed(2)}`;
});

document.querySelectorAll('input[name="sabor"]').forEach(el =>
  el.addEventListener('change', atualizarPrecoMilkshake)
);

atualizarPrecoMilkshake();

/* ---------------------------
   VITAMINA DE AÇAÍ
--------------------------- */
const precoBaseVitamina = 20.00;
const precoVitaminaSpan = document.getElementById('preco-vitamina');
const btnAdicionarVitamina = document.getElementById('adicionar-vitamina');
const extrasVitamina = document.querySelectorAll('#vitamina-form .extra');

// mostra o preço fixo
precoVitaminaSpan.textContent = precoBaseVitamina.toFixed(2);

btnAdicionarVitamina.addEventListener('click', () => {
  const escolhidos = Array.from(extrasVitamina)
    .filter(e => e.checked)
    .map(e => e.parentElement.textContent.trim());

  const adicionais = escolhidos.length > 0 ? ` com ${escolhidos.join(", ")}` : "";
  const item = `Vitamina de Açaí 400 ml${adicionais}`;

  window.location.href = `pedido.html?item=${encodeURIComponent(item)}&preco=${precoBaseVitamina.toFixed(2)}`;
});