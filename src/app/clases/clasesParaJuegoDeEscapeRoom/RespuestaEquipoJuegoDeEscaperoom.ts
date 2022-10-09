export class RespuestaEquipoJuegoDeEscaperoom {
    id: number;
    Respuesta: string[]; //puede ser un vector de string si la pregunta es de tipo "Emparejamiento" o un string en cualquier otro caso
    equipoJuegoDeEscaperoomId: number;
    preguntaId: number;
    constructor(equipoJuegoDeEscaperoomId?: number, preguntaId?: number, Respuesta?: string[]) {
  
      this.equipoJuegoDeEscaperoomId = equipoJuegoDeEscaperoomId;
      this.preguntaId = preguntaId;
      this.Respuesta = Respuesta;
    }
  }
  