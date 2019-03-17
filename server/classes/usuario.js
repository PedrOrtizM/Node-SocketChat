class Usuario{
   
    constructor(){
        this.personas = []
    }


    agregarPersona(id, nombre, sala){

        let persona = { id , nombre , sala }
        this.personas.push(persona);
        return this.personas;

    }

    getPersona(id){
        // la funcion filter regresa un arreglo
        let persona = this.personas.filter( persona =>{
            return persona.id === id

        })[0];
        return persona;
    }
    getPersonas(){
        return this.personas;
    }

    getPersonaPorSala ( sala ){
        
        let personasEnSala = this.personas.filter(persona=>{
            return persona.sala === sala
        });
        return personasEnSala;
    }

    borrarPersona( id ){
        // reemplaza el arreglo actual por todas las personas excepto la del id

        let personaBorrada = this.getPersona(id);
        this.personas = this.personas.filter( persona =>{
            return persona.id != id 
        })
        return personaBorrada;
    }

}




module.exports = {
    Usuario
}