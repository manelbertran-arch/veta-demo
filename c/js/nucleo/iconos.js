/* Veta demo · núcleo · iconos.js
   La librería de trazos de la demo antigua (fuente/core.js, líneas 193-224), copiada tal cual,
   más los que faltaban dibujados con el mismo trazo. Lienzo de 24, sin relleno, trazo 1,8, extremos redondos.
   Uso: VETA.ic('reloj', 24) devuelve el <svg>. */
(function () {
  'use strict';
  const P = {
    hoy: '<path d="M4 7h16M4 12h10M4 17h7"/>',
    vigilando: '<path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
    clientes: '<circle cx="9" cy="8" r="3.4"/><path d="M3 20c.6-3.4 3.1-5.4 6-5.4s5.4 2 6 5.4"/><path d="M16 4.8a3.2 3.2 0 0 1 0 6.4M18 14.8c1.7.7 2.8 2.4 3 5.2"/>',
    aprende: '<path d="M12 3l2.2 5.6L20 9.3l-4.4 3.9 1.3 5.8L12 16l-4.9 3 1.3-5.8L4 9.3l5.8-.7z"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
    enviar: '<path d="M4 12l16-8-6 16-3-7-7-1z"/>',
    globo: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
    chev: '<path d="M9 5l7 7-7 7"/>', atras: '<path d="M15 5l-7 7 7 7"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', candado: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    reloj: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
    cal: '<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M9 3v4M15 3v4"/>', corazon: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    rayo: '<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>', escalera: '<path d="M5 20h4v-4h4v-4h4V8h3"/>', ojo: '<path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
    escudo: '<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6z"/>', mapa: '<path d="M9 4L3.5 6v14L9 18l6 2 5.5-2V4L15 6z"/><path d="M9 4v14M15 6v14"/>',
    play: '<path d="M8 5.5v13l10.5-6.5z"/>', parar: '<rect x="7" y="7" width="10" height="10" rx="2.5" fill="currentColor"/>', papel: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>', mas: '<path d="M12 5v14M5 12h14"/>',
    luna: '<path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/>', grafica: '<path d="M4 19h16M7 16V11M12 16V7M17 16v-3"/>', borrar: '<path d="M5 7h14M10 7V4.5h4V7M7 7l1 13h8l1-13"/>',
    sello: '<circle cx="12" cy="10" r="6"/><path d="M9 15.5L8 21l4-2 4 2-1-5.5"/>', usuario: '<circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4.2 4-6.5 8-6.5s7.2 2.3 8 6.5"/>',
    paleta: '<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-1.8 0-1.4-1.3-1.7-1.3-3 0-1 .8-1.7 1.9-1.7H17a4 4 0 0 0 4-4c0-4.2-4-7.5-9-7.5z"/><circle cx="7.6" cy="11.2" r="1"/><circle cx="10" cy="7.4" r="1"/><circle cx="14.6" cy="7.4" r="1"/>',
    casa: '<path d="M4 11l8-7 8 7M6 10v10h12V10M10 20v-5h4v5"/>',
    foto: '<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><circle cx="9" cy="10.5" r="1.6"/><path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5"/>',
    equipo: '<circle cx="12" cy="8" r="3.2"/><circle cx="5.5" cy="10" r="2.4"/><circle cx="18.5" cy="10" r="2.4"/><path d="M6.8 19c.4-3 2.4-5 5.2-5s4.8 2 5.2 5M1.5 18c.2-2.2 1.6-3.6 3.5-3.9M22.5 18c-.2-2.2-1.6-3.6-3.5-3.9"/>',
    tarea: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8.5 12.3l2.5 2.5 4.5-5"/>',
    orden: '<path d="M4 7l5 5-5 5M12 18h8"/>',
    compartir: '<path d="M12 15V3M8 7l4-4 4 4M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"/>',
    pregunta: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    menos: '<path d="M5 12h14"/>',
    sol: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>',
    puntos: '<circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/>',
    cerrar: '<path d="M6 6l12 12M18 6L6 18"/>',
    cambiar: '<path d="M7 4L3.5 7.5 7 11M3.5 7.5H17M17 13l3.5 3.5L17 20M20.5 16.5H7"/>',
    entra: '<path d="M4 13.5L6.6 5h10.8L20 13.5V19H4z"/><path d="M4 13.5h4.6l1.2 2.2h4.4l1.2-2.2H20"/>',
    // ---- nuevos, mismo trazo ----
    campana: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',
    pausa: '<path d="M9 6v12M15 6v12"/>',
    probeta: '<path d="M9 3h6M10 3v6.5L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-8.5V3"/><path d="M7.5 15h9"/>',
    mano: '<path d="M8 12V6.5a1.5 1.5 0 0 1 3 0V11M11 10.5V5a1.5 1.5 0 0 1 3 0v5.5M14 10.5V6.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-.5a6 6 0 0 1-4.6-2.2L3.5 16a1.6 1.6 0 0 1 2.4-2.1L8 15.5"/>',
    caja: '<path d="M3.5 8h17v12h-17zM2.5 4h19v4h-19zM10 12h4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.2"/>',
    estrella: '<path d="M12 3l2.2 5.6L20 9.3l-4.4 3.9 1.3 5.8L12 16l-4.9 3 1.3-5.8L4 9.3l5.8-.7z"/>',
    aviso: '<path d="M12 3.5L2.5 20h19z"/><path d="M12 10v4.5M12 17.3v.2"/>',
    punto: '<circle cx="12" cy="12" r="3.2" fill="currentColor"/>',
    telefono: '<path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/>',
    chat: '<path d="M20 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-4.2A8 8 0 1 1 20 11.5z"/>',
    copiar: '<rect x="8.5" y="8.5" width="12" height="12" rx="2.5"/><path d="M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/>',
    editar: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    wifi: '<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.6 15.8a5 5 0 0 1 6.8 0"/><circle cx="12" cy="19" r="1" fill="currentColor"/>',
    sinred: '<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.6 15.8a5 5 0 0 1 6.8 0M3 3l18 18"/>',
    abajo: '<path d="M5 9l7 7 7-7"/>',
    libro: '<path d="M4 4.5h6a2 2 0 0 1 2 2V20a2 2 0 0 0-2-2H4zM20 4.5h-6a2 2 0 0 0-2 2V20a2 2 0 0 1 2-2h6z"/>'
  };
  VETA.iconos = P;
  VETA.ic = (n, w) => `<svg class="ic" viewBox="0 0 24 24" ${w ? `width="${w}" height="${w}"` : ''} fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${P[n] || ''}</svg>`;
})();
