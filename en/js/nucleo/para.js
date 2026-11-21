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
    A18m: 'What Veta found in six months of your chats. Tap a row to see where it comes from.',
    A1: 'Your day, already prepared. Choose what you want to do.',
    A1c: 'One thing at a time, with the message already written. Nothing goes out until you send it.',
    A1v: 'What Veta has done without being asked. If something is not right, you undo it.',
    A2: 'The message Veta has written for you. Change it as you like: you send it.',
    A3: 'Talk as you would to a colleague. When you finish you will see what Veta understood.',
    A4: 'Veta has understood your viewing and leaves you two things done. Open them, check them and send.',
    A4b: 'This is what Veta understood. Save it or say that\'s not it.',
    A7: 'What depends on others. Veta watches it and tells you if it does not arrive.',
    A12: 'The report as the owner will see it. You send it from your WhatsApp.',
    A5: 'Your clients, with those who need you today first. Tap one or ask something.',
    A5b: 'Those who do not need you today. Tap one to open their profile.',
    A5p: 'Veta answers only with what is written in your chats, with its date.',
    A6: 'Everything about this client and the next step with them.',
    A6d: 'This client\'s documents and dates. Ask for what is missing or mark it as received.',
    A16: 'What has happened with this client, by date. Tap a line to see it in full.',
    A8: () => dir() ? 'What Veta does for the office and how to teach it more. Choose what you want to do.' : 'What Veta does for you and how to teach it more. Choose what you want to do.',
    A9: 'Veta\'s jobs. Tap one and decide who does it: you or Veta.',
    A9b: 'What Veta did last week. Look at it and confirm it is right.',
    A10: 'One job and how far Veta goes with it. You decide.',
    A10b: 'Choose how far Veta goes with this job.',
    A11: 'This is how Veta understood what you asked. Try it or say it another way.',
    A13: 'What Veta has learned from you and where it got it. If it is wrong, Veta forgets it.',
    A13b: 'Propose to the office a better way of doing something.',
    A14: 'What Veta did for you last week, in numbers.',
    A15: 'Your account. You decide what Veta reads and how you see it.',
    A15b: 'The chats Veta does not read. Add or remove one with one tap.',
    A15c: 'Your password and the code from your phone.',
    A19: 'Everything Veta does for you, in three groups. Tap a group to open it.',
    A20: 'Your work when you started with Veta and now.',
    G10: 'How your office works. Tap a practice to see where it came from.',
    G11: 'Where deals stall and what the office learns.',
    G12: 'What the team still does by hand. Teach Veta the first one, by talking.',
    G13: 'A deal that fell through, step by step. Turn it into a practice.',
    G14: 'What Veta has counted in the office chats. These are counts, not opinions.',
    G1: 'Your office at a glance. Choose what you want to see or decide.',
    G1d: 'What is waiting for your decision, one thing at a time.',
    G1p: 'Your team. Tap a person to see what they handle.',
    G1m: 'The rest of the office: what comes in, alerts and settings.',
    G2: 'Everything about this matter. Decide who handles it.',
    G2b: 'A job proposed for the whole office. Try it for two weeks or discard it.',
    G3: 'The office\'s week, in team figures. Send the summary.',
    G3b: 'The email as the team will receive it. Read it and send it.',
    G3c: 'The agenda with your three topics. Send it to the team.',
    G3d: 'Each office compared with itself, week by week.',
    G3e: 'The hours the team gains, with the times each person sets.',
    G5: 'The work left with nobody. Decide who it goes to.',
    G5b: 'What is going to happen, before anyone\'s work is touched. Confirm or cancel.',
    G6: 'Say when you want Veta to alert you. Veta keeps watch.',
    G7: 'What Veta listens to in the office. Switch each channel on or off.',
    G7b: 'What you see and what each person sees, in plain words.',
    G7c: 'The daily report of the pilot.',
    G8: 'The whole week in one report, to read calmly or print.',
    G9: 'What reaches the office and nobody has answered. Hand out what has no owner.',
    G15: 'Everything Veta does for the office, in three groups. Tap a group to open it.',
    G16: 'The office when it started with Veta and now.',
    G17: 'All the deals. At the top, the ones to look at today.',
    G18: 'How this deal is going and what comes next.',
    G19: 'What this person handles and what Veta does for them. You do not see their chats.'
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
    A18: {salvo: ['You do not have', 'Alerts', 'Chats I leave out']},
    A10: {salvo: ['Who does it?']},
    G3: {sinNumero: true}, G5: {salvo: ['Teresa\'s clients']}, G6: {}, G8: {}, G11: {}, G15: {}, G16: {}, G19: {},
    G2: {salvo: ['What they\'re asking for', 'What they said', 'Who can handle it', 'Who handles it']}
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
