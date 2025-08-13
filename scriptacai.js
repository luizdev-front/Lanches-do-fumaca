 document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("menu");

  menuBtn.addEventListener("click", function () {
    if (menu.style.display === "block") {
      menu.style.display = "none";
    } else {
      menu.style.display = "block";
    }
  });

  // Opcional: Esconde o menu se clicar fora dele
  document.addEventListener("click", function (e) {
    if (!menu.contains(e.target) && e.target !== menuBtn) {
      menu.style.display = "none";
    }
  });
});
 document.addEventListener("DOMContentLoaded", () => {
  const carrinho = [];

  // --- Açaí ---
  const selectTamanho = document.getElementById('acai-tamanho');
  const acompanhamentosAcai = Array.from(document.querySelectorAll('.acompanhamento-acai'));
  const extraAcai = document.getElementById('acai-extra-nutella');
  const precoAcaiSpan = document.getElementById('preco-acai');
  const botaoAcai = document.getElementById('adicionar-acai');

  function atualizarPrecoAcai() {
    if (!selectTamanho || !precoAcaiSpan) return;
    const opcao = selectTamanho.selectedOptions[0];
    let preco = parseFloat(opcao.dataset.preco) || 0;

    if (extraAcai && extraAcai.checked) preco += 7.0;

    // (Se quiser cobrar por acompanhamentos, faria aqui)
    precoAcaiSpan.innerText = preco.toFixed(2);
    return preco;
  }

  if (selectTamanho) selectTamanho.addEventListener('change', atualizarPrecoAcai);
  acompanhamentosAcai.forEach(cb => cb.addEventListener('change', atualizarPrecoAcai));
  if (extraAcai) extraAcai.addEventListener('change', atualizarPrecoAcai);
  atualizarPrecoAcai();

  if (botaoAcai) {
    botaoAcai.addEventListener('click', () => {
      const tamanho = selectTamanho ? selectTamanho.value : '';
      const acompanhamentos = acompanhamentosAcai.filter(c => c.checked).map(c => c.value);
      const extra = extraAcai && extraAcai.checked ? ['Nutella'] : [];
      const preco = parseFloat(precoAcaiSpan.innerText) || 0;

      const item = {
        produto: 'Açaí',
        tamanho,
        acompanhamentos,
        extra,
        preco,
        quantidade: 1,
      };
      carrinho.push(item);
      console.log('Carrinho:', carrinho);
      alert(`Adicionado ao carrinho: Açaí - R$ ${preco.toFixed(2)}`);
    });
  }

  // --- Milkshake ---
  const radioSabores = Array.from(document.querySelectorAll('input[name="sabor"]'));
  const extraMilk = document.getElementById('milkshake-extra-nutella');
  const precoMilkSpan = document.getElementById('preco-milkshake');
  const botaoMilk = document.getElementById('adicionar-milkshake');

  function atualizarPrecoMilkshake() {
    let preco = 0;
    const selecionado = radioSabores.find(r => r.checked);
    if (selecionado) {
      preco = parseFloat(selecionado.dataset.preco) || 0;
    }
    if (extraMilk && extraMilk.checked) preco += 7.0;
    if (precoMilkSpan) precoMilkSpan.innerText = preco.toFixed(2);
    return preco;
  }

  radioSabores.forEach(r => r.addEventListener('change', atualizarPrecoMilkshake));
  if (extraMilk) extraMilk.addEventListener('change', atualizarPrecoMilkshake);
  atualizarPrecoMilkshake();

  if (botaoMilk) {
    botaoMilk.addEventListener('click', () => {
      const saborEl = radioSabores.find(r => r.checked);
      const sabor = saborEl ? saborEl.value : '';
      const extra = extraMilk && extraMilk.checked ? ['Nutella'] : [];
      const preco = parseFloat(precoMilkSpan.innerText) || 0;

      const item = {
        produto: 'Milkshake',
        tamanho: '400 ml',
        sabor,
        extra,
        preco,
        quantidade: 1,
      };
      carrinho.push(item);
      console.log('Carrinho:', carrinho);
      alert(`Adicionado ao carrinho: Milkshake de ${sabor} - R$ ${preco.toFixed(2)}`);
    });
  }
});
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


// AÇAÍ
document.getElementById('acai-tamanho').addEventListener('change', atualizarPrecoAcai);
document.getElementById('acai-extra-nutella').addEventListener('change', atualizarPrecoAcai);
document.querySelectorAll('.acompanhamento-acai').forEach(c => c.addEventListener('change', atualizarPrecoAcai));

document.getElementById('adicionar-acai').addEventListener('click', () => {
  const tamanho = document.getElementById('acai-tamanho');
  const nome = `Açaí ${tamanho.value}`;
  let preco = parseFloat(tamanho.selectedOptions[0].dataset.preco);

  if (document.getElementById('acai-extra-nutella').checked) preco += 7;

  const acompanhamentos = Array.from(document.querySelectorAll('.acompanhamento-acai:checked'))
    .map(el => el.value)
    .join(', ');

  const itemFinal = acompanhamentos ? `${nome} com ${acompanhamentos}` : nome;

  window.location.href = `pedido.html?item=${encodeURIComponent(itemFinal)}&preco=${preco.toFixed(2)}`;
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