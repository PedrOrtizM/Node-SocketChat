const { io } = require('../server');
const { User } = require('../classes/user');
const users = new User();

// establecer conexion con los clientes
io.on('connection', (client) => {

    client.on('initSocket', ( person, callback) => {
    

        if (!person.email || !person.room) {
            return callback({
                error: true,
                mensaje: 'El email y la sala son necesarios'
            });
        }

        client.join(person.room);


        // cuandos se agrega una persona retorna un arreglo con todo
        users.addPerson(client.id, person);

        // cuando un usuario se agrega emitimos a todos los que estan conectados
        client.broadcast.to(person.room).emit('usersOnline', users.getPersonsByRoom(person.room))

        // Cuando se une 
        let messageAdmin = { 
            admin: true,
            message: person.nombre + ' Se unió al chat',
            room: person.room
        }
        client.broadcast.to(person.room).emit('message',messageAdmin);

        callback(users.getPersonsByRoom(person.room));

    });

    client.on('message', (request, callback) => {
        let person = users.getPerson(client.id, request.room);
        let message = {
           person,
           ...request 
        }

        client.broadcast.to(person.room).emit('message', message);
        // -- LOG
        console.log('------------ | NEW MESSAGE  | ----------------');
        console.log('SALA     ' + request.room);
        console.log('PERSONA: ', person);
        console.log('MENSAJE', message);
        console.log('---------------------------------------------');
        // --
        return callback(message);
    })




    client.on('disconnect', () => {
        
        
        let rooms = users.getRoomsOfPerson(client.id);
        console.log('salas antes');
        rooms.forEach(element => {
            console.log(users.getPersonsByRoom(element));
        });

        let personDeleted = users.deletePerson(client.id);

        console.log('------------ | ON disconnet  | ----------------');
        console.log('SALAS    ', rooms);
        console.log('PERSONA  ', personDeleted);
        console.log('------------------------------------------------');

        if (personDeleted) {
            rooms.forEach(room => {
                let messageAdmin = { 
                    admin: true,
                    message: personDeleted.nombre + ' Salió del Chat',
                    room
                }
                console.log('***salas despues**********');
                console.log(    users.getPersonsByRoom(room));
                console.log('*************');

                client.broadcast.to(room).emit('message', messageAdmin);
                client.broadcast.to(room).emit('usersOnline', users.getPersonsByRoom(room))
            });
        }
    })


    //mensaje privado

    client.on('privateMessage', (request, callback) => {
        let person = users.getPersonById(client.id);
        console.log('persona encontrada',person);
        
        let message = {
            person,
            ...request 
         }

        client.broadcast.to(request.to).emit('privateMessage', message);
        return callback(message);
    })

});
