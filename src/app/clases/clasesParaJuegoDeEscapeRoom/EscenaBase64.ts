export class EscenaBase64{
    Nombre: string;
    Imagen64: string;
    Archivo64: string;
  
    constructor( Nombre?: string, Imagen64?: string, Archivo64?:string) {
  
      this.Nombre = Nombre;
      this.Imagen64 = Imagen64;
      this.Archivo64 = Archivo64;
    }
  }