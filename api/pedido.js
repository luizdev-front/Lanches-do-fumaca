let numeroGlobal = 0;

// Normaliza texto para comparar acentos, caixa alta/baixa, etc.
function normalizar(s) {
  return s.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Bairros e taxas válidas
const bairrosTaxas = [
  { bairro: "MARÉ MANSA", taxa: 4 },
  { bairro: "VILA RÃ", taxa: 6 },
  { bairro: "AREIÃO", taxa: 6 },
  { bairro: "PENÍNSULA", taxa: 6 },
  { bairro: "PEDREIRA", taxa: 8 },
];

// Formas de pagamento aceitas (sem depender de acentos)
const formasPagamentoAceitas = [
  "PIX",
  "DINHEIRO",
  "CARTAO",
  "CARTÃO",
];

export default function handler(req, res) {
  // Apenas POST é permitido
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  try {
    const { carrinho = [], cliente = {}, pagamento } = req.body;

    // Validação básica
    if (!carrinho.length || !cliente.nome || !cliente.bairro || !pagamento) {
      return res.status(400).json({ erro: "Dados incompletos" });
    }

    // Normaliza o bairro informado pelo cliente
    const bairroInformado = normalizar(cliente.bairro);

    // Encontra o bairro correto mesmo que a pessoa escreva errado
    const taxaObj = bairrosTaxas.find((b) =>
      normalizar(b.bairro).includes(bairroInformado) ||
      bairroInformado.includes(normalizar(b.bairro))
    );

    if (!taxaObj) {
      return res.status(400).json({ erro: "Bairro não atendido" });
    }

    // Calcula valores
    const taxaEntrega = taxaObj.taxa;
    const totalCarrinho = carrinho.reduce(
      (acc, item) => acc + (item.preco ? item.preco : 0),
      0
    );
    const totalFinal = totalCarrinho + taxaEntrega;

    // Incrementa número do pedido
    numeroGlobal++;
    const numeroPedido = numeroGlobal;

    // Verifica forma de pagamento
    const tipoPagamento = normalizar(pagamento);

    if (!formasPagamentoAceitas.includes(tipoPagamento)) {
      return res.status(400).json({ erro: "Forma de pagamento não aceita" });
    }

    // Monta mensagem do WhatsApp
    let mensagem = `🍽️ *Pedido nº ${numeroPedido}*\n\n`;

    mensagem += `🛒 *Itens do pedido:*\n`;
    carrinho.forEach((item) => {
      const adicionais = item.adicionais?.length
        ? `\n   ➕ Adicionais: ${item.adicionais.join(", ")}`
        : "";
      mensagem += `• ${item.nome} — R$ ${item.preco?.toFixed(2) || "0.00"}${adicionais}\n`;
    });

    mensagem += `\n🚚 *Taxa de entrega:* R$ ${taxaEntrega.toFixed(2)}\n`;
    mensagem += `💰 *Total:* R$ ${totalFinal.toFixed(2)}\n\n`;

    mensagem += `👤 *Dados do cliente:*\n`;
    mensagem += `• Nome: ${cliente.nome}\n`;
    mensagem += `• Endereço: ${cliente.rua}, nº ${cliente.numero}\n`;
    mensagem += `• Bairro: ${cliente.bairro}\n`;
    if (cliente.obs) mensagem += `• Observações: ${cliente.obs}\n`;

    mensagem += `\n💳 *Forma de pagamento:* ${pagamento}\n`;

    if (tipoPagamento === "PIX") {
      mensagem += `🔑 Chave PIX: 13996039919\n`;
      mensagem += `📌 Envie o comprovante aqui no WhatsApp.\n`;
    }

    // Resposta final
    return res.status(200).json({
      mensagem,
      totalFinal,
      numeroPedido,
    });

  } catch (err) {
    console.error("Erro interno:", err);
    return res.status(500).json({ erro: "Erro interno no servidor" });
  }
}
