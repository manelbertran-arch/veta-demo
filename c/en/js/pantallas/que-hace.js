/* Veta demo · pantallas · que-hace.js · carril C (Veta y cuenta)
   A19 · #/que-hace · “Cómo funciona Veta”: el único sitio que lo explica, fuera del camino (primera fila de Cuenta, para los dos papeles).
   Un subtítulo y tres listas con rótulo: “Leo”, “Te dejo listo”, “Aprendo”. Cada fila lleva a su sitio en la app, y solo se pinta
   si quien mira puede abrirlo: ninguna rebota a Inicio. Se llega desde Cuenta y desde el primer día (A18). */
(function () {
  'use strict';
  const C = VETA.c;
  // el destino de una fila: el mismo para los dos papeles (texto) o uno por papel ({agente, direccion}; sin el suyo, la fila no sale)
  const destino = r => (typeof r === 'string' ? r : r[VETA.yo().papel] || null);
  const abre = r => { try { return !!r && !VETA.vedada(r) && VETA.redirige(r) !== 'inicio'; } catch (e) { return false; } };
  const grupos = () => [
    ['I read', [
      ['I read your work chats', 'cuenta/chats', VETA.num(C.leidos())],
      ['I note what people promise you', 'espera'],
      ['I remember every client', {agente: 'cliente/marta', direccion: 'clientes'}]]],
    ['I prepare', [
      ['Your replies, written', {agente: 'toca/c-marta', direccion: 'hoy'}],
      ['The notes for each viewing', {agente: 'visita/elena'}],
      ['The report for the owner', {agente: 'regla/r-informes', direccion: 'oficina-que-hace'}]]],
    ['I learn', [
      ['When you correct me', {agente: 'aprendido', direccion: 'oficina/aprende'}],
      ['From what you always do the same', {agente: 'regla/r-valoraciones', direccion: 'regla-oficina/dossier'}],
      ['From what you tell me', {agente: 'dictar/orden', direccion: 'dictar/libre'}]]]
  ];

  VETA.pantalla('A19', {
    titulo: 'How Veta works',
    sub: 'What I do with your work chats.',
    pinta: () => grupos().map(([rotulo, filas], k) => {
      const l = filas.map(([nombre, r, dato]) => ({nombre, dato, ir: destino(r)})).filter(f => abre(f.ir));
      return l.length ? VETA.r7.lista(l, {rotulo, i: k}) : '';
    }).join('')
  });
})();
