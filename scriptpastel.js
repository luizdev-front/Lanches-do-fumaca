 const menuToggle = document.getElementById("menu-toggle");
 const navMenu = document.getElementById("nav-menu");

  menuToggle.addEventListener("click", () => {
    navMenu.style.display = navMenu.style.display === "block" ? "none" : "block";
  });
