export class JuegoDeEscapeRoom {

    id: number;
    escenarioEscaperoomId: number;
    grupoId: number;
    TiempoLimite: number;
    NombreJuego:string;
    JuegoActivo: boolean;
    Tipo: string;
    Presencial: string;
    Modo: string;
    Online: boolean;
    JuegoTerminado:boolean;
    MecanicaEspecial: string;

    constructor(escenarioEscaperoomId?: number, grupoId?:number, Presencial?:string, TiempoLimite?: number, Nombre?: string, Tipo?: string, Modo?: string, Online?: boolean, Activo?:boolean, MecanicaEspecial?: string){
        this.JuegoTerminado =false; 
        this.escenarioEscaperoomId =escenarioEscaperoomId;
        this.grupoId=grupoId;
        this.TiempoLimite=TiempoLimite;
        this.NombreJuego= Nombre;
        this.Tipo =Tipo;
        this.Modo =Modo;
        this.Online=Online;
        this.JuegoActivo =Activo;
        this.MecanicaEspecial=MecanicaEspecial;
        this.Presencial=Presencial;
    }

  }