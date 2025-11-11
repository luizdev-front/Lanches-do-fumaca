// script.js
const menuBtn = document.getElementById('menuToggle');
const navbar = document.getElementById('navbar');

menuBtn.addEventListener('click', () => {
  const isOpen = navbar.classList.toggle('active');
  menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

  // opcional: bloquear scroll do body quando o menu estiver aberto
  if (isOpen) document.body.style.overflow = 'hidden';
  else document.body.style.overflow = '';
});

// fecha o menu ao clicar fora (apenas quando está aberto)
document.addEventListener('click', (e) => {
  const target = e.target;
  if (!navbar.contains(target) && !menuBtn.contains(target) && navbar.classList.contains('active')) {
    navbar.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});