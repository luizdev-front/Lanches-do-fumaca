export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }
// api/pedido.js

let numeroGlobal = 0;

// Função para normalizar texto (remover acentos e deixar maiúsculo)
function normalizar(s) {
  return s.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Tabela de bairros e taxas
const bairrosTaxas = [
  { bairro: "MARÉ MANSA", taxa: 4 },
  { bairro: "VILA RÃ", taxa: 6 },
  { bairro: "AREIÃO", taxa: 6 },
  { bairro: "PENÍNSULA", taxa: 6 },
  { bairro: "PEDREIRA", taxa: 8 },
];

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  const { carrinho, cliente, pagamento } = req.body;

  // Validação básica
  if (!carrinho || !cliente || !pagamento) {
    return res.status(400).json({ erro: "Dados incompletos" });
  }

  // Normalizar bairro e buscar taxa
  const bairroNormalizado = normalizar(cliente.bairro);
  const taxaObj = bairrosTaxas.find(
    (b) => normalizar(b.bairro) === bairroNormalizado
  );

  if (!taxaObj) {
    return res.status(400).json({ erro: "Bairro não atendido" });
  }

  const taxaEntrega = taxaObj.taxa;

  // Calcular total do carrinho
  const totalCarrinho = carrinho.reduce((acc, item) => acc + (item.preco || 0), 0);

  // Total final
  const totalFinal = totalCarrinho + taxaEntrega;

  // Incrementar número do pedido (não persistente)
  numeroGlobal++;
  const numeroPedido = numeroGlobal;

  // Montar mensagem para WhatsApp
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
    mensagem += `Chave PIX: 13996039919\n`;
  }

  return res.status(200).json({
    mensagem,
    totalFinal,
    numeroPedido,
  });
}
}
