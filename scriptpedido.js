  // Carrega item via URL se houver
    const params = new URLSearchParams(window.location.search);
    const item = params.get('item');
    const preco = parseFloat(params.get('preco'));

    if (item && !isNaN(preco)) {
      const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
      carrinho.push({ item, preco });
      localStorage.setItem('carrinho', JSON.stringify(carrinho));

      // 🔔 Envio automático para vendedora (uma vez por item)
      const nome = "Cliente";
      const endereco = "Retirada no local";
      const pagamento = "Pix";

      let mensagem = `*Novo pedido de ${nome}*\n\n`;
      carrinho.forEach(p => {
        if (!p || typeof p.preco !== 'number' || !p.item) return;
        mensagem += `- ${p.item} - R$ ${p.preco.toFixed(2)}\n`;
      });

      const totalAuto = carrinho.reduce((soma, p) => soma + (p?.preco || 0), 0);
      mensagem += `\n*Total:* R$ ${totalAuto.toFixed(2)}\n*Endereço:* ${endereco}\n*Pagamento:* ${pagamento.toUpperCase()}`;

      const numero = "5581999999999"; // <-- Substitua pelo número real da vendedora
      const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, "_blank");
    }

    // Exibe o carrinho
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const divProduto = document.getElementById('produto');
    let total = 0;
    let texto = '';

    carrinho.forEach((p, i) => {
      if (!p || typeof p.preco !== 'number') return;
      total += p.preco;
      texto += `
        <div>
          <p>${p.item} - R$ ${p.preco.toFixed(2)}
          <button onclick="removerItem(${i})">Remover</button></p>
        </div>
      `;
    });

    texto += `<strong>Total: R$ ${total.toFixed(2)}</strong>`;
    divProduto.innerHTML = texto;

    // Remover item
    function removerItem(index) {
      carrinho.splice(index, 1);
      localStorage.setItem('carrinho', JSON.stringify(carrinho));
      location.reload();
    }

    // Mostrar QR Code e botão vendedora
    const selectPagamento = document.getElementById("pagamento");
    const qrcode = document.getElementById("qrcode");
    const botaoVendedora = document.getElementById("botao-vendedora");

    selectPagamento.addEventListener("change", function () {
      qrcode.classList.toggle("hidden", this.value !== "pix");
      botaoVendedora.classList.toggle("hidden", this.value === "");
    });

    // Enviar para cliente (alerta)
    function enviarParaCliente() {
      const nome = document.getElementById("nome").value.trim();
      const endereco = document.getElementById("endereco").value.trim();
      const pagamento = selectPagamento.value;

      if (!nome || !endereco || !pagamento) {
        alert("Preencha todos os campos.");
        return;
      }

      let mensagem = `Olá, ${nome}!\n\nSeu pedido:\n`;
      carrinho.forEach(p => {
        mensagem += `- ${p.item} - R$ ${p.preco.toFixed(2)}\n`;
      });
      mensagem += `\nTotal: R$ ${total.toFixed(2)}\nEndereço: ${endereco}\nPagamento: ${pagamento}`;
      alert(mensagem);
    }

    // Enviar para vendedora (WhatsApp)
    function enviarParaVendedora() {
      const nome = document.getElementById("nome").value.trim();
      const endereco = document.getElementById("endereco").value.trim();
      const pagamento = selectPagamento.value;

      if (!nome || !endereco || !pagamento) {
        alert("Preencha todos os campos.");
        return;
      }

      let mensagem = `*Novo pedido de ${nome}*\n\n`;
      carrinho.forEach(p => {
        mensagem += `- ${p.item} - R$ ${p.preco.toFixed(2)}\n`;
      });
      mensagem += `\n*Total:* R$ ${total.toFixed(2)}\n*Endereço:* ${endereco}\n*Pagamento:* ${pagamento.toUpperCase()}`;

      const numero = "55 13988799046"; // Substitua com número real
      const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, "_blank");
    }

    // Torna acessível globalmente
    window.enviarParaCliente = enviarParaCliente;
    window.enviarParaVendedora = enviarParaVendedora;
    window.removerItem = removerItem;

    // Alerta se item for inválido
    if (item && isNaN(preco)) {
      alert("Produto inválido! Retorne à página anterior.");
    }