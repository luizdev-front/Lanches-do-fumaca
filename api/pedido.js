export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  try {
    const { carrinho, cliente, pagamento } = req.body;

    if (!carrinho || !cliente || !pagamento) {
      return res.status(400).json({ erro: "Dados incompletos" });
    }

    const bairroNormalizado = normalizar(cliente.bairro);
    const taxaObj = bairrosTaxas.find(
      (b) => normalizar(b.bairro) === bairroNormalizado
    );

    if (!taxaObj) {
      return res.status(400).json({ erro: "Bairro não atendido" });
    }

    const taxaEntrega = taxaObj.taxa;
    const totalCarrinho = carrinho.reduce((acc, item) => acc + (item.preco || 0), 0);
    const totalFinal = totalCarrinho + taxaEntrega;

    numeroGlobal++;
    const numeroPedido = numeroGlobal;

    let mensagem = `*Pedido nº ${numeroPedido}*\n\n`;
    mensagem += `*Itens:*\n`;
    carrinho.forEach((item) => {
      const adicionais = item.adicionais?.length
        ? ` (${item.adicionais.join(", ")})`
        : "";
      mensagem += `- ${item.nome}${adicionais} – R$ ${item.preco.toFixed(2)}\n`;
    });

    mensagem += `\n*Taxa de entrega:* R$ ${taxaEntrega.toFixed(2)}\n`;
    mensagem += `*Total:* R$ ${totalFinal.toFixed(2)}\n\n`;

    mensagem += `*Cliente:*\n${cliente.nome}\n${cliente.rua}, ${cliente.numero}\n${cliente.bairro}\n`;
    if (cliente.obs) mensagem += `Obs: ${cliente.obs}\n\n`;

    mensagem += `*Pagamento:* ${pagamento}\n`;
    if (pagamento === "pix") {
      mensagem += `Chave PIX: SEU-EMAIL@PIX.COM\n`;
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
