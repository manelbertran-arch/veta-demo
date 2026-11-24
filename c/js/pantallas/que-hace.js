/* Veta demo · pantallas · que-hace.js · carril C (Veta y cuenta)
   A19 · #/que-hace · «Cómo funciona Veta»: el único sitio que lo explica, fuera del camino (primera fila de Cuenta, para los dos papeles).
   Un subtítulo y tres listas con rótulo: «Leo», «Te dejo listo», «Aprendo». Cada fila lleva a su sitio en la app, y solo se pinta
   si quien mira puede abrirlo: ninguna rebota a Inicio. Se llega desde Cuenta y desde el primer día (A18). */
(function () {
  'use strict';
  const C = VETA.c;
  // el destino de una fila: el mismo para los dos papeles (texto) o uno por papel ({agente, direccion}; sin el suyo, la fila no sale)
  const destino = r => (typeof r === 'string' ? r : r[VETA.yo().papel] || null);
  const abre = r => { try { return !!r && !VETA.vedada(r) && VETA.redirige(r) !== 'inicio'; } catch (e) { return false; } };
  const grupos = () => [
    ['Leo', [
      ['Leo tus chats de trabajo', 'cuenta/chats', VETA.num(C.leidos())],
      ['Apunto lo que te prometen', 'espera'],
      ['Me acuerdo de cada cliente', {agente: 'cliente/marta', direccion: 'clientes'}]]],
    ['Te dejo listo', [
      ['Las respuestas, escritas', {agente: 'toca/c-marta', direccion: 'hoy'}],
      ['El acta de cada visita', {agente: 'visita/elena'}],
      ['El informe del propietario', {agente: 'regla/r-informes', direccion: 'oficina-que-hace'}]]],
    ['Aprendo', [
      ['Cuando me corriges', {agente: 'aprendido', direccion: 'oficina/aprende'}],
      ['De lo que haces siempre igual', {agente: 'regla/r-valoraciones', direccion: 'regla-oficina/dossier'}],
      ['De lo que me dictas', {agente: 'dictar/orden', direccion: 'dictar/libre'}]]]
  ];

  VETA.pantalla('A19', {
    titulo: 'Cómo funciona Veta',
    sub: 'Leo tus chats, dejo listo lo que toca y aprendo de ti.',
    pinta: () => grupos().map(([rotulo, filas], k) => {
      const l = filas.map(([nombre, r, dato]) => ({nombre, dato, ir: destino(r)})).filter(f => abre(f.ir));
      return l.length ? VETA.r7.lista(l, {rotulo, i: k}) : '';
    }).join('')
  });
})();
