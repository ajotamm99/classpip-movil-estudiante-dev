export class AlumnoJuegoDeEscaperoom {

    PuntosTotalesAlumno: number;
    id: number;
    alumnoId: number;
    juegoDeEscaperoomId: number;
    TiempoEnResolver: number;
    Resuelto: boolean;
    MaxObjetos:number;
    ObjetosActivosEnMochila:number[];
  
    constructor(alumnoId?: number, juegoDeEscaperoomId?: number, PuntosTotalesAlumno?: number, MaxObjetos?:number) {
  
      this.PuntosTotalesAlumno = PuntosTotalesAlumno;
      this.alumnoId = alumnoId;
      this.juegoDeEscaperoomId = juegoDeEscaperoomId;
      this.TiempoEnResolver = 0;
      this.Resuelto = false;
      this.MaxObjetos=MaxObjetos;
      this.ObjetosActivosEnMochila=[];
    }
  }