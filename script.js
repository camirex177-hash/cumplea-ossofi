// 1. CONFIGURACIÓN DEL CONTADOR (Ajusta la fecha)
const fechaObjetivo = new Date('May 10, 2026 00:00:00').getTime(); 

const intervalo = setInterval(() => {
    const ahora = new Date().getTime();
    const distancia = fechaObjetivo - ahora;

    const d = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const h = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distancia % (1000 * 60)) / 1000);

    document.getElementById("timer").innerHTML = `${d}d ${h}h ${m}m ${s}s`;

    if (distancia < 0) {
        clearInterval(intervalo);
        document.getElementById("timer").innerHTML = "❤️ FELIZ CUMPLEAÑOS MI AMOR ❤️";
        document.getElementById("titulo-contador").style.display = "none";
        document.getElementById("contenido-sorpresa").style.display = "block";
        iniciarCarrusel('.slide-familia');
        iniciarCarrusel('.slide-nosotros');
    }
}, 1000);

// 2. EFECTO DE CORAZONES SIGUIENDO AL MOUSE
document.addEventListener('mousemove', (e) => {
    const trail = document.createElement('div');
    trail.className = 'heart-trail';
    trail.innerHTML = '❤️';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    document.body.appendChild(trail);

    setTimeout(() => {
        trail.remove();
    }, 1000);
});

// 3. LÓGICA DE CARRUSELES
function iniciarCarrusel(clase) {
    let indice = 0;
    const fotos = document.querySelectorAll(clase);
    setInterval(() => {
        fotos[indice].classList.remove('active');
        indice = (indice + 1) % fotos.length;
        fotos[indice].classList.add('active');
    }, 3000);
}

// 4. CONTROL DE MÚSICA Y VIDEOS
const musica = document.getElementById('musicaFondo');
const videos = document.querySelectorAll('.video-especial');

videos.forEach(video => {
    video.addEventListener('play', () => musica.pause());
    video.addEventListener('pause', () => {
        const algunoSonando = Array.from(videos).some(v => !v.paused);
        if(!algunoSonando) musica.play();
    });
});
