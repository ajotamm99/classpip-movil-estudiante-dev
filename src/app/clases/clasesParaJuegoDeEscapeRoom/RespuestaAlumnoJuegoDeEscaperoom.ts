export class RespuestaAlumnoJuegoDeEscaperoom {
    id: number;
    Respuesta: string[]; //puede ser un vector de string si la pregunta es de tipo "Emparejamiento" o un string en cualquier otro caso
    alumnoJuegoDeEscaperoomId: number;
    preguntaId: number;
    constructor(alumnoJuegoDeEscaperoomId?: number, preguntaId?: number, Respuesta?: string[]) {
  
      this.alumnoJuegoDeEscaperoomId = alumnoJuegoDeEscaperoomId;
      this.preguntaId = preguntaId;
      this.Respuesta = Respuesta;
    }
  }
  
  