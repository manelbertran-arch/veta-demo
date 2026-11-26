/* Veta demo · datos · base.js
   Todo es inventado (PLAN_DEMO.md, sección 6). Fecha fija, equipo, oficinas y pisos.
   Los paquetes no tocan este archivo: lo que les falte va en su datos/extra-<letra>.js y en su ESTADO. */
(function () {
  'use strict';
  const D = VETA.datos;

  // 6.1 · hoy es el día de la demo
  D.fecha = {
    hoyISO: '2026-11-23', hoyTexto: 'Monday 23 November', hoyCorto: 'Mon 23', ayerTexto: 'Sunday 22',
    semanaCerrada: '16 to 22 November', semanaAnterior: '9 to 15 November', inicioPiloto: '3 October'
  };

  // 6.2 · el equipo: 6 personas, 2 oficinas
  D.oficinas = {gracia: {id: 'gracia', nombre: 'Gràcia'}, santgervasi: {id: 'santgervasi', nombre: 'Sant Gervasi'}};
  D.personas = {
    laura: {id: 'laura', nombre: 'Laura Martí', corto: 'Laura', papel: 'agente', papelTexto: 'agent', oficina: 'gracia', foto: 'laura'},
    montse: {id: 'montse', nombre: 'Montse Ribas', corto: 'Montse', papel: 'direccion', papelTexto: 'management', oficina: 'santgervasi', foto: null, nota: 'Management; also sells'},
    anna: {id: 'anna', nombre: 'Anna Costa', corto: 'Anna', papel: 'agente', papelTexto: 'agent', oficina: 'gracia', foto: null},
    teresa: {id: 'teresa', nombre: 'Teresa Gil', corto: 'Teresa', papel: 'agente', papelTexto: 'agent', oficina: 'gracia', foto: null, baja: 'On leave since Monday 16'},
    marc: {id: 'marc', nombre: 'Marc Vidal', corto: 'Marc', papel: 'agente', papelTexto: 'agent', oficina: 'santgervasi', foto: null},
    david: {id: 'david', nombre: 'David Mas', corto: 'David', papel: 'agente', papelTexto: 'agent', oficina: 'santgervasi', foto: null}
  };
  // primer destino de cada papel
  D.papeles = {agente: {destinos: ['hoy', 'clientes', 'veta'], entrada: 'hoy'}, direccion: {destinos: ['hoy', 'clientes', 'equipo', 'veta'], entrada: 'equipo'}};

  // 6.3 · pasos de una operación
  D.pasos = {venta: ['Mandate', 'Listing', 'Viewings', 'Deposit', 'Notary'], compra: ['Contact', 'Viewings', 'Offer', 'Deposit', 'Notary']};

  // 6.7 · pisos y fotos (assets/pisos/<foto>.webp)
  D.pisos = {
    verdi: {id: 'verdi', nombre: 'Verdi 42, 3.º 2.ª', zona: 'Gràcia', corto: 'Gràcia flat · c/ Verdi 42, 3.º 2.ª', datos: '3 bedrooms · terrace · renovated kitchen · no lift', precio: 395000, de: 'pere', fotos: ['gracia', 'gracia_balcon']},
    santantoni: {id: 'santantoni', nombre: 'Sant Antoni', zona: 'Sant Antoni', corto: 'Sant Antoni · 2 bedrooms · balcony · €289,000', datos: '2 bedrooms · balcony', precio: 289000, entro: 'ayer', nota: 'Joined the office portfolio yesterday; Anna brought it in', fotos: ['poblenou']},
    olzinelles: {id: 'olzinelles', nombre: 'Olzinelles, Sants', zona: 'Sants', corto: 'Sants flat · c/ Olzinelles', datos: '', fotos: ['sants']},
    atico: {id: 'atico', nombre: 'Sant Gervasi penthouse', zona: 'Sant Gervasi', corto: 'Sant Gervasi penthouse', datos: '', precio: 545000, de: 'ruben', fotos: ['santgervasi']},
    local: {id: 'local', nombre: 'Eixample commercial premises', zona: 'Eixample', corto: 'Eixample commercial premises · for rent', datos: 'For rent', fotos: ['local']},
    santcugat: {id: 'santcugat', nombre: 'Sant Cugat house', zona: 'Sant Cugat', corto: 'Sant Cugat house', datos: '', de: 'joan-serra', fotos: ['santcugat']}
  };
})();
