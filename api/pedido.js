let numeroGlobal = 0;

function normalizar(s) {
  return s.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const bairrosTaxas = [
  { bairro: "MARÉ MANSA", taxa: 4 },
  { bairro: "VILA RÃ", taxa: 6 },
  { bairro: "AREIÃO", taxa: 6 },
  { bairro: "PENÍNSULA", taxa: 6 },
  { bairro: "PEDREIRA", taxa: 8 },
];

// Agora com cartão
const formasPagamentoAceitas = ["pix", "dinheiro", "cartão"];

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  try {
    const { carrinho = [], cliente = {}, pagamento } = req.body;

    if (!carrinho.length || !cliente.nome || !cliente.bairro || !pagamento) {
      return res.status(400).json({ erro: "Dados incompletos" });
    }

    const tipoPagamento = pagamento.toLowerCase();
    if (!formasPagamentoAceitas.includes(tipoPagamento)) {
      return res.status(400).json({ erro: "Forma de pagamento não aceita" });
    }

    const bairroNormalizado = normalizar(cliente.bairro);
    const taxaObj = bairrosTaxas.find(
      (b) => normalizar(b.bairro) === bairroNormalizado
    );

    if (!taxaObj) {
      return res.status(400).json({ erro: "Bairro não atendido" });
    }

    const taxaEntrega = taxaObj.taxa;

    const totalCarrinho = carrinho.reduce(
      (acc, item) => acc + (item.preco ? item.preco : 0),
      0
    );

    const totalFinal = totalCarrinho + taxaEntrega;

    numeroGlobal++;
    const numeroPedido = numeroGlobal;

    let mensagem = `Pedido nº ${numeroPedido}\n\n`;

    mensagem += `Itens:\n`;
    carrinho.forEach((item) => {
      const adicionais = item.adicionais?.length
        ? ` (Adicionais: ${item.adicionais.join(", ")})`
        : "";
      mensagem += `• ${item.nome} — R$ ${item.preco?.toFixed(2)}${adicionais}\n`;
    });

    mensagem += `\nTaxa de entrega: R$ ${taxaEntrega.toFixed(2)}\n`;
    mensagem += `Total: R$ ${totalFinal.toFixed(2)}\n\n`;

    mensagem += `Cliente:\n`;
    mensagem += `• Nome: ${cliente.nome}\n`;
    mensagem += `• Endereço: ${cliente.rua}, nº ${cliente.numero}\n`;
    mensagem += `• Bairro: ${cliente.bairro}\n`;
    if (cliente.obs) mensagem += `• Observações: ${cliente.obs}\n`;

    mensagem += `\nPagamento: ${tipoPagamento}\n`;

    if (tipoPagamento === "pix") {
      mensagem += `Chave PIX: 13996039919\n`;
    }

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
