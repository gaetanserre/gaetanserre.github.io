document.addEventListener("DOMContentLoaded", () => {
  const img = document.getElementById("toggleImage");

  if (!img) return; // sécurité si l'élément n'existe pas

  img.addEventListener("click", () => {
    const currentSrc = img.getAttribute("src");

    if (currentSrc.includes("picture.png")) {
      img.setAttribute("src", "assets/website/in_lasagna.jpg");
    } else {
      img.setAttribute("src", "assets/website/picture.png");
    }
  });
});
