export class EscenaEscaperoom {

    Archivo: string;
    id: number;
    Tilesheet: string;
    View: string;
    Nombre: string;
    escenarioEscapeRoomId: number    
    Publica: boolean;
    Lugares: string[];

    constructor( Archivo?: string, Tilesheet?: string, Nombre?: string, escenarioEscapeRoomId?: number,lugares?:string[],view?:string) {
      this.Archivo = Archivo;      
      this.escenarioEscapeRoomId= escenarioEscapeRoomId;
      this.Tilesheet=Tilesheet;
      this.Nombre= Nombre;
      this.Publica=false;
      this.Lugares=lugares;
      this.View=view;
    }
  }