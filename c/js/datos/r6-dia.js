/* Veta demo · datos · r6-dia.js · ronda 6 · paquete A · El día (P1)
   Los datos nuevos de este paquete para la ronda 6, en VETA.datos.r6.dia.
   Reutiliza las cifras que ya tiene la app; lo inventado aquí se apunta en ESTADO_R6_P1.md. */
(function () {
  'use strict';
  const D = VETA.datos, R = D.r6 = D.r6 || {};
  R.dia = Object.assign(R.dia || {}, {
    // «Hoy te tocan 6 cosas. Hace un mes eran 9.» (9 → 6 es la cifra de PIEZAS_VIVAS y de la estrategia)
    haceUnMes: 9,
    // «Esto lo hago yo» · lo que Veta cerró sola desde ayer (inventado por P1; son 2, como dice «he cerrado 2»)
    cerradas: [
      {id: 'x-toni', cliente: 'toni', corto: 'Toni contestó', titulo: 'Toni Ribas ya contestó', texto: 'Lo cerré ayer, 21:10.',
        tuya: 'Escribir a Toni Ribas', abierta: 'Abierto otra vez. Te toca a ti.'},
      {id: 'x-casals', icono: 'check', corto: 'el DNI llegó', titulo: 'Llegó el DNI de Casals', texto: 'Lo cerré el viernes.',
        tuya: 'Pedir el DNI a Casals', abierta: 'Abierto otra vez. Te toca a ti.'}],
    // «Vigilo N cosas»: de qué tipo es cada cosa de En espera (lo que no esté aquí cuenta como «respuestas»)
    vigilo: {'e-elena': 'promesas', 'e-nuria': 'promesas', 'e-pere': 'papeles', 'e-jordi': 'papeles', 'e-laia': 'fechas', 'e-pere-encargo': 'fechas', 'e-llamar-elena': 'llamadas'},
    // «Lo que he aprendido de ti» · una regla con quién, cuándo y cuenta (regla r-informes: activa desde el 7 oct; lunes 12, 19 y 26 oct y 2, 9 y 16 nov = 6; «me cambiaste 1», inventado)
    aprendido: {regla: 'r-informes', titulo: 'Preparo el informe de Pere cada lunes', origen: 'Te lo pidió Pere el 2 oct', hechas: 6, cambiadas: 1, ir: 'regla/r-informes'},
    // «¿Lo hago yo?» · trabajos que Laura repite (r-visitas es la regla de P2, en r6-veta.js) (9 veces: cifra de la estrategia; 11 = de los 14 casos de r-valoraciones, en 11 hiciste lo mismo, como dice la pestaña Veta)
    loHagoYo: [
      {id: 'visitas', titulo: 'Confirmar las visitas el día antes', veces: 9, ir: 'regla/r-visitas'},
      {id: 'r-valoraciones', regla: 'r-valoraciones', titulo: 'Preparar el informe del piso antes de una valoración', veces: 14, ir: 'regla/r-valoraciones'}],
    // la regla de confirmar visitas, según la clave r6_regla_visitas
    // la visita de mañana NO cuenta en «Hoy te tocan»: no es ninguna de las seis tarjetas (pulido: una sola cifra en los tres sitios).
    // 'sola' = «Lo apunto yo»: si el cliente ya ha dicho que viene, lo apunto; si no, te dejo el mensaje escrito. No envío nada.
    visitas: {prueba: 'Lo estoy probando. Te lo enseño antes de enviarlo.', solaT: 'Confirmar las visitas el día antes',
      sola: 'Toni Ribas viene mañana a las 10:00. Lo he apuntado yo.', ir: 'regla/r-visitas'},
    // El momento de aprender · atajo de demostración: «Dar dos horas» en Editar mensaje
    dosHoras: {'c-marta': 'Hola, Marta, soy Laura. ¿Os va mejor este sábado a las 11:00 o a las 12:30 para ver el piso de Gràcia? Te paso la dirección.'},
    reglaDosHoras: 'Cuando proponga una visita, doy dos horas',
    // lo que se lee tras «Sí, siempre»: exactamente lo aprendido
    aprendidoDosHoras: 'Desde ahora, cuando proponga una visita, doy dos horas',
    // el siguiente borrador del mismo tipo, ya cambiado
    aplica: {cosa: 'c-nuria', corto: 'Núria',
      texto: 'Hola, Núria, soy Laura. Ha entrado un piso en Sant Antoni con balcón: 2 habitaciones, 289.000 €. ¿Te va mejor verlo el jueves a las 18:00 o el viernes a las 10:00?',
      frase: 'el jueves a las 18:00 o el viernes a las 10:00', aviso: 'Aplicado lo que me acabas de enseñar.'}
  });

  // «Hoy te tocan N»: la cuenta vive en VETA.r6.tocan (js/nucleo/vivo.js), una sola fuente.

  // Núria: su borrador propone la visita con una pregunta abierta (antes: «¿Te paso fotos?»), para que lo aprendido se vea aplicado
  const nuria = ((D.cola || {}).laura || []).find(c => c.id === 'c-nuria');
  if (nuria) nuria.borrador = 'Hola, Núria, soy Laura. Ha entrado un piso en Sant Antoni con balcón: 2 habitaciones, 289.000 €. ¿Cuándo te va bien verlo?';

  // Las cinco respuestas, siempre con las mismas palabras: tres a la vista y estas en «Otra cosa…»
  const otra = [{texto: 'Ya lo llevé por teléfono', estado: 'hecha', linea: 'Resuelto · lo llevaste por teléfono'},
    {texto: 'Hoy no', estado: 'para-manana'}, {texto: 'Está mal', paso: 'mal'}];
  ((D.cola || {}).laura || []).forEach(c => { if ((c.secundarios || []).some(s => s.hoja === 'h02') && !c.otraCosa) c.otraCosa = otra; });
})();
