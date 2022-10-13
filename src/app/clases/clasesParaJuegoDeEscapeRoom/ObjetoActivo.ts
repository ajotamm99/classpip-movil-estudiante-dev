export class ObjetoActivo {

    id: number;
    objetoEscaperoomId: number;
    juegoDeEscaperoomId: number;
    alumnoJuegoDeEscaperoomId: number;
    equipoJuegoDeEscaperoomId: number;
    escenaActivaId: number
    Usado: boolean;
    EnMochila: boolean;
    MochilaBool: boolean;
    PistaBool: boolean;
    PistaString: string;
    MovilBool: boolean;
    PreguntaBool: boolean;
    Lugar: string;
    RequisitoObjeto:boolean;

    constructor(juegoDeEscaperoomId?:number, objetoEscaperoomId?: number, alumnoJuegoDeEscaperoomId?: number, equipoJuegoDeEscaperoomId?: number, RequisitoObjeto?:boolean) {
  
      this.objetoEscaperoomId = objetoEscaperoomId;
      this.alumnoJuegoDeEscaperoomId = alumnoJuegoDeEscaperoomId;
      this.equipoJuegoDeEscaperoomId = equipoJuegoDeEscaperoomId;
      this.Usado =false;
      this.EnMochila =false;
      this.RequisitoObjeto=RequisitoObjeto;
      this.juegoDeEscaperoomId=juegoDeEscaperoomId;
    }
  }