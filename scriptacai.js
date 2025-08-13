
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


function atualizarPrecoAcai() {
  const tamanho = document.getElementById('acai-tamanho');
  let preco = parseFloat(tamanho.selectedOptions[0].dataset.preco);

  if (document.getElementById('acai-extra-nutella').checked) preco += 7;

  document.getElementById('preco-acai').textContent = preco.toFixed(2);
}


// MILKSHAKE
document.getElementById('adicionar-milkshake').addEventListener('click', () => {
  const sabor = document.querySelector('input[name="sabor"]:checked');
  const nome = `Milkshake ${sabor.value}`;
  let preco = parseFloat(sabor.dataset.preco);

  if (document.getElementById('milkshake-extra-nutella').checked) preco += 7;

  window.location.href = `pedido.html?item=${encodeURIComponent(nome)}&preco=${preco.toFixed(2)}`;
});

document.querySelectorAll('input[name="sabor"], #milkshake-extra-nutella')
  .forEach(el => el.addEventListener('change', atualizarPrecoMilkshake));

function atualizarPrecoMilkshake() {
  const sabor = document.querySelector('input[name="sabor"]:checked');
  let preco = parseFloat(sabor.dataset.preco);

  if (document.getElementById('milkshake-extra-nutella').checked) preco += 7;

  document.getElementById('preco-milkshake').textContent = preco.toFixed(2);
}
const precoBaseVitamina = 20.00;
const vitaminaNutella = document.getElementById('vitamina-extra-nutella');
const precoVitaminaSpan = document.getElementById('preco-vitamina');
const btnAdicionarVitamina = document.getElementById('adicionar-vitamina');

function atualizarPrecoVitamina() {
  let preco = precoBaseVitamina;
  if (vitaminaNutella.checked) preco += 7.00;
  precoVitaminaSpan.textContent = preco.toFixed(2);
}

vitaminaNutella.addEventListener('change', atualizarPrecoVitamina);

btnAdicionarVitamina.addEventListener('click', () => {
  const item = {
    produto: "Vitamina de Açaí 400 ml",
    extraNutella: vitaminaNutella.checked,
    preco: parseFloat(precoVitaminaSpan.textContent)
  };

  // Aqui você adapta para o seu carrinho
  console.log("Item adicionado:", item);
  alert("Vitamina de Açaí adicionada ao carrinho!");
});

atualizarPrecoVitamina();
</script>

