const { io } = require('../server');
const { Usuario } = require('../classes/usuario');
const { crearMensaje } = require('../utils/utilidades')

const usuarios = new Usuario();

// establecer conexion con los clientes
io.on('connection', (client) => {

    console.log('Usuario conectado');


    client.on('iniciarChat',(data , callback )=>{
        
        console.log(data.sala,data.nombre);
        
        
        if( ! data.nombre || !data.sala ){
            return callback({
                error: true,
                mensaje: 'El nombre y la sala son necesarios'
            });
        }
        
    
        client.join( data.sala );
    
    
        // cuandos se agrega una persona retorna un arreglo con todo
        usuarios.agregarPersona( client.id , data.nombre , data.sala);
        console.log(usuarios.getPersonaByEmail(data.nombre));
        
        // cuando un usuario se agrega emitimos a todos los que estan conectados
        client.broadcast.to(data.sala).emit('Conectados',usuarios.getPersonaPorSala(data.sala))
        
        // Cuando se une 
        client.broadcast.to(data.sala).emit( 'Mensaje' , crearMensaje('Administrador',data.nombre+" se unió"));

        callback( usuarios.getPersonaPorSala( data.sala ) );

    });

    client.on('Mensaje', (data,callback)=>{
        console.log(client.id);
        console.log(data,"aaaaa");
        
        let persona = usuarios.getPersona(client.id);
        console.log(persona,"personaa");
        
        let mensaje = crearMensaje (persona.nombre,data.mensaje);
        client.broadcast.to(persona.sala).emit( 'Mensaje' , mensaje );
        return callback(mensaje);
    })




    client.on('disconnect', ()=>{
        let personaBorrada = usuarios.borrarPersona(client.id);
        console.log(personaBorrada,"desconectada");
        
        // la funcion crear mensaje está definida en utlidades
        if(personaBorrada){
            client.broadcast.to(personaBorrada.sala).emit( 'Mensaje' , crearMensaje('Administrador',personaBorrada.nombre+" salió"));
            client.broadcast.to(personaBorrada.sala).emit('Conectados',usuarios.getPersonaPorSala(personaBorrada.sala))
        }
    })


    //mensaje privado

    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit( 'mensajePrivado' , crearMensaje(persona.nombre,data.mensaje) );
    })

});