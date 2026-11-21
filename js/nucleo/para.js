/* Veta demo · núcleo · para.js · ronda 7 (limpia)
   Dos cosas que valen para todas las pantallas:
   1 · VETA.PARA: para qué sirve cada pantalla y qué puedes hacer en ella, en una línea fija arriba (la pinta rutas.js al montar).
       Habla quien explica la pantalla, no Veta: por eso Veta va en tercera persona aquí, y en primera dentro de las tarjetas.
   2 · VETA.pliega: en las pantallas largas, cada bloque con título entra plegado (título, una línea y su número) y se abre al tocarlo.
       Nada llega desplegado: lo abres tú. Lo que abres se queda abierto mientras sigas en esa pantalla. */
(function () {
  'use strict';
  const esc = VETA.esc;
  const dir = () => VETA.yo().papel === 'direccion';

  VETA.PARA = {
    A18m: 'Lo que Veta encontró en seis meses de tus chats. Toca una fila para ver de dónde sale.',
    A1: 'Tu día, ya preparado. Elige qué quieres hacer.',
    A1c: 'Una cosa cada vez, con el mensaje ya escrito. Nada sale hasta que tú lo envías.',
    A1v: 'Lo que Veta ha hecho sin que se lo pidas. Si algo no está bien, lo deshaces.',
    A2: 'El mensaje que Veta te ha escrito. Cámbialo como quieras: lo envías tú.',
    A3: 'Habla como a un compañero. Al terminar verás lo que Veta ha entendido.',
    A4: 'Veta ha entendido tu visita y te deja dos cosas hechas. Ábrelas, revísalas y envía.',
    A4b: 'Esto es lo que Veta ha entendido. Guárdalo o di que no es eso.',
    A7: 'Lo que depende de otros. Veta lo vigila y te avisa si no llega.',
    A12: 'El informe tal como lo verá el propietario. Lo envías tú desde tu WhatsApp.',
    A5: 'Tus clientes, primero los que te necesitan hoy. Toca uno o pregunta algo.',
    A5b: 'Los que hoy no te necesitan. Toca uno para abrir su ficha.',
    A5p: 'Veta contesta solo con lo que está escrito en tus chats, con su fecha.',
    A6: 'Todo sobre este cliente y el siguiente paso con él.',
    A6d: 'Los papeles y las fechas de este cliente. Pide lo que falta o márcalo recibido.',
    A16: 'Lo que ha pasado con este cliente, por fecha. Toca una línea para verla entera.',
    A8: () => dir() ? 'Lo que Veta hace por la oficina y cómo enseñarle más. Elige qué quieres hacer.' : 'Lo que Veta hace por ti y cómo enseñarle más. Elige qué quieres hacer.',
    A9: 'Los trabajos de Veta. Toca uno y decides quién lo hace: tú o ella.',
    A9b: 'Lo que Veta hizo la semana pasada. Míralo y confirma que está bien.',
    A10: 'Un trabajo y hasta dónde llega Veta en él. Lo decides tú.',
    A10b: 'Elige hasta dónde llega Veta en este trabajo.',
    A11: 'Así ha entendido Veta lo que le has pedido. Pruébalo o dilo de otra forma.',
    A13: 'Lo que Veta ha aprendido de ti y de dónde lo sacó. Si no es así, lo olvida.',
    A13b: 'Propón a la oficina una forma mejor de hacer algo.',
    A14: 'Lo que Veta hizo por ti la semana pasada, en números.',
    A15: 'Tu cuenta. Tú decides qué lee Veta y cómo la ves.',
    A15b: 'Los chats que Veta no lee. Añade o quita uno con un toque.',
    A15c: 'Tu contraseña y el código del móvil.',
    A19: 'Todo lo que Veta hace por ti, en tres grupos. Toca un grupo para abrirlo.',
    A20: 'Tu trabajo cuando empezaste con Veta y ahora.',
    G10: 'Cómo trabaja tu oficina. Toca una práctica para ver de dónde salió.',
    G11: 'Dónde se paran las operaciones y qué aprende la oficina.',
    G12: 'Lo que el equipo aún hace a mano. Enseña a Veta la primera, hablando.',
    G13: 'Una operación que se cayó, paso a paso. Saca de ella una práctica.',
    G14: 'Lo que Veta ha contado en los chats de la oficina. Son cuentas, no opiniones.',
    G1: 'Tu oficina de un vistazo. Elige qué quieres ver o decidir.',
    G1d: 'Lo que espera tu decisión, una cosa cada vez.',
    G1p: 'Tu equipo. Toca a una persona para ver lo que lleva.',
    G1m: 'El resto de la oficina: lo que entra, los avisos y los ajustes.',
    G2: 'Todo sobre este asunto. Decide quién lo lleva.',
    G2b: 'Un trabajo propuesto para toda la oficina. Pruébalo dos semanas o descártalo.',
    G3: 'La semana de la oficina, en cifras de equipo. Envía el resumen.',
    G3b: 'El correo tal como lo recibirá el equipo. Léelo y envíalo.',
    G3c: 'El orden del día con tus tres temas. Envíalo al equipo.',
    G3d: 'Cada oficina comparada consigo misma, semana a semana.',
    G3e: 'Las horas que gana el equipo, con los tiempos que pone cada persona.',
    G5: 'El trabajo que se ha quedado sin nadie. Decide a quién va.',
    G5b: 'Lo que va a pasar antes de tocar el trabajo de nadie. Confirma o cancela.',
    G6: 'Di cuándo quieres que Veta te avise. Ella lo vigila.',
    G7: 'Lo que Veta escucha en la oficina. Enciende o apaga cada canal.',
    G7b: 'Qué ves tú y qué ve cada persona, en palabras llanas.',
    G7c: 'El parte de cada día del piloto.',
    G8: 'Toda la semana en un informe para leer con calma o imprimir.',
    G9: 'Lo que llega a la oficina y nadie ha contestado. Reparte lo que no tiene dueño.',
    G15: 'Todo lo que Veta hace por la oficina, en tres grupos. Toca un grupo para abrirlo.',
    G16: 'La oficina cuando empezó con Veta y ahora.',
    G17: 'Todas las operaciones. Arriba, las que hay que mirar hoy.',
    G18: 'Cómo va esta operación y qué toca ahora.',
    G19: 'Lo que lleva esta persona y lo que Veta hace por ella. No ves sus chats.'
  };
  VETA.paraQue = e => {
    const d = e && e.def; if (!d) return '';
    const t = d.para !== undefined ? d.para : VETA.PARA[d.cod];
    return typeof t === 'function' ? (t(e.p) || '') : (t || '');
  };

  // ---- pliegues ----
  // qué pantallas pliegan sus bloques. {salvo: ['Título']} deja abiertos los que se nombran (lo principal de esa pantalla);
  // {sinNumero: true} no pone la cuenta (cuando el bloque ya dice su cifra de otra forma).
  VETA.PLIEGA = {
    A13: {}, A14: {}, A15: {}, A18m: {}, A19: {}, A20: {}, A9b: {},
    A18: {salvo: ['No tienes', 'Avisos', 'Chats que dejo fuera']},
    A10: {salvo: ['¿Quién lo hace?']},
    G3: {sinNumero: true}, G5: {salvo: ['Clientes de']}, G6: {}, G8: {}, G11: {}, G15: {}, G16: {}, G19: {},
    G2: {salvo: ['Lo que pide', 'Lo que dijo', 'Quién puede llevarlo', 'Quién lo lleva']}
  };
  const abiertos = {};   // por ruta: {título: true}
  const N_FIN = /\s*·\s*(\d+)\s*$/;
  const FILAS = ['.lista > .fila', '.a-r6-lista > *', '.c-qh-l > li', '.ops > *'];
  // el texto de un trozo, con un espacio entre sus piezas («38» y «cosas que le dejé listas» no se pegan)
  const texto = el => { const t = []; const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const x = n.nodeValue.trim(); if (x) t.push(x); } return t.join(' ').replace(/\s+([.,;:])/g, '$1'); };
  const corta = (t, n) => t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : t;
  VETA.pliega = (col, e) => {
    const conf = VETA.PLIEGA[e.def.cod]; if (!conf) return;
    const cuerpo = col.querySelector('.pant-cuerpo'); if (!cuerpo) return;
    const mem = abiertos[e.ruta] = abiertos[e.ruta] || {};
    Array.from(cuerpo.querySelectorAll('section.bloque')).forEach(sec => {
      if (sec.parentNode.closest('.pliegue-c')) return;   // un pliegue no lleva otros dentro
      const h = Array.from(sec.children).find(x => x.matches('h2.bloque-t')); if (!h) return;
      let t = h.textContent.trim(), n = 0;
      const m = t.match(N_FIN); if (m) { n = Number(m[1]); t = t.replace(N_FIN, ''); }
      if ((conf.salvo || []).some(s => t.indexOf(s) === 0)) return;
      const sub = Array.from(sec.children).find(x => x.matches('.bloque-sub'));
      const hijos = Array.from(sec.children).filter(x => x !== h && x !== sub);
      const cuentaEn = q => hijos.reduce((a, x) => a + (x.matches(q) ? 1 : 0) + x.querySelectorAll(q).length, 0);
      const filas = FILAS.reduce((a, q) => a || cuentaEn(q), 0);
      const toca = !!cuentaEn('button,a,input,textarea,[data-ir],[data-accion],[data-hoja],svg:not(.ic),table');
      const tx = hijos.map(texto).filter(Boolean).map(x => /[.!?…:]$/.test(x) ? x : x + '.').join(' ');
      // lo corto y sin nada que tocar no se pliega: si es una frase, se lee entera en su tarjeta; si tiene forma propia, se queda como está
      if (!filas && !toca && tx.length <= 160) {
        if (!(hijos.length && hijos.length <= 2 && hijos.every(x => x.tagName === 'P'))) return;
        sec.textContent = ''; sec.classList.add('pliegue', 'pliegue-dato');
        sec.innerHTML = `<div class="pliegue-b"><span class="pliegue-tx"><span class="pliegue-t">${esc(t)}</span>` +
          `<span class="pliegue-s">${esc([sub ? sub.textContent.trim() : '', tx].filter(Boolean).join(' '))}</span></span></div>`;
        return;
      }
      const caja = document.createElement('div'); caja.className = 'pliegue-c';
      Array.from(sec.childNodes).forEach(x => { if (x !== h && x !== sub) caja.appendChild(x); });
      sec.textContent = ''; sec.classList.add('pliegue');
      if (!n && !conf.sinNumero && !/\d/.test(t)) n = filas;
      // la línea de debajo del título: la del bloque o, si no la tiene, su primera frase
      const p1 = sub ? null : Array.from(caja.children).find(x => x.tagName === 'P');
      const linea = sub ? sub.textContent.trim() : p1 ? corta(texto(p1), 90) : '';
      const abierto = !!mem[t];
      const b = document.createElement('button'); b.type = 'button'; b.className = 'pliegue-b'; b.setAttribute('aria-expanded', String(abierto));
      b.innerHTML = `<span class="pliegue-tx"><span class="pliegue-t">${esc(t)}</span>${linea ? `<span class="pliegue-s">${esc(linea)}</span>` : ''}</span>` +
        (n > 1 ? `<span class="pliegue-n">${n}</span>` : '') + `<span class="pliegue-ch">${VETA.ic('chev', 16)}</span>`;
      caja.hidden = !abierto;
      sec.appendChild(b); sec.appendChild(caja);
      b.addEventListener('click', () => {
        const abre = caja.hidden; caja.hidden = !abre; b.setAttribute('aria-expanded', String(abre)); mem[t] = abre;
        if (abre && VETA.mov && VETA.mov.cascada) VETA.mov.cascada(caja);
      });
    });
  };
})();
