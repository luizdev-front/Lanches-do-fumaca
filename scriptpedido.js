document.addEventListener('DOMContentLoaded', () => {
  // ================================
  // 1️⃣ Função para buscar bairros e taxas via API
  // ================================
  async function buscarBairros() {
    try {
      const resposta = await fetch('https://suaapi.com/bairros'); // Substitua pela URL da sua API
      if (!resposta.ok) throw new Error('Erro ao buscar dados da API');

      const dados = await resposta.json();
      // Espera-se algo como: [{ bairro: 'MARÉ MANSA', taxa: 4.00 }, ...]
      return dados;
    } catch (erro) {
      console.error('Falha ao buscar bairros:', erro);
      // Retorna array vazio para não quebrar o restante do código
      return [];
    }
  }

  // ================================
  // 2️⃣ Variáveis
  // ================================
  const botaoVendedora = document.getElementById('finalizar-pedido');
  const pagamentoSelect = document.getElementById('pagamento');
  const pixDiv = document.getElementById('pix-div');

  // Função mostrarCarrinho já existente
  function mostrarCarrinho() {
    // Seu código para mostrar itens do carrinho
  }

  // ================================
  // 3️⃣ Inicializa o carrinho e busca bairros
  // ================================
  let bairrosTaxas = [];
  async function init() {
    bairrosTaxas = await buscarBairros();
    mostrarCarrinho();
  }

  init();

  // ================================
  // 4️⃣ Listener do botão
  // ================================
  botaoVendedora.addEventListener('click', finalizarPedido);

  // ================================
  // 5️⃣ Função finalizarPedido
  // ================================
  function finalizarPedido() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (carrinho.length === 0) {
      alert('Seu pedido está vazio!');
      return;
    }

    const nomeCliente = document.getElementById('nome').value.trim();
    const enderecoCliente = document.getElementById('endereco').value.trim().toUpperCase();
    const observacoes = document.getElementById('observacoes').value.trim();
    const formaPagamento = pagamentoSelect.value;

    if (!nomeCliente || !enderecoCliente || !formaPagamento) {
      alert('Preencha nome, endereço e forma de pagamento!');
      return;
    }

    // ================================
    // 6️⃣ Validação do bairro e taxa
    // ================================
    const bairroEncontrado = bairrosTaxas.find(({ bairro }) =>
      enderecoCliente.includes(bairro.toUpperCase())
    );

    if (!bairroEncontrado) {
      const bairros