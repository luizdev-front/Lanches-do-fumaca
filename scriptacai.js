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

acaiTamanho.addEventListener("change", calcularPrecoAcai);
acaiNutella.addEventListener("change", calcularPrecoAcai);
acompanhamentosAcai.forEach(cb => cb.addEventListener("change", calcularPrecoAcai));

calcularPrecoAcai();

/* ---------------------------
   SALVAR NO LOCALSTORAGE
--------------------------- */
document.addEventListener("DOMContentLoaded", () => {

  // ===== AÇAÍ =====
  document.getElementById("adicionar-acai").addEventListener("click", () => {
    const tamanho = acaiTamanho.value;
    const preco = calcularPrecoAcai();

    let adicionais = [];
    document.querySelectorAll(".acompanhamento-acai:checked").forEach(chk => {
      adicionais.push(chk.value);
    });

    if (acaiNutella.checked) {
      adicionais.push("Nutella");
    }

    const produto = {
      nome: `Açaí ${tamanho}`,
      adicionais: adicionais,
      preco: preco
    };

    adicionarAoCarrinho(produto);
    alert(`Açaí adicionado ao carrinho! Total: R$ ${preco.toFixed(2)}`);
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