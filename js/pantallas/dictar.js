/* Veta demo · pantallas · dictar.js · paquete A (El día)
   A3 · Dictar · #/dictar/<guion> (acta, tarea, nota, orden, pregunta, aviso, operacion, queja, mejorar; «libre» = el micro de la barra).
   Pantalla completa. El tiempo corre, la onda se mueve; «Terminar» pasa a texto (silueta 1,2 s) y abre el resultado.
   Al salir con «‹» sin terminar, lo dictado queda a medias y Hoy lo dice. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, ic = VETA.ic;
  const DA = () => VETA.datos.diaA || {};
  const guionDe = p => {
    const g = p.guion === 'libre' || !VETA.datos.dictados[p.guion] ? (VETA.yo().papel === 'direccion' ? 'operacion' : p.guion === 'libre' ? 'orden' : 'tarea') : p.guion;
    const d = VETA.datos.dictados[g];
    return d && d.papel === 'direccion' && VETA.yo().papel !== 'direccion' ? 'tarea' : g;
  };
  // estado de esta grabación (se rehace al montar)
  let rec = null;

  const reloj = () => `${rec && rec.pausa ? 'En pausa' : 'Grabando'} · ${VETA.A.mmss(rec ? rec.seg : 0)}`;
  function ejemplo(g) {
    const d = VETA.datos.dictados[g] || {};
    const pie = g === 'orden' ? ((VETA.datos.r6 || {}).dia || {}).ordenPie : null;
    return `<span class="a-ej-r">Ejemplo de lo que puedes decir</span><p class="a-ej-t">«${esc(d.frase || '')}»</p>` + (pie ? `<p class="a-ej-p">${esc(pie)}</p>` : '') +
      `<p class="nota nota-gris a-ej-n">En esta demo no se usa tu micrófono.</p>`;
  }
  function pintaEstado(el) {
    if (!el || !rec) return;
    const t = el.querySelector('.a-rec-t'); if (t) t.textContent = reloj();
    el.querySelector('.a-rec').classList.toggle('pausada', !!rec.pausa);
    const o = el.querySelector('.onda'); if (o) o.classList.toggle('pausada', !!rec.pausa);
  }

  VETA.pantalla('A3', {
    guia: ['Aquí hablas como se lo contarías a un compañero.', 'Tú dices cómo ha ido, qué hay que hacer o qué quieres que aprenda.', 'Así Veta lo ordena: una nota de la visita, una tarea, una nota o un trabajo.'],
    pinta: p => {
      const g = guionDe(p), ctx = (DA().contexto || {})[g];
      return `<div class="a-rec" data-i="0"><span class="a-punto" aria-hidden="true"></span><span class="a-rec-t" role="timer" aria-live="off">Grabando · 0:00</span></div>` +
        `<div class="a-voz" data-i="1">${UI.onda()}</div>` +
        (ctx ? `<p class="a-ctx" data-i="1">${esc(ctx)}</p>` : '') +
        `<div class="tarjeta a-ej" data-i="2">${ejemplo(g)}</div>` +
        `<p class="a-senal" data-i="3">${ic('sinred', 18)}<span>Si no hay señal, se guarda en tu móvil y se ordena cuando vuelva.</span></p>` +
        `<button type="button" class="enlace a-que" data-hoja="h08" data-i="3">¿Qué puedo decir?</button>`;
    },
    botonFijo: () => UI.boton({texto: 'Terminar', accion: 'terminar', g: 'Terminar|Paso a texto lo que has dicho y te enseño cómo lo he entendido.'}) +
      UI.botones([{texto: 'Pausar', accion: 'pausar', icono: 'pausa', clase: 'a-pausar'}, {texto: 'Escribir', accion: 'escribir', icono: 'editar', clase: 'a-escribir'}]),
    alMontar: (el, p) => {
      const g = guionDe(p), d = VETA.A.dictado();
      rec = {g, seg: d && d.guion === g ? d.seg : 0, pausa: false, texto: '', escribe: false, el};
      pintaEstado(el);
      if (VETA.vivo && VETA.vivo.halo) VETA.vivo.halo(true);   // el borde se enciende mientras escucha
      const yo = rec;
      clearInterval(VETA.A._dictT);
      VETA.A._dictT = setInterval(() => {
        if (rec !== yo || !el.isConnected) { clearInterval(VETA.A._dictT); return; }
        if (yo.pausa || yo.fin) return;
        yo.seg += 1; pintaEstado(el);
        if (yo.seg >= 1) VETA.est.pon('a.dictado', {guion: yo.g, seg: yo.seg});
      }, 1000);
    },
    acciones: {
      pausar(ev, el) {
        if (!rec) return; rec.pausa = !rec.pausa;
        const b = el.closest('.btn'); if (b) b.innerHTML = `${ic(rec.pausa ? 'play' : 'pausa', 20)}<span>${rec.pausa ? 'Seguir' : 'Pausar'}</span>`;
        pintaEstado(rec.el);
        if (VETA.vivo && VETA.vivo.halo) VETA.vivo.halo(!rec.pausa);
      },
      escribir(ev, el) {
        if (!rec) return; rec.escribe = !rec.escribe;
        const voz = rec.el.querySelector('.a-voz');
        if (rec.escribe) {
          voz.innerHTML = `<div class="campo a-escribe"><label class="campo-e" for="a-texto">Escribe lo que querías decir</label><div class="campo-caja"><textarea id="a-texto" class="campo-i" rows="4" placeholder="Por ejemplo: llamar a Jordi el jueves"></textarea></div></div>`;
          const t = voz.querySelector('textarea'); t.value = rec.texto || ''; t.addEventListener('input', () => { rec.texto = t.value; });
          try { t.focus({preventScroll: true}); } catch (x) {}
        } else voz.innerHTML = UI.onda({pausada: rec.pausa});
        const b = el.closest('.btn'); if (b) b.innerHTML = `${ic(rec.escribe ? 'mic' : 'editar', 20)}<span>${rec.escribe ? 'Hablar' : 'Escribir'}</span>`;
      },
      terminar() {
        if (!rec || rec.fin) return;
        rec.fin = true; clearInterval(VETA.A._dictT);
        if (VETA.vivo && VETA.vivo.halo) VETA.vivo.halo(false);
        const g = rec.g, d = VETA.datos.dictados[g] || {};
        const texto = (rec.escribe && rec.texto.trim()) ? rec.texto.trim() : d.frase;
        VETA.est.pon('a.ultimoDictado', {guion: g, seg: rec.seg || ((DA().duracion || {})[g] || 0), texto, hora: VETA.ahora()});
        VETA.est.pon('a.dictado', null);
        const cuerpo = rec.el.querySelector('.pant-cuerpo');
        const fijo = rec.el.closest('.col') && rec.el.closest('.col').querySelector('.fijo');
        if (fijo) fijo.querySelectorAll('button').forEach(b => { b.disabled = true; });
        const o = rec.el.querySelector('.onda'); if (o) o.classList.add('pausada');
        if (cuerpo) cuerpo.innerHTML = `<p class="a-pasando" role="status">Lo paso a texto…</p>${UI.silueta(4)}`;
        setTimeout(() => {
          if (VETA.actual() && VETA.actual().def.cod !== 'A3') return;
          const va = d.va || 'entendido-dictado/tarea';
          VETA.ir(va, {reemplaza: true});
          if (g === 'queja') setTimeout(() => VETA.hoja('h39', {de: 'joan-serra'}), VETA.reducido() ? 50 : 450);
        }, 1200);
      }
    }
  });

  // H08 · «¿Qué puedo decir?»: cambia el guion en el sitio y sigue grabando
  VETA.hojaDef('h08', {
    titulo: '¿Qué puedo decir?',
    pinta: () => {
      const dir = VETA.yo().papel === 'direccion';
      // dirección ve sus propios ejemplos (los de la agente hablan de los clientes de Laura)
      const ops = (DA().queDecir || []).filter(o => dir ? o.papel === 'direccion' : (!o.papel && o.guion !== 'pregunta'));
      return `<div class="ops">${ops.map(o => `<button type="button" class="op op-elige" role="radio" aria-checked="${!!rec && rec.g === o.guion}" data-accion="guion" data-guion="${esc(o.guion)}">` +
        `<span class="op-c"><span class="op-t">${esc(o.texto)}</span><span class="op-s">«${esc((VETA.datos.dictados[o.guion] || {}).frase || '')}»</span></span><span class="op-marca">${ic('check', 20)}</span></button>`).join('')}</div>` +
        UI.boton({tipo: 'texto', texto: 'Cancelar', datos: {cierra: '1'}, clase: 'hoja-cancela'});
    },
    acciones: {
      guion(ev, el) {
        const g = el.dataset.guion; VETA.cierraHoja({foco: false});
        if (!rec || !rec.el.isConnected) { VETA.ir('dictar/' + g, {reemplaza: true}); return; }
        rec.g = g;
        const ej = rec.el.querySelector('.a-ej'); if (ej) ej.innerHTML = ejemplo(g);
        const ctx = rec.el.querySelector('.a-ctx'), t = (DA().contexto || {})[g];
        if (ctx && t) ctx.textContent = t; else if (ctx) ctx.remove();
        else if (t) rec.el.querySelector('.a-voz').insertAdjacentHTML('afterend', `<p class="a-ctx">${esc(t)}</p>`);
        if (ej && !VETA.reducido()) { ej.classList.remove('a-cambia'); void ej.offsetWidth; ej.classList.add('a-cambia'); }
      }
    }
  });
})();
