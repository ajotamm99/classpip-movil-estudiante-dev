import { AlumnoJuegoDeEscaperoom } from './../../../../../clases/clasesParaJuegoDeEscapeRoom/AlumnoJuegoDeEscaperoom';
import { SesionService } from './../../../../../servicios/sesion.service';
import { PreguntaActiva } from './../../../../../clases/clasesParaJuegoDeEscapeRoom/PreguntaActiva';
import { SkinActiva } from './../../../../../clases/clasesParaJuegoDeEscapeRoom/SkinActiva';
import { ObjetoEscaperoom } from './../../../../../clases/clasesParaJuegoDeEscapeRoom/ObjetoEscaperoom';
import { ObjetoActivo } from './../../../../../clases/clasesParaJuegoDeEscapeRoom/ObjetoActivo';
import { EscenaEscaperoom } from './../../../../../clases/clasesParaJuegoDeEscapeRoom/EscenaEscaperoom';
import { EscenaActiva } from './../../../../../clases/clasesParaJuegoDeEscapeRoom/EscenaActiva';
import { Skin } from './../../../../../clases/clasesParaJuegoDeEscapeRoom/Skin';
import * as Phaser from 'phaser';
import { PeticionesAPIService } from 'src/app/servicios'; 

import { ScrollManager } from '../utilities/scroll-manager';
import { Pregunta } from 'src/app/clases/Pregunta';
import { Alumno } from 'src/app/clases';

export class LoadingScene extends Phaser.Scene {
    private backgroundKey = 'background-image'; // * Store the background image name
    private backgroundImageAsset = '/assets/prueba.jpeg'; // * Asset url relative to the app itself
    private backgroundImage: Phaser.GameObjects.Image; // * Reference for the background image
    private scrollManager: ScrollManager; // * Custom openforge utility for handling scroll
    

    constructor(private peticionesAPI: PeticionesAPIService,
        private sesion: SesionService) {
        super({ key: 'preloader' })
        
    }

    base
    inscripcionAlumnoJuegoDeEscaperoom: AlumnoJuegoDeEscaperoom
    juegoSeleccionado: any;
    alumno: Alumno;
    alumnos: Alumno[]=[];
    EscenasActivas: EscenaActiva[]=[];
    Escenas: EscenaEscaperoom[]=[];
    ObjetosActivos: ObjetoActivo[]=[];
    Objetos:ObjetoEscaperoom[]=[];
    Skin: SkinActiva;
    SkinDatos: Skin;
    Pregunta: Pregunta[]=[];
    PreguntasActivas: PreguntaActiva[]=[];

    tiempo: number;
    mecanica: string;
    puntos: number;

    getData(){
        this.juegoSeleccionado = this.sesion.DameJuego();
        this.alumno = this.sesion.DameAlumno();
        if (this.juegoSeleccionado.Modo === 'Individual') {
        // Traigo la inscripción del alumno
        this.peticionesAPI.DameInscripcionAlumnoJuegoDeEscaperoom(this.juegoSeleccionado.id, this.alumno.id)
        .subscribe (inscripcion => {
            this.inscripcionAlumnoJuegoDeEscaperoom = inscripcion[0];
            console.log ('ya tengo la inscripcion');
            console.log (this.inscripcionAlumnoJuegoDeEscaperoom);
            // traigo los alumnos del juego
            this.peticionesAPI.DameAlumnosjuegoDeEscaperoom(this.juegoSeleccionado.id)
            .subscribe (alumnos => {
                this.alumnos = alumnos;
            });
        });
        //this.peticionesAPI.DameEscenasActivasEscaperoom(this.juegoSeleccionado.id)
        //.subscribe (res=>{

        //})
        }
    }

    loadData(){
        this.load.setBaseURL('http://localhost:3000/api/imagenes');
        for (let i=0;i<this.EscenasActivas.length; i++){
            var key=(this.EscenasActivas[i].orden).toString();
            var image=this.Escenas.find(sc=>sc.id==this.EscenasActivas[i].escenaEscaperoomId).Tilesheet;
            var archive = this.Escenas.find(sc=>sc.id==this.EscenasActivas[i].escenaEscaperoomId).Archivo;
            this.load.image(key+'tiles', '/ImagenesEscenas/download/'+image);
            this.load.tilemapTiledJSON(key+'map', '/ArchivosEscenas/download/escena.json'+archive);
        }
        for (let b=0;b<this.ObjetosActivos.length; b++){

        }

    }

    async preload(): Promise<void> {
    }

    /**
     * * Load the blacksmith sprites
     */
    

    /**
     * * Phaser will only call create after all assets in Preload have been loaded
     */
    async create(): Promise<void> {

        var map=this.make.tilemap({key:'map'});
        var tilesheet=map.addTilesetImage('tilesetincial','tiles');
        
        var layer1 = map.createLayer('suelo',tilesheet);
        var solid= map.createLayer('solid', tilesheet);

    }

    /**
     * * When the screen is resized, we
     *
     * @param gameSize
     */
    resize(gameSize: Phaser.Structs.Size): void {
        console.log('Resizing', gameSize.width, gameSize.height);
        this.cameras.resize(gameSize.width, gameSize.height);
    }
}