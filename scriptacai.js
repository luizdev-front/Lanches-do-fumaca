 document.addEventListener("DOMContentLoaded", () => {
  // Recupera carrinho do localStorage ou cria vazio
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  // Elementos Açaí
  const selectTamanho = document.getElementById('acai-tamanho');
  const checkAcompanhamentos = Array.from(document.querySelectorAll('.acompanhamento-acai'));
  const checkNutellaAcai = document.getElementById('acai-extra-nutella');
  const precoAcaiSpan = document.getElementById('preco-acai');
  const btnAdicionarAcai = document.getElementById('adicionar-acai');

  // Elementos Milkshake
  const radiosSabores = Array.from(document.querySelectorAll('input[name="sabor"]'));
  const checkNutellaMilk = document.getElementById('milkshake-extra-nutella');
  const precoMilkshakeSpan = document.getElementById('preco-milkshake');
  const btnAdicionarMilkshake = document.getElementById('adicionar-milkshake');

  // Função para atualizar preço do açaí
  function atualizarPrecoAcai() {
    let preco = parseFloat(selectTamanho.selectedOptions[0].dataset.preco) || 0;
    if (checkNutellaAcai.checked) preco += 7;
    // Se quiser cobrar por acompanhamento, aqui adiciona
    precoAcaiSpan.textContent = preco.toFixed(2);
  }

  // Função para atualizar preço do milkshake
  function atualizarPrecoMilkshake() {
    const saborSelecionado = radiosSabores.find(r => r.checked);
    let preco = saborSelecionado ? parseFloat(saborSelecionado.dataset.preco) : 0;
    if (checkNutellaMilk.checked) preco += 7;
    precoMilkshakeSpan.textContent = preco.toFixed(2);
  }

  // Função para salvar carrinho no localStorage
  function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }

  // Função para adicionar item ao carrinho e salvar
  function adicionarItemAoCarrinho(item) {
    // Verifica se já existe item igual no carrinho (mesmo produto + opções)
    const index = carrinho.findIndex(i => JSON.stringify(i) === JSON.stringify(item));
    if (index > -1) {
      carrinho[index].quantidade += 1;
    } else {
      carrinho.push(item);
    }
    salvarCarrinho();
    alert(`Adicionado ao carrinho: ${item.produto} - R$ ${item.preco.toFixed(2)}`);
  }

  // Eventos para atualizar preço
  selectTamanho.addEventListener('change', atualizarPrecoAcai);
  checkAcompanhamentos.forEach(cb => cb.addEventListener('change', atualizarPrecoAcai));
  checkNutellaAcai.addEventListener('change', atualizarPrecoAcai);

  radiosSabores.forEach(r => r.addEventListener('change', atualizarPrecoMilkshake));
  checkNutellaMilk.addEventListener('change', atualizarPrecoMilkshake);

  atualizarPrecoAcai();
  atualizarPrecoMilkshake();

  // Evento botão adicionar açaí
  btnAdicionarAcai.addEventListener('click', () => {
    const tamanho = selectTamanho.value;
    const acompanhamentos = checkAcompanhamentos.filter(c => c.checked).map(c => c.value);
    const nutella = checkNutellaAcai.checked;

    let preco = parseFloat(precoAcaiSpan.textContent) || 0;

    const item = {
      produto: 'Açaí',
      tamanho,
      acompanhamentos,
      nutella,
      preco,
      quantidade: 1
    };

    adicionarItemAoCarrinho(item);
  });

  // Evento botão adicionar milkshake
  btnAdicionarMilkshake.addEventListener('click', () => {
    const saborSelecionado = radiosSabores.find(r => r.checked);
    const sabor = saborSelecionado ? saborSelecionado.value : '';
    const nutella = checkNutellaMilk.checked;

    let preco = parseFloat(precoMilkshakeSpan.textContent) || 0;

    const item = {
      produto: 'Milkshake',
      tamanho: '400 ml',
      sabor,
      nutella,
      preco,
      quantidade: 1
    };

    adicionarItemAoCarrinho(item);
  });
});