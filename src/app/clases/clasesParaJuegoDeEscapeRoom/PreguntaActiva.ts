export class PreguntaActiva {
    preguntaId: number;
    juegoDeEscaperoomId:number;
    objetoActivoId: number;
    id: number;
    PuntosSumar: number;
    PuntosRestar: number;

  constructor(juegoDeEscaperoomId?: number, preguntaId?: number, objetoActivoId?: number, PuntosSumar?:number, PuntosRestar?:number) {

    this.preguntaId = preguntaId;
    this.objetoActivoId = objetoActivoId;
    this.PuntosRestar=PuntosRestar;
    this.PuntosSumar=PuntosSumar;
    this.juegoDeEscaperoomId=juegoDeEscaperoomId;
  }
}
