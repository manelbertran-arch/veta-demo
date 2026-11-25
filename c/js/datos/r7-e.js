/* Veta demo · ronda 7 · js/datos/r7-e.js · agente E · «Enséñale a Veta» (#/dictar/<guion>)
   VETA.datos.r7e: lo que se puede enseñar (lecciones), con qué palabras lo enseña cada papel y los guiones de un solo paso.
   Los casos de «Pruébalo» salen de clientes y fechas que ya están en la app (datos/veta.js, r6-veta.js);
   los mensajes que «habría dejado escritos» y los casos de dirección están inventados para la demo (ver ESTADO_R7_E.md). */
(function () {
  'use strict';
  const D = VETA.datos;

  D.r7e = {
    // paso 1, según quién entra
    agente: {frase: 'Cuéntame algo que haces siempre. Aprendo a hacerlo yo.', ejemplos: ['recordatorios', 'visitas', 'valoraciones'],
      escribe: 'Por ejemplo: cuando alguien me pida las llaves, recuérdame apuntarlo', chats: 'tus chats', veta: 'veta'},
    direccion: {frase: 'Dime cómo trabaja tu oficina y lo hago así para todos.', ejemplos: ['contactos', 'acta-dia', 'informe-piso'],
      escribe: 'Por ejemplo: cuando un cliente se queje, que se le llame ese mismo día', chats: 'los chats de la oficina', veta: 'oficina'},

    // si se llega desde un caso (la pantalla de antes), qué lección sale la primera
    deCaso: {mensaje: 'recordatorios', visita: 'visitas', acta: 'visitas', informe: 'valoraciones'},

    // «Hasta dónde llego»: empieza en «Te lo dejo escrito». Enviar sola, todavía no.
    hasta: [
      {id: 'escrito', texto: 'Te lo dejo escrito', sub: 'Lo dejo listo. Tú lo envías.', get fila() { return 'Te lo dejo escrito. ' + VETA.PROMESA.nada; }},   // la promesa, por su nombre (una sola redacción)
      {id: 'aviso', texto: 'Solo te aviso', sub: 'Te digo que toca. Lo haces tú.', fila: 'Solo te aviso. Lo haces tú.'}],
    hastaOficina: [
      {id: 'escrito', texto: 'Lo dejo escrito', sub: 'Lo dejo listo a quien le toque. Lo envía esa persona.', fila: 'Lo dejo escrito. Lo envía cada persona.'},
      {id: 'aviso', texto: 'Solo aviso', sub: 'Aviso a quien le toque. Lo hace esa persona.', fila: 'Solo aviso. Lo hace cada persona.'}],
    hastaCerrado: 'Enviarlo yo sola, todavía no. Nada sale sin una persona.',

    // lo que no está en ninguna lección (lo ha escrito la persona con sus palabras)
    tuya: {
      agente: {cuando: 'Cada vez que pase', quien: 'Con todos tus clientes', opc: {quien: ['Con todos tus clientes', 'Solo con compradores', 'Solo con propietarios']}},
      direccion: {cuando: 'Cada vez que pase', quien: 'Con todo el equipo', opc: {}},
      sinCaso: 'Aún no he visto un caso así. La primera vez que pase te lo enseño y me dices si es eso.'
    },

    lecciones: {
      // ---- agente ----
      recordatorios: {papel: 'agente', corto: 'Recordatorios', regla: 'r-recordatorios', claves: ['contest', 'recordat', 'tres d'],
        dices: 'Cuando un comprador no me conteste en tres días, prepárame un recordatorio.',
        que: 'Un recordatorio para el comprador', cuando: 'Cuando lleva tres días sin contestar', quien: 'Con tus compradores',
        opc: {cuando: ['Cuando lleva tres días sin contestar', 'Cuando lleva cinco días sin contestar', 'Cuando lleva una semana sin contestar'],
          quien: ['Con tus compradores', 'Con todos tus clientes']},
        veces: 6, casos: [
          {cara: 'marta', nombre: 'Marta Puig', dia: 'el 9 de noviembre', paso: 'Le escribiste por el piso de Gràcia y no contestó.',
            hice: 'Hola, Marta. ¿Has podido pensar lo del piso de Gràcia? Si quieres, lo vemos esta semana.', toca: 'Toca recordarle a Marta el piso de Gràcia.'},
          {cara: 'toni', nombre: 'Toni Ribas', dia: 'el 30 de octubre', paso: 'Le preguntaste si quería volver a ver el piso y no contestó.',
            hice: 'Hola, Toni. ¿Quieres que busquemos otro día para volver a ver el piso?', toca: 'Toca preguntarle a Toni si quiere volver al piso.'}]},
      visitas: {papel: 'agente', corto: 'Confirmar las visitas', regla: 'r-visitas', claves: ['visita', 'confirm'],
        dices: 'El día antes de cada visita, confírmala con el cliente.',
        que: 'Un mensaje para confirmar la visita', cuando: 'El día antes de cada visita', quien: 'Con quien viene a la visita',
        opc: {cuando: ['El día antes de cada visita', 'La mañana de la visita']},
        veces: 9, casos: [
          {cara: 'elena', nombre: 'Elena Vives', dia: 'el viernes 20 de noviembre', paso: 'Tenía visita el sábado a las 11:00. La confirmaste tú a mano.',
            hice: 'Hola, Elena. ¿Te sigue yendo bien mañana a las 11:00 en el portal?', toca: 'Toca confirmar con Elena la visita de mañana.'},
          {cara: 'marta', nombre: 'Marta Puig', dia: 'el 13 de noviembre', paso: 'Tenía visita al día siguiente. La confirmaste tú a mano.',
            hice: 'Hola, Marta. ¿Nos vemos mañana en el piso, como quedamos?', toca: 'Toca confirmar con Marta la visita de mañana.'}]},
      valoraciones: {papel: 'agente', corto: 'Informe al valorar', regla: 'r-valoraciones', claves: ['valoraci', 'informe'],
        dices: 'Cuando alguien pida una valoración, prepárame el informe del piso.',
        que: 'El informe del piso', cuando: 'Cuando alguien pide una valoración', quien: 'Con tus propietarios',
        opc: {quien: ['Con tus propietarios', 'Con todos tus clientes']},
        veces: 11, casos: [
          {cara: 'rosa', nombre: 'Rosa Vidal', dia: 'el 13 de noviembre', paso: 'Te pidió una valoración. Le enviaste el informe al día siguiente.',
            hice: 'El informe de su piso, con los pisos parecidos de su zona, listo para que lo envíes.', toca: 'Toca preparar el informe del piso de Rosa.'},
          {cara: 'casals', nombre: 'Família Casals', dia: 'el 5 de noviembre', paso: 'Pidieron una valoración. Les enviaste el informe al día siguiente.',
            hice: 'El informe de su piso, con los pisos parecidos de su zona, listo para que lo envíes.', toca: 'Toca preparar el informe del piso de los Casals.'}]},

      // ---- dirección (toda la oficina) ----
      contactos: {papel: 'direccion', corto: 'Contactos nuevos', claves: ['contacto', 'dos horas', 'nuevo'],
        dices: 'Cuando entre un contacto nuevo, que se le conteste en menos de dos horas.',
        que: 'La primera respuesta para quien le toque', cuando: 'Cuando entra un contacto nuevo', quien: 'Con todo el equipo',
        opc: {cuando: ['Cuando entra un contacto nuevo', 'Cuando lleva una hora sin respuesta']},
        veces: 23, casos: [
          {icono: 'clientes', nombre: 'Un contacto nuevo', dia: 'el martes 17 de noviembre', paso: 'Escribió a las 10:05. Nadie le contestó hasta las 16:40.',
            hice: 'Hola, gracias por escribirnos. ¿Te va bien que te llamemos hoy a las 12:00?', toca: 'Hay un contacto nuevo sin contestar.'}]},
      'acta-dia': {papel: 'direccion', corto: 'El acta, el mismo día', claves: ['acta', 'visita'],
        dices: 'Después de cada visita, que el acta salga ese mismo día.',
        que: 'El acta para quien hizo la visita', cuando: 'Cuando alguien dice que ha salido de una visita', quien: 'Con todo el equipo',
        opc: {},
        veces: 14, casos: [
          {icono: 'cal', nombre: 'Una visita en Verdi 42', dia: 'el jueves 12 de noviembre', paso: 'La visita fue por la mañana. El acta se envió tres días después.',
            hice: 'Al salir, le habría pedido que me la contara y le habría dejado el acta lista para enviar.', toca: 'Falta el acta de la visita de Verdi 42.'}]},
      'informe-piso': {papel: 'direccion', corto: 'El informe del piso', claves: ['valoraci', 'informe'],
        dices: 'Cuando pidan una valoración, que el informe del piso salga al día siguiente.',
        que: 'El informe del piso para quien lleva al cliente', cuando: 'Cuando alguien pide una valoración', quien: 'Con todo el equipo',
        opc: {},
        veces: 14, casos: [
          {icono: 'doc', nombre: 'Una valoración en Gràcia', dia: 'el 5 de noviembre', paso: 'La pidieron un jueves. El informe salió el martes siguiente.',
            hice: 'El informe del piso, con los pisos parecidos de la zona, listo el viernes por la mañana.', toca: 'Hay una valoración pedida sin informe.'}]}
    },

    // guiones de un solo paso: se cuenta una cosa y se abre lo que sale (no enseñan nada a Veta)
    dictados: {
      acta: {titulo: '¿Cómo ha ido?', frase: 'Cuéntame la visita como a un compañero. Yo te escribo el acta.', toca: 'Toca y dímelo'},
      tarea: {titulo: 'Dime qué te apunto', frase: 'Dímelo y lo pongo en tu lista, con su día.', toca: 'Toca y dímelo'},
      nota: {titulo: 'Dime qué apunto', frase: 'Dímelo y lo guardo en la ficha del cliente.', toca: 'Toca y dímelo'},
      pregunta: {titulo: 'Pregúntame', frase: 'Pregunta lo que quieras de un cliente. Lo busco en tus chats.', toca: 'Toca y pregunta'},
      aviso: {titulo: 'Dime de qué te aviso', frase: 'Dímelo y te aviso cuando pase.', toca: 'Toca y dímelo'},
      operacion: {titulo: 'Pregúntame', frase: 'Pregunta por una operación. Lo busco en los chats de la oficina.', toca: 'Toca y pregunta'},
      queja: {titulo: 'Dime qué ha pasado', frase: 'Cuéntame la queja y la apunto en la ficha del cliente.', toca: 'Toca y dímelo'},
      mejorar: {titulo: 'Pregúntame', frase: 'Pregunta qué se puede mejorar. Miro lo de esta semana.', toca: 'Toca y pregunta'}
    }
  };
})();
