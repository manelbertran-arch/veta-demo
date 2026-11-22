/* Veta demo · datos · clientes.js
   6.3 · los 18 clientes de Laura (8 con ficha completa, 10 con ficha corta) y Sergi Mas, contacto nuevo que no es
   de su cartera (cartera: false; no cuenta en los 18). Además, los clientes de Montse y los de la oficina (6.6).
   Estados: te-toca · oportunidad · parado · esperando · al-dia · cerrado. La foto es assets/perfiles/<foto>.webp.
   VETA.datos.chats: lo que enseña H01 “De dónde sale” (mensajes literales; tu: true = lo escribió quien usa la app). */
(function () {
  'use strict';
  const D = VETA.datos;
  const c = (id, o) => Object.assign({id, lleva: 'laura', cartera: true, historia: [], documentos: []}, o);

  D.clientes = {
    // ---- Laura · ficha completa ----
    marta: c('marta', {nombre: 'Marta Puig', corto: 'Marta', tel: '634 90 56 21', foto: 'marta', quienEs: 'Buyer; looking for 3 bedrooms in Gràcia', estado: 'te-toca',
      operacion: {tipo: 'compra', fase: 1, texto: 'Purchase · Contact · step 1 of 5'}, siguiente: {texto: 'Reply to Marta', cosa: 'c-marta'},
      encajan: {titulo: 'Flats that fit her · 1', pisos: ['verdi']},
      historia: [{cuando: 'Yesterday, 18:42', tipo: 'Message', texto: 'Wants to see the Gràcia flat'}], chat: 'marta'}),
    elena: c('elena', {nombre: 'Elena Vives', corto: 'Elena', tel: '655 21 70 34', foto: 'elena', quienEs: 'Buyer; looking for 2 bright bedrooms', estado: 'te-toca',
      operacion: {tipo: 'compra', fase: 2, texto: 'Purchase · Viewings · step 2 of 5'}, siguiente: {texto: 'Viewing today at 9:00 at Verdi 42', boton: {texto: 'Tell me how it went', ir: 'visita/elena'}, cosa: 'c-elena'},
      documentos: [{texto: 'Payslip, for the bank', estado: 'falta', fecha: 'Wed 25'}],
      historia: [{cuando: 'Mon 16', tipo: 'Message', texto: '“I\'ll send you the payslip on Wednesday”'}, {cuando: '28 Oct', tipo: 'Message', texto: '“I\'m swamped this week, I\'ll get back to you.”'}], chat: 'elena'}),
    pere: c('pere', {nombre: 'Pere Soler', corto: 'Pere', tel: '612 48 39 07', foto: 'pere', quienEs: 'Owner of the Verdi 42 flat', estado: 'te-toca', piso: 'verdi',
      operacion: {tipo: 'venta', fase: 3, texto: 'Sale · Viewings · step 3 of 5'}, siguiente: {texto: 'Send him the weekly report.', boton: {texto: 'See the report for Pere', ir: 'informe/pere'}, cosa: 'c-pere'},
      encajan: {titulo: 'Matching buyers · 2', clientes: ['marta', 'toni']},
      documentos: [{texto: 'Energy certificate', estado: 'falta', fecha: 'Fri 27'}],
      historia: [{cuando: 'Sat 21, 21:10', tipo: 'Message', texto: '“If I need to, to close, I\'ll go down to €385,000, but no lower.”'}, {cuando: 'Mon 16', tipo: 'Report', texto: 'Weekly report sent'}], chat: 'pere'}),
    jordi: c('jordi', {nombre: 'Jordi Ferrer', corto: 'Jordi', tel: '609 77 14 52', foto: 'jordi', quienEs: 'Buyer; Sants flat, c/ Olzinelles', estado: 'te-toca', piso: 'olzinelles',
      operacion: {tipo: 'compra', fase: 2, texto: 'Purchase · Viewings · step 2 of 5'}, siguiente: {texto: 'Send him the flat report before Thursday', cosa: 'c-jordi'},
      documentos: [{texto: 'Land registry extract for Olzinelles', estado: 'falta', fecha: 'Mon 30', nota: 'Requested from the Registry'}],
      historia: [{cuando: 'Fri 20, 12:05', tipo: 'Message', texto: 'Asks for the flat report'}, {cuando: 'Fri 20, 12:20', tipo: 'You', texto: '“Sure, I\'ll send it before Thursday.”'}], chat: 'jordi'}),
    nuria: c('nuria', {nombre: 'Núria Camps', corto: 'Núria', tel: '678 03 92 15', foto: 'nuria', quienEs: 'Buyer; looking in Sant Antoni, with a balcony', estado: 'oportunidad',
      operacion: {tipo: 'compra', fase: 1, texto: 'Purchase · Contact · step 1 of 5'}, siguiente: {texto: 'Tell her about the Sant Antoni flat', cosa: 'c-nuria'},
      encajan: {titulo: 'Flats that fit her · 1', pisos: ['santantoni']},
      historia: [{cuando: '3 Nov, 20:15', tipo: 'Message', texto: '“In the end Poble-sec doesn\'t convince us. If something comes up in Sant Antoni with a balcony, let me know, please.”'}], chat: 'nuria'}),
    albert: c('albert', {nombre: 'Albert Roca', corto: 'Albert', tel: '620 15 84 03', foto: 'albert', quienEs: 'Investor; looking for commercial units to rent out', estado: 'parado', estadoTexto: 'Stalled · 7 weeks without talking',
      operacion: {texto: 'No open deal'}, siguiente: {texto: 'Call him about the Eixample unit', boton: {texto: 'Call Albert', accion: 'llamar'}},
      antes: ['What he wants: a commercial unit in the centre, to rent out.', 'What was said: “If any unit comes up in the centre, let me know” (3 Oct).', 'What\'s missing: showing him the Eixample unit that came in on the 12th.'],
      historia: [{cuando: '3 Oct', tipo: 'Message', texto: '“If any unit comes up in the centre, let me know”'}], chat: 'albert'}),
    laia: c('laia', {nombre: 'Laia Casas', corto: 'Laia', tel: '646 37 29 18', foto: 'laia', quienEs: 'Buyer; flat in Poblenou', estado: 'al-dia',
      operacion: {tipo: 'compra', fase: 5, texto: 'Purchase · Notary · step 5 of 5'}, siguiente: {texto: 'Signing at the notary on Tuesday 1 December, 12:00.'},
      historia: [{cuando: 'Mon 9', tipo: 'Deposit', texto: 'Deposit contract signed'}]}),
    'carme-font': c('carme-font', {nombre: 'Carme Font', corto: 'Carme', tel: '699 02 41 76', foto: 'carme', quienEs: 'Sold in Horta in June', estado: 'cerrado',
      operacion: {tipo: 'venta', fase: 5, texto: 'Sale · closed'}, siguiente: {texto: 'Nothing pending', secundario: {texto: 'Prepare a message asking her for a referral'}},
      historia: [{cuando: 'June', tipo: 'Notary', texto: 'Sale signed in Horta'}]}),
    // ---- contacto nuevo, fuera de su cartera ----
    sergi: c('sergi', {nombre: 'Sergi Mas', corto: 'Sergi', foto: 'sergi', quienEs: 'New contact; asked about a rental in Les Corts', estado: null, cartera: false,
      siguiente: {texto: 'Anna Costa already replied', boton: {texto: 'Remove from Today'}, cosa: 'c-sergi'}, chat: 'sergi'}),
    // ---- Laura · ficha corta (Al día, iniciales) ----
    toni: c('toni', {nombre: 'Toni Ribas', estado: 'al-dia', quienEs: 'Viewed Verdi 42 on Thursday 19; will come back with his architect', historia: [{cuando: 'Thu 19', tipo: 'Viewing', texto: 'Viewed Verdi 42; will come back with his architect'}]}),
    casals: c('casals', {nombre: 'Casals family', estado: 'al-dia', quienEs: 'Viewed on Saturday 21; they like it, find it expensive', historia: [{cuando: 'Sat 21', tipo: 'Viewing', texto: 'They like it; find it expensive'}]}),
    'sergi-font': c('sergi-font', {nombre: 'Sergi Font', estado: 'al-dia', quienEs: 'Viewed on Tuesday 17; finds it expensive and without a lift', historia: [{cuando: 'Tue 17', tipo: 'Viewing', texto: 'Finds it expensive and without a lift'}]}),
    'anna-bosch': c('anna-bosch', {nombre: 'Anna Bosch', estado: 'al-dia', quienEs: 'Cancelled a viewing on Thursday 19', historia: [{cuando: 'Thu 19', tipo: 'Viewing', texto: 'Cancelled the viewing'}]}),
    'rosa-vidal': c('rosa-vidal', {nombre: 'Rosa Vidal', estado: 'al-dia', quienEs: 'Asked for a valuation on 13 November', historia: [{cuando: '13 Nov', tipo: 'Message', texto: 'Asks for a valuation'}]}),
    'pau-mir': c('pau-mir', {nombre: 'Pau Mir', estado: 'al-dia', quienEs: 'Asked for a valuation on 15 October', historia: [{cuando: '15 Oct', tipo: 'Message', texto: 'Asks for a valuation'}]}),
    'carme-roca': c('carme-roca', {nombre: 'Carme Roca', estado: 'al-dia', quienEs: 'Asked for a valuation on 8 October', historia: [{cuando: '8 Oct', tipo: 'Message', texto: 'Asks for a valuation'}]}),
    'lluis-pons': c('lluis-pons', {nombre: 'Lluís Pons', estado: 'al-dia', quienEs: 'Asked for a valuation on 30 September', historia: [{cuando: '30 Sep', tipo: 'Message', texto: 'Asks for a valuation'}]}),
    'joan-vila': c('joan-vila', {nombre: 'Joan Vila', estado: 'al-dia', quienEs: 'Asked for a valuation on 16 September', historia: [{cuando: '16 Sep', tipo: 'Message', texto: 'Asks for a valuation'}]}),
    'oriol-bas': c('oriol-bas', {nombre: 'Oriol Bas', estado: 'al-dia', quienEs: 'Nothing pending', historia: []}),

    // ---- Montse (6.6) ----
    ruben: c('ruben', {nombre: 'Rubén Gil', corto: 'Rubén', lleva: 'montse', quienEs: 'Seller of the Sant Gervasi penthouse', estado: 'te-toca', piso: 'atico', operacion: {tipo: 'venta', fase: 3, texto: 'Sale · Viewings · step 3 of 5'}, chat: 'ruben'}),
    guillem: c('guillem', {nombre: 'Guillem Roig', corto: 'Guillem', lleva: 'montse', quienEs: 'Buyer', estado: 'te-toca', chat: 'guillem'}),
    silvia: c('silvia', {nombre: 'Sílvia Prat', corto: 'Sílvia', lleva: 'montse', quienEs: 'Buyer; offered €520,000 for the penthouse', estado: 'te-toca',
      antes: ['Offered €520,000 for the penthouse.', 'The owner is asking €545,000.', 'On Friday she said she\'d think about it.']}),
    'merce-soler': c('merce-soler', {nombre: 'Mercè Soler', lleva: 'montse', estado: 'al-dia'}),
    'xavier-coll': c('xavier-coll', {nombre: 'Xavier Coll', lleva: 'montse', estado: 'al-dia'}),
    'imma-bonet': c('imma-bonet', {nombre: 'Imma Bonet', lleva: 'montse', estado: 'al-dia'}),
    'ferran-cots': c('ferran-cots', {nombre: 'Ferran Cots', lleva: 'montse', estado: 'al-dia'}),
    'gloria-mas': c('gloria-mas', {nombre: 'Glòria Mas', lleva: 'montse', estado: 'al-dia'}),
    'ignasi-puig': c('ignasi-puig', {nombre: 'Ignasi Puig', lleva: 'montse', estado: 'al-dia'}),

    // ---- la oficina: contactos sin dueño, sin responder y operaciones de otros (6.6) ----
    carmen: c('carmen', {nombre: 'Carmen López', corto: 'Carmen', lleva: null, cartera: false, quienEs: 'New contact; looking for 3 bedrooms in Gràcia, up to €450,000', estado: 'te-toca', chat: 'carmen',
      operacion: {tipo: 'compra', fase: 1, texto: 'Purchase · Contact · step 1 of 5'}, encajan: {titulo: 'Flats that fit her · 1', pisos: ['verdi']}}),
    'pau-rios': c('pau-rios', {nombre: 'Pau Ríos', lleva: null, cartera: false, quienEs: 'New contact; looking for a commercial unit in the Eixample to rent', chat: 'pau-rios'}),
    lucia: c('lucia', {nombre: 'Lucía Gómez', lleva: null, cartera: false, quienEs: 'New contact; wants to sell her parents\' flat in Sant Gervasi', chat: 'lucia'}),
    ramon: c('ramon', {nombre: 'Ramon Pujol', lleva: 'teresa', cartera: false, foto: 'ramon', quienEs: 'Teresa\'s client', chat: 'ramon'}),
    'dani-prats': c('dani-prats', {nombre: 'Dani Prats', lleva: 'teresa', cartera: false, quienEs: 'Buyer in Gràcia'}),
    'rosa-vila': c('rosa-vila', {nombre: 'Rosa Vila', lleva: 'teresa', cartera: false, quienEs: 'Seller in Gràcia'}),
    'joan-serra': c('joan-serra', {nombre: 'Joan Serra', corto: 'Joan', lleva: 'marc', cartera: false, foto: 'joan', quienEs: 'Owner of the Sant Cugat house', piso: 'santcugat', chat: 'joan-serra',
      operacion: {tipo: 'venta', fase: 3, texto: 'Sale · Offer · step 3 of 5'}}),
    claudia: c('claudia', {nombre: 'Clàudia Ribas', lleva: 'marc', cartera: false, quienEs: 'Buyer in Sants; the deal fell through on 12 Nov'})
  };

  // H01 · de dónde sale cada cosa
  D.chats = {
    marta: {titulo: 'WhatsApp chat with Marta Puig', mensajes: [{texto: 'Hi Laura. Is the Gràcia flat still available? We could see it this Saturday, morning preferably.', cuando: 'yesterday, 18:42'}]},
    elena: {titulo: 'From her chats', mensajes: [{texto: 'I\'m looking for two bedrooms, but above all light.', cuando: '12 Nov'}, {texto: 'Can you hear the street much?', cuando: '19 Nov'}]},
    'elena-nomina': {titulo: 'WhatsApp chat with Elena Vives', mensajes: [{texto: 'I\'ll send you the payslip on Wednesday', cuando: 'Mon 16, 19:02'}]},
    pere: {titulo: 'WhatsApp chat with Pere Soler', mensajes: [{texto: 'Laura, could you update me every Monday on how it\'s going? That way I won\'t call you so much.', cuando: '2 Oct, 19:20'}]},
    nuria: {titulo: 'WhatsApp chat with Núria Camps', mensajes: [{texto: 'In the end Poble-sec doesn\'t convince us. If something comes up in Sant Antoni with a balcony, let me know, please.', cuando: '3 Nov, 20:15'}]},
    jordi: {titulo: 'WhatsApp chat with Jordi Ferrer', mensajes: [{texto: 'Can you send me the flat report before Thursday? I want to show it to my sister', cuando: 'Fri 20, 12:05'}, {texto: 'Sure, I\'ll send it before Thursday.', cuando: 'Fri 20, 12:20', tu: true}]},
    sergi: {titulo: 'WhatsApp chat with Sergi Mas', mensajes: [{texto: 'Hi, does the Les Corts rental allow pets?', cuando: '9 Nov, 21:48'}]},
    albert: {titulo: 'WhatsApp chat with Albert Roca', mensajes: [{texto: 'If any unit comes up in the centre, let me know', cuando: '3 Oct'}]},
    carmen: {titulo: 'Office WhatsApp · Carmen López', mensajes: [{texto: 'Looking for a 3-bedroom flat in Gràcia, up to €450,000', cuando: 'yesterday, 19:10'}]},
    ruben: {titulo: 'WhatsApp chat with Rubén Gil', mensajes: [{texto: 'Has anyone come to see the penthouse this week?', cuando: 'yesterday, 20:15'}]},
    guillem: {titulo: 'WhatsApp chat with Guillem Roig', mensajes: [{texto: 'Can you confirm Wednesday\'s viewing?', cuando: 'today, 8:12'}]},
    'joan-serra': {titulo: 'WhatsApp chat with Joan Serra', mensajes: [{texto: 'Ten days without news about the flat. If nobody tells me anything, I\'m going to another agency.', cuando: 'Sat 21, 20:05'}]},
    'pau-rios': {titulo: 'Office WhatsApp · Pau Ríos', mensajes: [{texto: 'Do you have any commercial unit to rent in the Eixample?', cuando: 'Saturday 21, 13:20'}]},
    lucia: {titulo: 'Office WhatsApp · Lucía Gómez', mensajes: [{texto: 'I want to sell my parents\' flat in Sant Gervasi. How do you work?', cuando: 'today, 7:40'}]},
    ramon: {titulo: 'WhatsApp chat with Ramon Pujol', mensajes: [{texto: 'Is Thursday\'s viewing still on?', cuando: 'yesterday, 17:30'}]},
    'sin-nombre': {titulo: 'Office WhatsApp · unnamed number', mensajes: [{texto: 'Price of the Verdi flat?', cuando: 'today, 8:55'}]},
    claudia: {titulo: 'WhatsApp chat with Clàudia Ribas', mensajes: [{texto: 'Hi, I\'m interested in the flat on Olzinelles street. Can I see it?', cuando: '3 Nov, 18:20'}, {texto: 'I\'ve already found another flat, thanks.', cuando: '12 Nov, 10:02'}]}
  };
})();
