class User {

    constructor() {
        this.persons = new Map();
    }


    addPerson(id, dataPerson) {

        let person = { id, ...dataPerson }

        if (this.persons.get(dataPerson.room)) {
            this.persons.get(dataPerson.room).push(person);
        } else {
            this.persons.set(dataPerson.room, [person]);
        }

        // -- LOG
        console.log('------------ | NEW PERSON  | ----------------');
        console.log('SALA: ' + dataPerson.room);
        console.log('PERSONAS: ');
        console.log(this.persons.get(dataPerson.room));
        console.log('---------------------------------------------');
        // ---

        return this.persons;
    }

    getPerson(id, room) {
        console.log('id',id);
        console.log('room',room);
        
        for (let i = 0; i < this.persons.get(room).length; i++) {
            if (this.persons.get(room)[i].id === id) {
                return this.persons.get(room)[i];
            }
        }
        return null;
    }

    getPersonById(id) {
        let myPerson;
        for (let value of this.persons.values()) {
            
            value.forEach(person => {

                if (id === person.id) {
                    myPerson = person;
                    return;
                }
            })
            if (myPerson) return myPerson;

        }
        return null;

    }


    getPersonsByRoom(room) {
        return this.persons.get(room);
    }

    deletePerson(id) {
        let personDeleted;
        this.persons.forEach((value, key) => {

            for (let i = 0; i < value.length; i++) {

                if (value[i].id === id) {
                    personDeleted = value[i];
                    this.persons.get(key).splice(i,1);
                }
            }
        });
        return personDeleted;
    }

    getRoomsOfPerson(id) {
        let rooms = [];
        this.persons.forEach((value, key) => {
            for (let i = 0; i < value.length; i++) {
                if (value[i].id === id) {
                    rooms.push(key);
                }
            }
        });
        return rooms;
    }

}




module.exports = {
    User
}