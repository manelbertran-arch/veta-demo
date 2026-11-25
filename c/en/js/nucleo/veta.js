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
  // Con desfase en minutos (“Leído hasta las…” es la hora menos 3).
  const INICIO = 9 * 60 + 41, T0 = Date.now();
  VETA.ahora = (desfaseMin) => {
    const corre = Math.min(20, Math.floor((Date.now() - T0) / 60000));
    const m = INICIO + corre + (desfaseMin || 0);
    return Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0');
  };

  // ---- fechas y horas: un solo formato en toda la app (ronda 8, 6.3). Tres formas cerradas; nadie escribe una fecha a mano ----
  //   VETA.fecha.corta('2026-11-25')        → “Mié 25”   la cola de una fila y cualquier sitio estrecho. Hoy, ayer y mañana → “Hoy”, “Ayer”, “Mañana”;
  //                                            a más de seis días → “3 dic”. Con hora: “Mié 25, 10:00” · “Hoy, 9:41”
  //   VETA.fecha.larga('2026-11-25T10:00')  → “Miércoles 25 de noviembre, 10:00”   cabeceras y documentos
  //   VETA.fecha.hora('2026-11-25T9:05') · VETA.fecha.hora('09:05') → “9:05”   24 horas, sin cero delante y sin “h”
  // Dentro de una frase, en minúscula: {frase: true} → “mié 25”, “hoy”, “miércoles 25 de noviembre”. {dia: true} en corta no dice “Hoy”: “Lun 23”.
  // Aceptan 'AAAA-MM-DD', 'AAAA-MM-DDTHH:MM' o un Date. “Hoy” es el de la demo (datos.fecha.hoyISO).
  const DIAS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], DIA3 = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MESES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const MES3 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const parte = x => {
    if (x instanceof Date) return {d: new Date(x.getFullYear(), x.getMonth(), x.getDate()), h: x.getHours() + ':' + String(x.getMinutes()).padStart(2, '0')};
    const m = /^(\d{4})-(\d\d?)-(\d\d?)(?:[T ](\d\d?):(\d\d))?/.exec(String(x || '')); if (!m) return null;
    return {d: new Date(+m[1], m[2] - 1, +m[3]), h: m[4] != null ? +m[4] + ':' + m[5] : null};
  };
  const mayus = (t, o) => (o && o.frase ? t : t.replace(/^./, c => c.toUpperCase()));
  const hoyD = () => (parte((VETA.datos.fecha || {}).hoyISO) || {d: new Date()}).d;
  VETA.fecha = {
    hora: x => { const m = /(\d\d?):(\d\d)\s*$/.exec(String(x || '')); if (m) return +m[1] + ':' + m[2]; const p = parte(x); return p && p.h ? p.h : ''; },
    corta: (x, o) => {
      const p = parte(x); if (!p) return String(x || '');
      const n = Math.round((p.d - hoyD()) / 864e5);
      const dia = !(o && o.dia) && n >= -1 && n <= 1 ? ['yesterday', 'today', 'tomorrow'][n + 1] : Math.abs(n) <= 6 ? DIA3[p.d.getDay()] + ' ' + p.d.getDate() : p.d.getDate() + ' ' + MES3[p.d.getMonth()];
      return mayus(dia, o) + (p.h ? ', ' + p.h : '');
    },
    larga: (x, o) => {
      const p = parte(x); if (!p) return String(x || '');
      return mayus(DIAS[p.d.getDay()], o) + ' ' + p.d.getDate() + ' ' + MESES[p.d.getMonth()] + (p.d.getFullYear() !== hoyD().getFullYear() ? ' ' + p.d.getFullYear() : '') + (p.h ? ', ' + p.h : '');
    }
  };

  // privacidad de dirección: un cliente es “ajeno” si quien mira es dirección y lo lleva otra persona.
  // De un cliente ajeno no se enseña nunca el texto de su chat (ni citas ni burbujas): solo quién lo lleva y los hitos.
  VETA.ajeno = id => {
    const yo = VETA.yo && VETA.yo(); if (!yo || yo.papel !== 'direccion') return false;
    const c = (VETA.datos.clientes || {})[id];
    // un contacto sin dueño que dirección asigna a otra persona pasa a ser de esa persona
    const asig = c && !c.lleva && VETA.dir && VETA.dir.asignado ? VETA.dir.asignado(id) : null;
    const lleva = c && (c.lleva || (asig && asig.a));
    return !!(lleva && lleva !== yo.id);
  };
  // can the viewer read the literal text (quote, bubble) of this contact? One gate for everything that paints a contact's text.
  // Agent: yes. Management: only if the contact is THEIRS; one with no owner, or looked after by someone else, shows the status, never the text.
  VETA.verLiteral = id => {
    const yo = VETA.yo && VETA.yo(); if (!yo || yo.papel !== 'direccion') return true;
    return VETA.esSuyo(id);
  };
  VETA.esSuyo = id => {
    const yo = VETA.yo && VETA.yo(); if (!yo) return false;
    const c = (VETA.datos.clientes || {})[id]; if (!c) return false;
    const asig = !c.lleva && VETA.dir && VETA.dir.asignado ? VETA.dir.asignado(id) : null;
    return (c.lleva || (asig && asig.a)) === yo.id;
  };
  VETA.sinLiteral = id => !VETA.verLiteral(id);
  // el cliente dueño de un chat (“pere-voz” → pere) o de una cosa de la cola (“c-marta” → marta)
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
  // “Está en el chat de Laura con Jordi”: la frase que sustituye a una cita ajena
  VETA.chatAjenoTexto = id => {
    const c = (VETA.datos.clientes || {})[id] || {}, asig = !c.lleva && VETA.dir && VETA.dir.asignado ? VETA.dir.asignado(id) : null;
    const p = (VETA.datos.personas || {})[c.lleva || (asig && asig.a)];
    if (!p) return 'Nobody looks after them yet. Management does not read what contacts write: it only sees the status.';
    return `It is in ${p.corto || 'another person'}'s chat with ${c.corto || c.nombre || 'their client'}. Management does not read each person's chats.`;
  };

  // cifras con punto de miles a la española (1.196), también en números de 4 cifras
  VETA.num = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  VETA.euros = n => '€' + VETA.num(n);
  VETA.horas = min => { min = Math.round(min); const h = Math.floor(min / 60), m = min % 60; return h ? (h + ' h' + (m ? ' ' + m + ' min' : '')) : (m + ' min'); };

  VETA.param = k => { try { return new URLSearchParams(location.search).get(k); } catch (e) { return null; } };
  VETA.tieneParam = k => { try { return new URLSearchParams(location.search).has(k); } catch (e) { return false; } };

  VETA.reducido = () => document.documentElement.dataset.mov === 'reducido';
  VETA.ordenador = () => !!(window.matchMedia && matchMedia('(min-width: 900px)').matches);

  // iniciales de un nombre: “Montse Ribas” → “MR”
  VETA.iniciales = nombre => String(nombre || '?').replace(/\s+family$/, '').split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();
})();
