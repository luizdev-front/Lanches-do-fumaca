/* ---------------------------
// Menu Mobile toggle
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('menu');

  menuBtn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  // Elementos Açaí
  const acaiTamanho = document.getElementById("acai-tamanho");
  const acaiNutella = document.getElementById("acai-extra-nutella");
  const acompanhamentosAcai = document.querySelectorAll(".acompanhamento-acai");
  const precoAcaiSpan = document.getElementById("preco-acai");

  // Elementos Milkshake
  const precoMilkshakeSpan = document.getElementById("preco-milkshake");
  const saborRadios = document.querySelectorAll("input[name='sabor']");

  // Elementos Vitamina
  const precoVitaminaSpan = document.getElementById("preco-vitamina");

  // Carrinho
  const carrinhoList = document.getElementById("carrinho-list");
  const totalSpan = document.getElementById("total");
  const finalizarBtn = document.getElementById("finalizar-pedido");

  // Função para calcular preço do Açaí
  function calcularPrecoAcai() {
    let preco = parseFloat(acaiTamanho.selectedOptions[0].dataset.preco);
    if (acaiNutella.checked) preco += 7;
    precoAcaiSpan.textContent = preco.toFixed(2);
    return preco;
  }

  // Atualiza preço milkshake
  function atualizarPrecoMilkshake() {
    const selecionado = document.querySelector("input[name='sabor']:checked");
    precoMilkshakeSpan.textContent = parseFloat(selecionado.dataset.preco).toFixed(2);
  }

  // Recupera carrinho do localStorage
  function recuperarCarrinho() {
    return JSON.parse(localStorage.getItem("carrinho")) || [];
  }

  // Salva carrinho no localStorage
  function salvarCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }

  // Atualiza UI do carrinho
  function atualizarCarrinhoVisual() {
    const carrinho = recuperarCarrinho();
    carrinhoList.innerHTML = "";
    let total = 0;

    if (carrinho.length === 0) {
      carrinhoList.innerHTML = "<li>Seu carrinho está vazio.</li>";
      finalizarBtn.disabled = true;
      totalSpan.textContent = "Total: R$ 0.00";
      return;
    }

    carrinho.forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = `${item.nome} (${item.adicionais.length > 0 ? item.adicionais.join(", ") : "Sem adicionais"}) - R$ ${item.preco.toFixed(2)}`;
      carrinhoList.appendChild(li);
      total += item.preco;
    });

    totalSpan.textContent = `Total: R$ ${total.toFixed(2)}`;
    finalizarBtn.disabled = false;
  }

  // Adiciona item ao carrinho e atualiza UI e storage
  function adicionarAoCarrinho(produto) {
    const carrinho = recuperarCarrinho();
    carrinho.push(produto);
    salvarCarrinho(carrinho);
    atualizarCarrinhoVisual();
  }

  // Eventos

  // Atualizar preço açaí ao mudar opções
  acaiTamanho.addEventListener("change", calcularPrecoAcai);
  acaiNutella.addEventListener("change", calcularPrecoAcai);
  acompanhamentosAcai.forEach(cb => cb.addEventListener("change", calcularPrecoAcai));
  calcularPrecoAcai();

  // Atualizar preço milkshake ao mudar sabor
  saborRadios.forEach(radio => radio.addEventListener("change", atualizarPrecoMilkshake));
  atualizarPrecoMilkshake();

  // Adicionar Açaí ao carrinho
  document.getElementById("adicionar-acai").addEventListener("click", () => {
    const tamanho = acaiTamanho.value;
    const preco = calcularPrecoAcai();
    let adicionais = [];
    document.querySelectorAll(".acompanhamento-acai:checked").forEach(chk => adicionais.push(chk.value));
    if (acaiNutella.checked) adicionais.push("Nutella");

    const produto = {
      nome: `Açaí ${tamanho}`,
      adicionais,
      preco
    };

    adicionarAoCarrinho(produto);
    alert(`Açaí adicionado ao carrinho! Total: R$ ${preco.toFixed(2)}`);
  });

  // Adicionar Milkshake ao carrinho
  document.getElementById("adicionar-milkshake").addEventListener("click", () => {
    const saborSelecionado = document.querySelector("input[name='sabor']:checked");
    const sabor = saborSelecionado.value;
    const preco = parseFloat(saborSelecionado.dataset.preco);

    const produto = {
      nome: `Milkshake 400ml - ${sabor}`,
      adicionais: [],
      preco
    };

    adicionarAoCarrinho(produto);
    alert(`Milkshake ${sabor} adicionado ao carrinho! Total: R$ ${preco.toFixed(2)}`);
  });

  // Adicionar Vitamina ao carrinho
  document.getElementById("adicionar-vitamina").addEventListener("click", () => {
    const precoBase = 20.00;
    let adicionais = [];
    document.querySelectorAll(".extra:checked").forEach(chk => adicionais.push(chk.parentElement.textContent.trim()));

    const produto = {
      nome: "Vitamina de Açaí 400ml",
      adicionais,
      preco: precoBase
    };

    adicionarAoCarrinho(produto);
    alert(`Vitamina adicionada ao carrinho! Total: R$ ${precoBase.toFixed(2)}`);
  });

  // Finalizar pedido via WhatsApp
  finalizarBtn.addEventListener("click", () => {
    const carrinho = recuperarCarrinho();
    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }

    let mensagem = "Olá, gostaria de fazer o pedido:\n\n";
    let total = 0;
    carrinho.forEach((item, i) => {
      mensagem += `${i + 1}. ${item.nome}\n   Adicionais: ${item.adicionais.length > 0 ? item.adicionais.join(", ") : "Nenhum"}\n   Preço: R$ ${item.preco.toFixed(2)}\n\n`;
      total += item.preco;
    });
    mensagem += `Total do pedido: R$ ${total.toFixed(2)}`;

    const telefone = "5511999999999"; // Troque pelo número real no formato internacional
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(mensagem)}`;

    // Limpa carrinho e atualiza visual
    localStorage.removeItem("carrinho");
    atualizarCarrinhoVisual();

    // Abre WhatsApp
    window.open(urlWhatsApp, "_blank");
  });

  // Inicializa carrinho na página
  atualizarCarrinhoVisual();
});
