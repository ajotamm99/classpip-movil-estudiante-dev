export class EscenaActiva {

    id: number;
    orden: number;
    escenarioEscaperoomId: number;
    escenaEscaperoomId: number;
    juegoDeEscaperoomId: number;
    TiempoLimite: number;
    TipoRequisito: string;
    RequisitoPuntos: number;
  
    constructor(escenarioEscaperoomId?: number, escenaEscaperoomId?: number, orden?: number, tiempoLimite?:number, tipoRequisito?:string, requisitoPuntos?:number, juegoDeEscaperoomId?: number) {
  
      this.escenarioEscaperoomId = escenarioEscaperoomId 
      this.escenaEscaperoomId = escenaEscaperoomId;
      this.juegoDeEscaperoomId= juegoDeEscaperoomId;
      this.orden=orden;
      this.TiempoLimite=tiempoLimite;
      this.TipoRequisito = tipoRequisito;
      this.RequisitoPuntos =requisitoPuntos;
    }
  }