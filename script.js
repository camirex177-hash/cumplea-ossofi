/* ============================================================
   SCRIPT PRINCIPAL — Aniversario / Cumpleaños
   Funcionalidades:
     1. Contador regresivo hasta el 17 de mayo de 2026
     2. Carruseles (Familia y Nosotros) con indicadores
     3. Música inteligente (pausa/reanuda con videos)
     4. Efecto de corazones en el cursor
     5. Botón de debug para previsualización
============================================================ */

'use strict';

/* ============================================================
   1. CONTADOR REGRESIVO
============================================================ */

// Fecha objetivo: 20 de mayo de 2026, 00:00:00 hora local
const FECHA_OBJETIVO = new Date('2026-05-17T00:00:00');

const elDias     = document.getElementById('dias');
const elHoras    = document.getElementById('horas');
const elMinutos  = document.getElementById('minutos');
const elSegundos = document.getElementById('segundos');
const elTitulo   = document.getElementById('titulo-contador');

/**
 * Formatea un número a dos dígitos (p.ej. 5 → "05")
 * @param {number} n
 * @returns {string}
 */
function pad(n) {
  return String(n).padStart(2, '0');
}

/**
 * Actualiza el contador en pantalla.
 * Si el tiempo llegó a cero, muestra el contenido sorpresa.
 */
function actualizarContador() {
  const ahora      = new Date();
  const diferencia = FECHA_OBJETIVO - ahora;

  if (diferencia <= 0) {
    // Tiempo cumplido: mostrar contenido
    elDias.textContent     = '00';
    elHoras.textContent    = '00';
    elMinutos.textContent  = '00';
    elSegundos.textContent = '00';
    desbloquearContenido();
    return; // detiene el intervalo implícitamente al no necesitar más actualizaciones
  }

  const dias    = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas   = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const segs    = Math.floor((diferencia % (1000 * 60)) / 1000);

  elDias.textContent     = pad(dias);
  elHoras.textContent    = pad(horas);
  elMinutos.textContent  = pad(minutos);
  elSegundos.textContent = pad(segs);
}

/**
 * Muestra el contenido sorpresa y actualiza el título.
 */
function desbloquearContenido() {
  elTitulo.textContent = '❤️ FELIZ CUMPLEAÑOS MI AMOR ❤️';
  elTitulo.style.animation = 'pulse 1s ease-in-out infinite';

  const contenido = document.getElementById('contenido-sorpresa');
  contenido.style.display = 'block';

  // Ocultar el botón debug si existe
  const btnDebug = document.getElementById('btn-debug');
  if (btnDebug) btnDebug.style.display = 'none';

  // Ocultar el grid del contador (ya no es necesario)
  document.getElementById('contador').style.opacity = '0.3';
  document.getElementById('contador').style.pointerEvents = 'none';

  // Lanzar lluvia de corazones de celebración
  lanzarLluviaCorazones();
}

/**
 * Función pública para el botón de debug.
 */
function forzarDesbloqueo() {
  desbloquearContenido();
}

// Iniciar el contador y actualizarlo cada segundo
actualizarContador();
const intervaloContador = setInterval(() => {
  const ahora = new Date();
  if (FECHA_OBJETIVO - ahora <= 0) {
    clearInterval(intervaloContador);
    desbloquearContenido();
  } else {
    actualizarContador();
  }
}, 1000);


/* ============================================================
   2. CARRUSELES
============================================================ */

/**
 * Estado de cada carrusel.
 * Clave: nombre del carrusel ('familia' | 'nosotros')
 * Valor: { indice, total, autoplay }
 */
const estadoCarruseles = {
  familia:  { indice: 0, total: 10, autoplay: null },
  nosotros: { indice: 0, total: 10, autoplay: null },
};

/**
 * Inicializa los dots (indicadores) de un carrusel.
 * @param {string} nombre - 'familia' | 'nosotros'
 */
