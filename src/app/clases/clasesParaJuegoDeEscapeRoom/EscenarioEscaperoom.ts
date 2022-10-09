export class EscenarioEscaperoom {

    id: number;
    profesorId: number;
    Nombre: string;
    Descripcion: string;    
    Publica: boolean;
  
    constructor(profesorId?: number, Nombre?: string, Descripcion?: string) {
  
      this.Descripcion = Descripcion;
      this.profesorId = profesorId;
      this.Nombre = Nombre;
      this.Publica = false;
  
    }

    public setPublica(publics:boolean){
      this.Publica=publics;
    }
  }