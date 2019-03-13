const { io } = require('../server');
const { Usuario } = require('../classes/usuario');
const usuarios = new Usuario();
const { crearMensaje } = require('../utils/utilidades')


// establecer conexion con los clientes
io.on('connection', (client) => {

    console.log('Usuario conectado');


    client.on('entrarChat',(data , callback )=>{
        
        
        if( ! data.nombre || !data.sala ){
            return callback({
                error: true,
                mensaje: 'El nombre y la sala son necesarios'
            });
        }
        
        client.join( data.sala );
        

        // cuandos se agrega una persona retorna un arreglo con todo
        usuarios.agregarPersona( client.id , data.nombre , data.sala);
        
        // cuando un usuario se agrega emitimos a todos los que estan conectados
        client.broadcast.to(data.sala).emit('listaPersona',usuarios.getPersonaPorSala(data.sala))
        
        callback( usuarios.getPersonaPorSala( data.sala ) );

    });

    client.on('crearMensaje', (data)=>{

        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje (persona.nombre,data.mensaje);
        client.broadcast.to(data.sala).emit( 'crearMensaje' , mensaje );
    })



    client.on('disconnect', ()=>{
        let personaBorrada = usuarios.borrarPersona(client.id);

        // la funcion crear mensaje está definida en utlidades
        client.broadcast.to(personaBorrada.sala).emit( 'crearMensaje' , crearMensaje('Administrador',personaBorrada.nombre+" salió"));
        client.broadcast.to(personaBorrada.sala).emit('listaPersona',usuarios.getPersonaPorSala(personaBorrada.sala))
    })


    //mensaje privado

    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit( 'mensajePrivado' , crearMensaje(persona.nombre,data.mensaje) );
    })

});