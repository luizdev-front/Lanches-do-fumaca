document.addEventListener("DOMContentLoaded", () => {
  /* --------------------------
     ELEMENTOS
  -------------------------- */
  const produtoDiv = document.getElementById("produto");
  const pagamentoSelect = document.getElementById("pagamento");
  const pixDiv = document.getElementById("pix-info");

  const campos = {
    nome: document.getElementById("nome"),
    bairro: document.getElementById("endereco"),
    rua: document.getElementById("rua"),
    numero: document.getElementById("numero"),
    obs: document.getElementById("observacoes"),
  };

  /* --------------------------
     TAXAS POR BAIRRO
  -------------------------- */
  const bairrosTaxas = [
    { bairro: "MARÉ MANSA", taxa: 4 },
    { bairro: "VILA RÃ", taxa: 6 },
    { bairro: "AREIÃO", taxa: 6 },
    { bairro: "PENÍNSULA", taxa: 6 },
    { bairro: "PEDREIRA", taxa: 8 },
  ];

  /* --------------------------
     FUNÇÕES ÚTEIS
  -------------------------- */
  const normalizar = (s) =>
    s.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // NOVO: número sequencial para pedidos
  const gerarNumeroPedido = () => {
    let numero = Number(localStorage.getItem("numeroPedido")) || 0;
    numero++;
    localStorage.setItem("numeroPedido", numero);
    return numero;
  };

  /* --------------------------
     RENDER DO CARRINHO (PROFISSIONAL)
  -------------------------- */
  function renderCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    produtoDiv.innerHTML = "";

    if (carrinho.length === 0) {
      produtoDiv.innerHTML = "<p>Nenhum item no pedido.</p>";
      return;
    }

    let total = 0;

    carrinho.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("item-carrinho");

      const nome = item.nome || "Item sem nome";
      const preco = item.preco || 0;
      const adicionais =
        item.adicionais?.length ? ` (${item.adicionais.join(", ")})` : "";

      const span = document.createElement("span");
      span.textContent = `${nome}${adicionais} – R$ ${preco.toFixed(2)}`;

      const btn = document.createElement("button");
      btn.className = "btn-remover";
      btn.textContent = "Remover";
      btn.addEventListener("click", () => removerItem(index));

      div.appendChild(span);
      div.appendChild(btn);

      produtoDiv.appendChild(div);

      total += preco;
    });

    const totalEl = document.createElement("h3");
    totalEl.textContent = `Total: R$ ${total.toFixed(2)}`;
    produtoDiv.appendChild(totalEl);
  }

  /* --------------------------
     REMOVER ITEM
  -------------------------- */
  function removerItem(index) {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho.splice(index, 1);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    renderCarrinho();
  }

  /* --------------------------
     PIX – UX
  -------------------------- */
  pagamentoSelect.addEventListener("change", () => {
    if (pagamentoSelect.value === "pix") {
      pixDiv.classList.remove("hidden");
      pixDiv.innerHTML = `
        <h3>Pagamento PIX</h3>
        <p><strong>Valor:</strong> será calculado após finalizar</p>
      `;
    } else {
      pixDiv.classList.add("hidden");
      pixDiv.innerHTML = "";
    }
  });

  /* --------------------------
     VALIDAR CAMPOS
  -------------------------- */
  function validarCampos() {
    const todosPreenchidos =
      Object.values(campos).every((c) => c.value.trim() !== "") &&
      pagamentoSelect.value !== "";

    return todosPreenchidos;
  }

  /* --------------------------
     FINALIZAR PEDIDO
  -------------------------- */
  function finalizarPedido() {
    if (!validarCampos()) {
      alert("Preencha todos os campos!");
      return;
    }

    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    if (carrinho.length === 0) return alert("Seu carrinho está vazio!");

    const bairroFormatado = normalizar(campos.bairro.value);
    const dadosBairro = bairrosTaxas.find(
      (b) => normalizar(b.bairro) === bairroFormatado
    );

    if (!dadosBairro) {
      alert("Este bairro não está na área atendida!");
      return;
    }

    const taxa = dadosBairro.taxa;
    const numeroPedido = gerarNumeroPedido(); // novo número sequencial

    let total = carrinho.reduce((s, item) => s + (item.preco || 0), 0);
    let totalFinal = total + taxa;

    /* --------------------------
       MONTAR MENSAGEM
    -------------------------- */
    let msg = `📦 *Novo Pedido*\n\n`;

    carrinho.forEach((item) => {
      const adicionais = item.adicionais?.length
        ? ` (${item.adicionais.join(", ")})`
        : "";
      msg += `• ${item.nome}${adicionais} – R$ ${item.preco.toFixed(2)}\n`;
    });

    msg += `
🚚 Entrega: R$ ${taxa.toFixed(2)}
💰 Total: R$ ${totalFinal.toFixed(2)}

👤 Cliente: ${campos.nome.value}
🏠 ${campos.rua.value}, Nº ${campos.numero.value}, ${campos.bairro.value}
📝 Obs: ${campos.obs.value || "Nenhuma"}

💳 Pagamento: ${pagamentoSelect.value.toUpperCase()}
${pagamentoSelect.value === "pix" ? "💸 Chave PIX: 13988799046\n" : ""}
🔖 Pedido Nº *${numeroPedido}*
`;

    /* --------------------------
       PIX – MOSTRAR APENAS VALOR NA TELA
    -------------------------- */
    if (pagamentoSelect.value === "pix") {
      pixDiv.classList.remove("hidden");
      pixDiv.innerHTML = `
        <h3>Pagamento PIX</h3>
        <p><strong>Valor:</strong> R$ ${totalFinal.toFixed(2)}</p>
      `;
    }

    /* --------------------------
       ENVIAR PARA WHATSAPP
    -------------------------- */
    const numero = "5513988799046";
    window.open(
      `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );

    localStorage.removeItem("carrinho");
    renderCarrinho();
  }

  document.getElementById("enviar-vendedora-btn").onclick = finalizarPedido;

  /* --------------------------
     INICIO
  -------------------------- */
  renderCarrinho();
});

