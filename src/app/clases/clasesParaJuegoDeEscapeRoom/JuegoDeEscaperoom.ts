export class JuegoDeEscapeRoom {

    id: number;
    escenarioEscaperoomId: number;
    grupoId: number;
    TiempoLimite: number;
    Nombre:string;
    Activo: boolean;
    Tipo: string;
    Presencial: string;
    Modo: string;
    Online: boolean;
    Terminado:boolean;
    MecanicaEspecial: string;

    constructor(escenarioEscaperoomId?: number, grupoId?:number, Presencial?:string, TiempoLimite?: number, Nombre?: string, Tipo?: string, Modo?: string, Online?: boolean, Activo?:boolean, MecanicaEspecial?: string){
        this.Terminado =false; 
        this.escenarioEscaperoomId =escenarioEscaperoomId;
        this.grupoId=grupoId;
        this.TiempoLimite=TiempoLimite;
        this.Nombre= Nombre;
        this.Tipo =Tipo;
        this.Modo =Modo;
        this.Online=Online;
        this.Activo =Activo;
        this.MecanicaEspecial=MecanicaEspecial;
        this.Presencial=Presencial;
    }

  }