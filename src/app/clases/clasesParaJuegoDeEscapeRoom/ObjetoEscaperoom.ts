export class ObjetoEscaperoom {

    Nombre: string;
    Imagen: string;
    id: number;
    profesorId: number;    
    Publica: boolean;
  
    constructor( Nombre?: string, Imagen?: string, profesorId?: number,) {
  
      this.Nombre = Nombre;
      this.profesorId = profesorId;
      this.Imagen = Imagen;
      this.Publica=false;
    }
  }