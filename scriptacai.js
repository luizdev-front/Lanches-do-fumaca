
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
document.addEventListener("DOMContentLoaded", () => {

  // ===== AÇAÍ =====
  document.getElementById("adicionar-acai").addEventListener("click", () => {
    const tamanhoSelect = document.getElementById("acai-tamanho");
    const tamanho = tamanhoSelect.value;
    const precoBase = parseFloat(tamanhoSelect.options[tamanhoSelect.selectedIndex].dataset.preco);

    let adicionais = [];
    document.querySelectorAll(".acompanhamento-acai:checked").forEach(chk => {
      adicionais.push(chk.value);
    });

    let precoFinal = precoBase;

    // Nutella extra
    if (document.getElementById("acai-extra-nutella").checked) {
      adicionais.push("Nutella");
      precoFinal += 7.00;
    }

    const produto = {
      nome: `Açaí ${tamanho}`,
      adicionais: adicionais,
      preco: precoFinal
    };

    adicionarAoCarrinho(produto);
    alert(`Açaí adicionado ao carrinho! Total: R$ ${precoFinal.toFixed(2)}`);
  });


  // ===== MILKSHAKE =====
  document.getElementById("adicionar-milkshake").addEventListener("click", () => {
    const saborSelecionado = document.querySelector("input[name='sabor']:checked");
    const sabor = saborSelecionado.value;
    const preco = parseFloat(saborSelecionado.dataset.preco);

    const produto = {
      nome: `Milkshake 400ml - ${sabor}`,
      adicionais: [],
      preco: preco
    };

    adicionarAoCarrinho(produto);
    alert(`Milkshake ${sabor} adicionado ao carrinho! Total: R$ ${preco.toFixed(2)}`);
  });


  // ===== VITAMINA =====
  document.getElementById("adicionar-vitamina").addEventListener("click", () => {
    const precoBase = 20.00;
    let adicionais = [];

    document.querySelectorAll(".extra:checked").forEach(chk => {
      adicionais.push(chk.parentElement.textContent.trim());
    });

    const produto = {
      nome: "Vitamina de Açaí 400ml",
      adicionais: adicionais,
      preco: precoBase
    };

    adicionarAoCarrinho(produto);
    alert(`Vitamina adicionada ao carrinho! Total: R$ ${precoBase.toFixed(2)}`);
  });


  // ===== Função genérica para salvar no localStorage =====
  function adicionarAoCarrinho(produto) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho.push(produto);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }

});