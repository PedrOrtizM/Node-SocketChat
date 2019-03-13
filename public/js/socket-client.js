var socket = io();

// obtener los parametros que vienen el la URL
var params = new URLSearchParams(window.location.search);

//  si no viene el parametro nombre , lanza error
if( ! params.has('nombre') || !params.has('sala') ){
//  si  no viene el nombre regresa al index.html 
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesario');
}


var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

// establecer conexion con el server
socket.on('connect', function() {
    
    // si el server acepta ejecuta el callback
    socket.emit('entrarChat',usuario,function ( resp ){
        console.log('usuarios conectado',resp);
        
    })

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('crearMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });


// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});


// Escuchar cuandom un usuario entra o sale del chat
socket.on('listaPersona', function(persona) {

    console.log(persona);

});


socket.on('mensajePrivado', function (mensaje) {
    
    console.log('Mensaje privado ',mensaje);
    
})