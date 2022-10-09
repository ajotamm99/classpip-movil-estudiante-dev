export class Skin {

    Nombre: string;
    id: number;
    profesorId: number;
    Spritesheet: string;    
    Publica: boolean;
  
    constructor( Spritesheet?: string, Nombre?: string, profesorId?: number) {
  
      this.Nombre = Nombre;
      this.profesorId = profesorId;
      this.Spritesheet = Spritesheet;
      this.Publica=false;
    }
  }