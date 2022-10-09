export class EquipoJuegoDeEscaperoom {

    PuntosTotalesEquipo: number;
    id: number;
    equipoId: number;
    juegoDeEscaperoomId: number;
    TiempoEnResolver: number;
    Resuelto: boolean;
    MaxObjetos: number;    
    ObjetosActivosEnMochila:number[];
  
    constructor(equipoId?: number, juegoDeEscaperoomId?: number, PuntosTotalesEquipo?: number, MaxObjetos?:number) {
  
      this.PuntosTotalesEquipo = PuntosTotalesEquipo;
      this.equipoId = equipoId;
      this.juegoDeEscaperoomId = juegoDeEscaperoomId;
      this.TiempoEnResolver = 0;
      this.Resuelto = false;
      this.MaxObjetos=MaxObjetos;      
      this.ObjetosActivosEnMochila=[];
    }
  }