/* Veta demo · datos · r6-dia.js · ronda 6 · paquete A · El día (P1)
   Los datos nuevos de este paquete para la ronda 6, en VETA.datos.r6.dia.
   Reutiliza las cifras que ya tiene la app; lo inventado aquí se apunta en ESTADO_R6_P1.md. */
(function () {
  'use strict';
  const D = VETA.datos, R = D.r6 = D.r6 || {};
  R.dia = Object.assign(R.dia || {}, {
    // “Hoy te tocan 6 cosas. Hace un mes eran 9.” (9 → 6 es la cifra de PIEZAS_VIVAS y de la estrategia)
    haceUnMes: 9,
    // “Esto lo hago yo” · lo que Veta cerró sola desde ayer (inventado por P1; son 2, como dice “he cerrado 2”)
    cerradas: [
      {id: 'x-toni', cliente: 'toni', corto: 'Toni replied', titulo: 'Toni Ribas has replied', texto: 'I closed it yesterday, 21:10.',
        tuya: 'Write to Toni Ribas', abierta: 'Opened again. It\'s your turn.'},
      {id: 'x-casals', icono: 'check', corto: 'the ID arrived', titulo: 'The ID from the Casals arrived', texto: 'I closed it on Friday.',
        tuya: 'Ask the Casals for their ID', abierta: 'Opened again. It\'s your turn.'}],
    // “Vigilo N cosas”: de qué tipo es cada cosa de En espera (lo que no esté aquí cuenta como “respuestas”)
    vigilo: {'e-elena': 'promesas', 'e-nuria': 'promesas', 'e-pere': 'papeles', 'e-jordi': 'papeles', 'e-laia': 'fechas', 'e-pere-encargo': 'fechas', 'e-llamar-elena': 'llamadas'},
    // “Lo que he aprendido de ti” · una regla con quién, cuándo y cuenta (regla r-informes: activa desde el 7 oct; lunes 12, 19 y 26 oct y 2, 9 y 16 nov = 6; “me cambiaste 1”, inventado)
    aprendido: {regla: 'r-informes', titulo: 'I prepare Pere\'s report every Monday', origen: 'Pere asked you on 2 Oct', hechas: 6, cambiadas: 1, ir: 'regla/r-informes'},
    // “¿Lo hago yo?” · trabajos que Laura repite (r-visitas es la regla de P2, en r6-veta.js) (9 veces: cifra de la estrategia; 11 = de los 14 casos de r-valoraciones, en 11 hiciste lo mismo, como dice la pestaña Veta)
    loHagoYo: [
      {id: 'visitas', titulo: 'Confirm viewings the day before', veces: 9, ir: 'regla/r-visitas'},
      {id: 'r-valoraciones', regla: 'r-valoraciones', titulo: 'Prepare the flat report before a valuation', veces: 14, ir: 'regla/r-valoraciones'}],
    // la regla de confirmar visitas, según la clave r6_regla_visitas
    // la visita de mañana NO cuenta en “Hoy te tocan”: no es ninguna de las seis tarjetas (pulido: una sola cifra en los tres sitios).
    // 'sola' = “Lo apunto yo”: si el cliente ya ha dicho que viene, lo apunto; si no, te dejo el mensaje escrito. No envío nada.
    visitas: {prueba: 'I\'m trying it out. I\'ll show it to you before I send it.', solaT: 'Confirm viewings the day before',
      sola: 'Toni Ribas is coming tomorrow at 10:00. I have written it down.', ir: 'regla/r-visitas'},
    // El momento de aprender · atajo de demostración: “Dar dos horas” en Editar mensaje
    dosHoras: {'c-marta': 'Hi Marta, it\'s Laura. Does this Saturday at 11:00 or 12:30 suit you better to see the Gràcia flat? I\'ll send you the address.'},
    reglaDosHoras: 'When I suggest a viewing, I offer two times',
    // lo que se lee tras “Sí, siempre”: exactamente lo aprendido
    aprendidoDosHoras: 'From now on, when I suggest a viewing, I offer two times',
    // el siguiente borrador del mismo tipo, ya cambiado
    aplica: {cosa: 'c-nuria', corto: 'Núria',
      texto: 'Hi Núria, it\'s Laura. A flat has come in in Sant Antoni with a balcony: 2 bedrooms, €289,000. Does Thursday at 18:00 or Friday at 10:00 suit you better to see it?',
      frase: 'Thursday at 18:00 or Friday at 10:00', aviso: 'I did what you just showed me.'}
  });

  // “Hoy te tocan N”: la cuenta vive en VETA.r6.tocan (js/nucleo/vivo.js), una sola fuente.

  // Núria: su borrador propone la visita con una pregunta abierta (antes: “¿Te paso fotos?”), para que lo aprendido se vea aplicado
  const nuria = ((D.cola || {}).laura || []).find(c => c.id === 'c-nuria');
  if (nuria) nuria.borrador = 'Hi Núria, it\'s Laura. A flat has come in in Sant Antoni with a balcony: 2 bedrooms, €289,000. When would you like to see it?';

  // Las cinco respuestas, siempre con las mismas palabras: tres a la vista y estas en “Otra cosa…”
  const otra = [{texto: 'I already handled it by phone', estado: 'hecha', linea: 'Resolved · you handled it by phone'},
    {texto: 'Not today', estado: 'para-manana'}, {texto: 'That\'s wrong', paso: 'mal'}];
  ((D.cola || {}).laura || []).forEach(c => { if ((c.secundarios || []).some(s => s.hoja === 'h02') && !c.otraCosa) c.otraCosa = otra; });
})();
