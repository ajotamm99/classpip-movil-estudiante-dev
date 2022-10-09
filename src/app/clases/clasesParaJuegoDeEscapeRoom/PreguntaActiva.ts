export class PreguntaActiva {
    preguntaId: number;
    objetoActivoId: number;
    id: number;
    PuntosSumar: number;
    PuntosRestar: number;

  constructor(preguntaId?: number, objetoActivoId?: number, PuntosSumar?:number, PuntosRestar?:number) {

    this.preguntaId = preguntaId;
    this.objetoActivoId = objetoActivoId;
    this.PuntosRestar=PuntosRestar;
    this.PuntosSumar=PuntosSumar;
  }
}
