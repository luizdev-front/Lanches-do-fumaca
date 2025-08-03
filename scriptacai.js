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