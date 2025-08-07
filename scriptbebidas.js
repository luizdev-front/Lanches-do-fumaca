  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("nav-menu");

  toggle.addEventListener("click", () => {
    // Alterna a visibilidade
    if (menu.style.display === "block") {
      menu.style.display = "none";
    } else {
      menu.style.display = "block";
    }
  });
   function adicionarAoCarrinho(botao) {
  const itemCard = botao.parentElement;
  const texto = itemCard.querySelector('span').textContent;

  // Exemplo: "Refrigerante lata - R$ 5,00"
  const partes = texto.split(' - R$ ');
  const nome = partes[0].trim();
  const preco = parseFloat(partes[1].replace(',', '.'));

  if (!nome || isNaN(preco)) {
    alert('Erro ao adicionar o item. Por favor, tente novamente.');
    return;
  }

  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho.push({ nome, preco });
  localStorage.setItem('carrinho', JSON.stringify(carrinho));

  // Agora exibe corretamente o nome do produto
  alert(nome + ' foi adicionado ao carrinho!');
}