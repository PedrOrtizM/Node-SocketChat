class Usuario{
   
    constructor(){
        this.personas = []
    }


    agregarPersona(id, nombre, sala){

        if(!this.getPersonaByEmail(nombre)){

            let persona = { id:[id] , nombre , sala }
            this.personas.push(persona);
          
            console.log(' nuevo client id', nombre)
            return this.personas;

        }else{
            let oldPerson = this.getPersonaByEmail(nombre)
            
            oldPerson.id.push(id)
            console.log('Asociando nuevo client id   ', nombre)
            console.log('Asociando nuevo client id   ', nombre)
            

        }

        
  

    }

    getPersona(id){
        // la funcion filter regresa un arreglo

        for (let i = 0; i < this.personas.length; i++) {
            
             for (let j = 0; j < this.personas[i].id.length; j++) {

                if(this.personas[i].id[j] === id ){

                    return this.personas[i];
                }   
             }   
        }
        return null;
    }

    getPersonaByEmail(email){
        let persona = this.personas.filter( persona =>{
            return persona.nombre === email

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