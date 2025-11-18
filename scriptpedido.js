document.addEventListener("DOMContentLoaded", () => {
  const produtoDiv = document.getElementById("produto");
  const pagamentoSelect = document.getElementById("pagamento");
  const pixDiv = document.getElementById("pix-info");

  const campos = {
    nome: document.getElementById("nome"),
    bairro: document.getElementById("endereco"),
    rua: document.getElementById("rua"),
    numero: document.getElementById("numero"),
    obs: document.getElementById("observacoes")
  };

  const bairrosTaxas = [
    { bairro: "MARÉ MANSA", taxa: 4 },
    { bairro: "VILA RÃ", taxa: 6 },
    { bairro: "AREIÃO", taxa: 6 },
    { bairro: "PENÍNSULA", taxa: 6 },
    { bairro: "PEDREIRA", taxa: 8 }
  ];

  /* ---------- CARRINHO ---------- */

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
      const adicionais = item.adicionais?.length ? ` (${item.adicionais.join(", ")})` : "";

      div.innerHTML = `
        <span>${nome}${adicionais} – R$ ${preco.toFixed(2)}</span>
      `;

      const btn = document.createElement("button");
      btn.className = "btn-remover";
      btn.textContent = "Remover";
      btn.onclick = () => removerItem(index);

      div.appendChild(btn);
      produtoDiv.appendChild(div);

      total += preco;
    });

    produtoDiv.innerHTML += `<h3>Total: R$ ${total.toFixed(2)}</h3>`;
  }

 function removerItem(index) {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho.splice(index, 1);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  renderCarrinho();
}

  /* ----------- UX PIX ----------- */

  pagamentoSelect.addEventListener("change", () => {
    if (pagamentoSelect.value === "pix") {
      pixDiv.classList.remove("hidden");
      pixDiv.innerHTML = `<strong>Após finalizar o pedido o valor e chave serão exibidos.</strong>`;
    } else {
      pixDiv.classList.add("hidden");
      pixDiv.innerHTML = "";
    }
  });

  /* ----------- PEDIDO ----------- */

  function normalizar(s) {
    return s.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function validarCampos() {
    return Object.values(campos).every(campo => campo.value.trim() !== "") &&
           pagamentoSelect.value !== "";
  }

  function gerarCodigo() {
    const n = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `PED-${Date.now()}-${n}`;
  }

  function finalizarPedido() {
    if (!validarCampos()) {
      alert("Preencha todos os campos corretamente!");
      return;
    }

    const bairroFormatado = normalizar(campos.bairro.value);
    const bairroData = bairrosTaxas.find(b => normalizar(b.bairro) === bairroFormatado);

    if (!bairroData) {
      alert("Esse bairro não está na área atendida.");
      return;
    }

    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    if (carrinho.length === 0) return alert("Seu carrinho está vazio!");

    const codigo = gerarCodigo();
    const taxa = bairroData.taxa;

    let total = carrinho.reduce((acc, item) => acc + (item.preco || 0), 0);
    const totalFinal = total + taxa;

    let msg = `📦 *Novo Pedido*\n\n`;
    carrinho.forEach(item => {
      const adicionais = item.adicionais?.length ? ` (${item.adicionais.join(", ")})` : "";
      msg += `• ${item.nome}${adicionais} – R$ ${item.preco.toFixed(2)}\n`;
    });

    msg += `
🚚 Entrega: R$ ${taxa.toFixed(2)}
💰 Total: R$ ${totalFinal.toFixed(2)}

👤 Cliente: ${campos.nome.value}
🏠 Endereço: ${campos.rua.value}, Nº ${campos.numero.value}, ${campos.bairro.value}
📝 Obs: ${campos.obs.value || "Nenhuma"}

💳 Pagamento: ${pagamentoSelect.value.toUpperCase()}
🔖 Código: *${codigo}*
`;

    if (pagamentoSelect.value === "pix") {
      pixDiv.innerHTML = `
        <h3>Pagamento PIX</h3>
        <p><strong>Chave:</strong> 13988799046</p>
        <p><strong>Valor:</strong> R$ ${totalFinal.toFixed(2)}</p>
      `;
    }

    const numero = "5513988799046";
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`, "_blank");

    localStorage.removeItem("carrinho");
    renderCarrinho();
  }

  document.getElementById("enviar-vendedora-btn").onclick = finalizarPedido;

  renderCarrinho();
});
