  const menuBtn = document.getElementById("menuBtn"); 
  const menu = document.getElementById("menu");

  menuBtn.addEventListener("click", () => {
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  });