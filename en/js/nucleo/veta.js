/* Veta demo · núcleo · veta.js
   El espacio de nombres VETA y utilidades pequeñas que usa todo el mundo.
   Guiones clásicos, sin módulos: cada archivo rellena window.VETA. */
(function () {
  'use strict';
  const VETA = window.VETA = window.VETA || {};
  VETA.datos = VETA.datos || {};

  VETA.$ = (q, r) => (r || document).querySelector(q);
  VETA.$$ = (q, r) => Array.from((r || document).querySelectorAll(q));

  // escapa texto para meterlo en HTML (lo que escribe la persona en un campo)
  VETA.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

  // hora de la demo: el reloj arranca a las 9:41 del lunes 23 al abrir la app y corre con el tiempo real
  // (como mucho 20 minutos, lo que dura el guion). Así cuadra con los datos se enseñe a la hora que se enseñe.
  // Con desfase en minutos («Leído hasta las…» es la hora menos 3).
  const INICIO = 9 * 60 + 41, T0 = Date.now();
  VETA.ahora = (desfaseMin) => {
    const corre = Math.min(20, Math.floor((Date.now() - T0) / 60000));
    const m = INICIO + corre + (desfaseMin || 0);
    return Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0');
  };

  // privacidad de dirección: un cliente es «ajeno» si quien mira es dirección y lo lleva otra persona.
  // De un cliente ajeno no se enseña nunca el texto de su chat (ni citas ni burbujas): solo quién lo lleva y los hitos.
  VETA.ajeno = id => {
    const yo = VETA.yo && VETA.yo(); if (!yo || yo.papel !== 'direccion') return false;
    const c = (VETA.datos.clientes || {})[id];
    // un contacto sin dueño que dirección asigna a otra persona pasa a ser de esa persona
    const asig = c && !c.lleva && VETA.dir && VETA.dir.asignado ? VETA.dir.asignado(id) : null;
    const lleva = c && (c.lleva || (asig && asig.a));
    return !!(lleva && lleva !== yo.id);
  };
  // el cliente dueño de un chat («pere-voz» → pere) o de una cosa de la cola («c-marta» → marta)
  VETA.duenoDe = ({chat, de} = {}) => {
    const cl = VETA.datos.clientes || {};
    if (chat) { const c = Object.values(cl).find(x => x.chat === chat) || cl[chat] || cl[String(chat).split('-')[0]]; return c ? c.id : null; }
    if (de) {
      if (cl[de]) return de;
      const k = VETA.modelo && VETA.modelo.cosa && VETA.modelo.cosa(de); if (k && k.cliente) return k.cliente;
      const id = String(de).replace(/^[a-z]+-/, ''); return cl[id] ? id : null;
    }
    return null;
  };
  // «Está en el chat de Laura con Jordi»: la frase que sustituye a una cita ajena
  VETA.chatAjenoTexto = id => {
    const c = (VETA.datos.clientes || {})[id] || {}, p = (VETA.datos.personas || {})[c.lleva] || {};
    return `It's in the chat of ${p.corto || 'another person'} with ${c.corto || c.nombre || 'their client'}. Management doesn't read each person's chats.`;
  };

  // cifras con punto de miles a la española (1.196), también en números de 4 cifras
  VETA.num = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  VETA.euros = n => '€' + VETA.num(n);
  VETA.horas = min => { min = Math.round(min); const h = Math.floor(min / 60), m = min % 60; return h ? (h + ' h' + (m ? ' ' + m + ' min' : '')) : (m + ' min'); };

  VETA.param = k => { try { return new URLSearchParams(location.search).get(k); } catch (e) { return null; } };
  VETA.tieneParam = k => { try { return new URLSearchParams(location.search).has(k); } catch (e) { return false; } };

  VETA.reducido = () => document.documentElement.dataset.mov === 'reducido';
  VETA.ordenador = () => !!(window.matchMedia && matchMedia('(min-width: 900px)').matches);

  // iniciales de un nombre: «Montse Ribas» → «MR»
  VETA.iniciales = nombre => String(nombre || '?').replace(/^Família\s+/, '').replace(/\s+family$/, '').split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();
})();