function inicializarDots(nombre) {
  const contenedor = document.getElementById(`dots-${nombre}`);
  if (!contenedor) return;
  contenedor.innerHTML = '';

  for (let i = 0; i < estadoCarruseles[nombre].total; i++) {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Ir a foto ${i + 1}`);
    dot.addEventListener('click', () => irASlide(nombre, i));
    contenedor.appendChild(dot);
  }
}

/**
 * Actualiza los dots para reflejar el slide activo.
 * @param {string} nombre
 */
function actualizarDots(nombre) {
  const contenedor = document.getElementById(`dots-${nombre}`);
  if (!contenedor) return;
  const dots = contenedor.querySelectorAll('.dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === estadoCarruseles[nombre].indice);
  });
}

/**
 * Mueve el carrusel al slide indicado.
 * @param {string} nombre
 * @param {number} nuevoIndice
 */
function irASlide(nombre, nuevoIndice) {
  const estado = estadoCarruseles[nombre];
  estado.indice = (nuevoIndice + estado.total) % estado.total;
  const track = document.getElementById(`track-${nombre}`);
  if (track) {
    track.style.transform = `translateX(-${estado.indice * 100}%)`;
  }
  actualizarDots(nombre);
}

/**
 * Mueve el carrusel en la dirección indicada (+1 siguiente, -1 anterior).
 * @param {string} nombre
 * @param {number} direccion
 */
function moverCarrusel(nombre, direccion) {
  const estado = estadoCarruseles[nombre];
  irASlide(nombre, estado.indice + direccion);
  // Reiniciar autoplay al interactuar manualmente
  reiniciarAutoplay(nombre);
}

/**
 * Inicia el autoplay de un carrusel (avanza cada 4 segundos).
 * @param {string} nombre
 */
function iniciarAutoplay(nombre) {
  const estado = estadoCarruseles[nombre];
  if (estado.autoplay) clearInterval(estado.autoplay);
  estado.autoplay = setInterval(() => {
    irASlide(nombre, estado.indice + 1);
  }, 4000);
}

/**
 * Reinicia el autoplay (útil tras interacción manual).
 * @param {string} nombre
 */
function reiniciarAutoplay(nombre) {
  clearInterval(estadoCarruseles[nombre].autoplay);
  iniciarAutoplay(nombre);
}

// Inicializar dots y autoplay para ambos carruseles
['familia', 'nosotros'].forEach(nombre => {
  inicializarDots(nombre);
  iniciarAutoplay(nombre);
});

// Soporte táctil (swipe) para carruseles
(function configurarSwipe() {
  const carruseles = [
    { id: 'carrusel-familia',  nombre: 'familia'  },
    { id: 'carrusel-nosotros', nombre: 'nosotros' },
  ];

  carruseles.forEach(({ id, nombre }) => {
    const el = document.getElementById(id);
    if (!el) return;

    let startX = 0;

    el.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    el.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        moverCarrusel(nombre, diff > 0 ? 1 : -1);
      }
    }, { passive: true });
  });
})();


/* ============================================================
   3. MÚSICA INTELIGENTE
============================================================ */

const audioBg = document.getElementById('audio-bg');
const video1  = document.getElementById('video1');
const video2  = document.getElementById('video2');

/**
 * Pausa la música de fondo cuando un video empieza a reproducirse.
 * La reanuda cuando el video se pausa o termina.
 */
function configurarMusicaInteligente() {
  if (!audioBg) return;

  const videos = [video1, video2].filter(Boolean);

  videos.forEach(video => {
    video.addEventListener('play', () => {
      if (!audioBg.paused) {
        audioBg.pause();
        audioBg.dataset.pausadoPorVideo = 'true';
      }
    });

    video.addEventListener('pause', () => {
      if (audioBg.dataset.pausadoPorVideo === 'true') {
        audioBg.play().catch(() => {
          // El navegador puede bloquear el autoplay; se ignora silenciosamente
        });
        audioBg.dataset.pausadoPorVideo = 'false';
      }
    });

    video.addEventListener('ended', () => {
      if (audioBg.dataset.pausadoPorVideo === 'true') {
        audioBg.play().catch(() => {});
        audioBg.dataset.pausadoPorVideo = 'false';
      }
    });
  });
}

configurarMusicaInteligente();


/* ============================================================
   4. EFECTO DE CORAZONES EN EL CURSOR
============================================================ */

/**
 * Crea un corazón flotante en la posición (x, y) y lo elimina tras 1 segundo.
 * @param {number} x
 * @param {number} y
 */
function crearCorazon(x, y) {
  const corazon = document.createElement('span');
  corazon.className = 'heart-particle';
  corazon.textContent = '❤️';
  corazon.style.left = `${x - 10}px`;
  corazon.style.top  = `${y - 10}px`;
  document.getElementById('cursor-hearts').appendChild(corazon);

  // Eliminar el elemento del DOM al terminar la animación
  corazon.addEventListener('animationend', () => corazon.remove());
}

// Throttle: máximo 1 corazón cada 80ms para no saturar el DOM
let ultimoCorazon = 0;
document.addEventListener('mousemove', e => {
  const ahora = Date.now();
  if (ahora - ultimoCorazon >= 80) {
    ultimoCorazon = ahora;
    crearCorazon(e.clientX, e.clientY);
  }
});

// Soporte táctil: corazones al tocar la pantalla
document.addEventListener('touchmove', e => {
  const ahora = Date.now();
  if (ahora - ultimoCorazon >= 100) {
    ultimoCorazon = ahora;
    const toque = e.touches[0];
    crearCorazon(toque.clientX, toque.clientY);
  }
}, { passive: true });


/* ============================================================
   5. LLUVIA DE CORAZONES DE CELEBRACIÓN
   Se activa cuando el contador llega a cero.
============================================================ */

/**
 * Genera una lluvia de corazones en posiciones aleatorias durante 3 segundos.
 */
function lanzarLluviaCorazones() {
  const duracion = 3000; // ms
  const intervalo = 80;  // ms entre cada corazón
  const inicio = Date.now();

  const lluvia = setInterval(() => {
    if (Date.now() - inicio > duracion) {
      clearInterval(lluvia);
      return;
    }
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * 0.8;
    crearCorazon(x, y);
  }, intervalo);
}
