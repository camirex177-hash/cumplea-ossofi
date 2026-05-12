// --- Contador regresivo ---
const targetDate = new Date("May 17, 2026 00:00:00").getTime();
const timerElement = document.getElementById("timer");

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance < 0) {
    timerElement.innerHTML = "¡Feliz cumpleaños! 🎉";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  timerElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
setInterval(updateCountdown, 1000);

// --- Slideshow Familia ---
let familiaIndex = 0;
function showFamiliaSlides() {
  const slides = document.getElementsByClassName("slide-familia");
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  familiaIndex++;
  if (familiaIndex > slides.length) { familiaIndex = 1; }
  slides[familiaIndex - 1].style.display = "block";
  setTimeout(showFamiliaSlides, 3000);
}
showFamiliaSlides();

// --- Slideshow Nosotros ---
let nosotrosIndex = 0;
function showNosotrosSlides() {
  const slides = document.getElementsByClassName("slide-nosotros");
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  nosotrosIndex++;
  if (nosotrosIndex > slides.length) { nosotrosIndex = 1; }
  slides[nosotrosIndex - 1].style.display = "block";
  setTimeout(showNosotrosSlides, 3000);
}
showNosotrosSlides();

// --- Efecto corazones con el cursor ---
document.addEventListener("mousemove", function(e) {
  const heart = document.createElement("div");
  heart.innerHTML = "❤";
  heart.style.position = "absolute";
  heart.style.left = e.pageX + "px";
  heart.style.top = e.pageY + "px";
  heart.style.color = "#d6336c";
  heart.style.fontSize = "20px";
  heart.style.pointerEvents = "none";
  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 1000);
});