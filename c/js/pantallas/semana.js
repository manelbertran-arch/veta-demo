/* Veta demo · pantallas · semana.js · paquete C (Veta, cuenta y entrada)
   - A14 · Tu semana · #/semana
   La única pantalla con cifras para el agente. Sin horas hasta que la persona pone sus tiempos (H24). */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, C = VETA.c;
  let ventana = '7d', ruedaHoras = false, primera = true;
  C.ruedaHoras = () => { ruedaHoras = true; };

  VETA.pantalla('A14', {
    titulo: 'Tu semana',
    frase: () => (VETA.yo().papel === 'direccion' ? 'Lo que hice por ti la semana pasada.' : 'Lo que hice por ti esta semana. Toca una fila para ver más.'),
    pinta: () => {
      const t = M.lee('tiempos', null), min = t ? M.minutosLaura(t) : 0;
      const s = C.semanaDe(), dir = VETA.yo().papel === 'direccion', R = VETA.r7;
      const cifras = [
        {icono: 'chat', oro: true, nombre: 'Mensajes que te dejé escritos', pasa: `Enviaste ${s.enviados} · retocaste ${s.retocados}`, numero: s.preparados},
        {icono: 'doc', oro: true, nombre: s.actas === 1 ? 'Acta de visita guardada' : 'Actas de visita guardadas', numero: s.actas},
        {icono: 'mano', oro: true, nombre: 'Promesas apuntadas', numero: s.promesas}];
      // dirección: solo lo suyo; lo del equipo está en Veta de la oficina
      if (dir) return R.lista(cifras.concat([
        {icono: 'escudo', nombre: 'Lo que ven los demás', pasa: 'Tus cifras, no tus chats', abre: '<p>En la semana del equipo salen tus cifras junto a las de cada persona. Nadie ve lo que escribes en tus chats.</p>'},
        {icono: 'equipo', nombre: 'La semana del equipo', pasa: 'Cifras de toda la oficina', ir: 'semana-equipo'}]), {i: 0});
      // lo que cerré sola desde ayer (sale de Te toca a ti): se puede abrir otra vez
      const cerr = C.cerradas().map(x => ({cara: x.cliente || null, icono: x.icono || 'check', oro: true, nombre: x.titulo, pasa: 'Lo cerré yo · ' + x.texto.replace(/^Lo cerré /, '').replace(/\.$/, ''),
        abre: `<p>Lo di por hecho sin preguntarte.</p><button type="button" class="r7c-caso" data-accion="reabre" data-de="${esc(x.id)}"><span><b>Ábrelo otra vez</b> · te toca a ti</span>${VETA.ic('chev', 16)}</button>`}));
      return R.lista(cerr.concat(cifras, [
        t ? {icono: 'reloj', nombre: 'Tiempo que te ahorré', pasa: 'Con tus tiempos · ejemplo', numero: VETA.horas(min), hoja: 'h24'}
          : {icono: 'reloj', nombre: 'Tus tiempos', pasa: 'Ponlos y te digo las horas', hoja: 'h24'},
        {icono: 'mano', nombre: 'Lo que aún haces a mano', pasa: '3 trabajos', hoja: 'c-mano'},
        {icono: 'cal', nombre: 'Semanas anteriores', pasa: 'Las de antes, una a una', hoja: 'h25'}]), {i: 0});
    },
    alMontar: el => {
      // la cifra grande rueda al entrar la primera vez; las horas, al guardar los tiempos
      const c = el.querySelector('#c-cifra-31');
      if (c && primera) { primera = false; c.dataset.rueda = '0'; c.textContent = '0'; setTimeout(() => VETA.rueda(c, C.semanaDe().preparados), 160); }
      const h = el.querySelector('#c-horas');
      if (h && ruedaHoras) {
        ruedaHoras = false; const t = M.lee('tiempos', null);
        h.dataset.rueda = '0 h 00 min'; setTimeout(() => VETA.rueda(h, M.minutosLaura(t), {formato: VETA.horas}), 120);
      }
    },
    acciones: {
      // abrir otra vez lo que cerré: misma clave que Te toca a ti (a.r6.abiertas)
      reabre(ev, el) {
        const ab = VETA.est.lee('a.r6.abiertas', []) || []; if (!ab.includes(el.dataset.de)) ab.push(el.dataset.de);
        VETA.est.pon('a.r6.abiertas', ab); VETA.repinta(); VETA.pintaBarra(); VETA.aviso('Vale. Está en Te toca a ti.');
      },
      ventana(ev, el) {
        ventana = el.dataset.valor;
        const v = VETA.datos.numeros[ventana];
        VETA.$$('.pant-A14 [data-n8]').forEach(x => { if (x.dataset.rueda == null) x.dataset.rueda = x.textContent.trim(); VETA.rueda(x, v[Number(x.dataset.n8)]); });
      }
    }
  });
  C.tiemposTexto = t => VETA.datos.c.tiempos.map(x => `${t[x.id]} min`).join(', ').replace(/, ([^,]*)$/, ' y $1');
})();
